import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  DataCenterMetrics,
  HourlyTrendPoint,
  LocationType,
  SimulationSettings,
  TelemetryAlert,
  Workload,
} from '../types';
import {
  INITIAL_ALERTS,
  INITIAL_LAND_DC,
  INITIAL_SETTINGS,
  INITIAL_TREND_HISTORY,
  INITIAL_UNDERWATER_DC,
  INITIAL_WORKLOADS,
} from '../data/initialData';
import { calculateServerPowerWatts, calculateFacilityPowerWatts } from '../engine/energyCalculator';
import { evaluateAndScheduleWorkload } from '../engine/scheduler';

interface SimulationContextType {
  isRunning: boolean;
  settings: SimulationSettings;
  underwaterDC: DataCenterMetrics;
  landDC: DataCenterMetrics;
  workloads: Workload[];
  alerts: TelemetryAlert[];
  trendHistory: HourlyTrendPoint[];
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  updateSettings: (newSettings: SimulationSettings) => void;
  restoreDefaultSettings: () => void;
  submitWorkload: (workload: Omit<Workload, 'id' | 'status' | 'submittedAt'>) => {
    success: boolean;
    reason: string;
    workloadId?: string;
  };
  cancelWorkload: (id: string) => void;
  completeWorkload: (id: string) => void;
  retryWorkload: (id: string) => void;
  resolveAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [settings, setSettings] = useState<SimulationSettings>(INITIAL_SETTINGS);
  const [underwaterDC, setUnderwaterDC] = useState<DataCenterMetrics>(INITIAL_UNDERWATER_DC);
  const [landDC, setLandDC] = useState<DataCenterMetrics>(INITIAL_LAND_DC);
  const [workloads, setWorkloads] = useState<Workload[]>(INITIAL_WORKLOADS);
  const [alerts, setAlerts] = useState<TelemetryAlert[]>(INITIAL_ALERTS);
  const [trendHistory, setTrendHistory] = useState<HourlyTrendPoint[]>(INITIAL_TREND_HISTORY);

  // Interval timer reference
  const intervalRef = useRef<number | null>(null);

  // Simulation tick logic
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const intervalTime = Math.max(800, 3000 / settings.simulationSpeedMultiplier);

    intervalRef.current = window.setInterval(() => {
      // 1. Process active running workloads (simulate completion progression)
      setWorkloads(prevWorkloads => {
        let hasChanges = false;
        const now = Date.now();
        const updated = prevWorkloads.map(w => {
          if (w.status === 'Running' && w.startedAt) {
            const elapsedMinutes = (now - new Date(w.startedAt).getTime()) / (1000 * 60) * (settings.simulationSpeedMultiplier * 1.5);
            if (elapsedMinutes >= w.durationMinutes) {
              hasChanges = true;
              return {
                ...w,
                status: 'Completed' as const,
                completedAt: new Date().toISOString(),
              };
            }
          }
          return w;
        });
        return hasChanges ? updated : prevWorkloads;
      });

      // 2. Recalculate CPU utilization based on active running workloads + natural base fluctuations
      setUnderwaterDC(prev => {
        // Natural temperature drift based on CPU and water cooling
        const targetTemp = 24 + (prev.cpuUtilization / 100) * 11; // 24C to 35C
        const newTemp = prev.temperature + (targetTemp - prev.temperature) * 0.08 + (Math.random() * 0.4 - 0.2);

        // Small realistic load jitter (+- 1.5%)
        const jitter = (Math.random() - 0.5) * 2;
        const boundedCpu = Math.min(99, Math.max(10, prev.cpuUtilization + jitter));
        const serverWatts = calculateServerPowerWatts(settings.idleServerPowerWatts, settings.maxServerPowerWatts, boundedCpu);
        const facilityWatts = calculateFacilityPowerWatts(serverWatts, settings.underwaterPue);

        return {
          ...prev,
          pue: settings.underwaterPue,
          safeCpuLimit: settings.underwaterSafeCpuLimit,
          tempWarningLimit: settings.underwaterTempWarningLimit,
          cpuUtilization: Number(boundedCpu.toFixed(1)),
          temperature: Number(newTemp.toFixed(1)),
          currentPowerWatts: Number(facilityWatts.toFixed(1)),
        };
      });

      setLandDC(prev => {
        // Land-based higher thermal rise
        const targetTemp = 28 + (prev.cpuUtilization / 100) * 15; // 28C to 43C
        const newTemp = prev.temperature + (targetTemp - prev.temperature) * 0.08 + (Math.random() * 0.4 - 0.2);

        const jitter = (Math.random() - 0.5) * 2;
        const boundedCpu = Math.min(99, Math.max(12, prev.cpuUtilization + jitter));
        const serverWatts = calculateServerPowerWatts(settings.idleServerPowerWatts, settings.maxServerPowerWatts, boundedCpu);
        const facilityWatts = calculateFacilityPowerWatts(serverWatts, settings.landPue);

        return {
          ...prev,
          pue: settings.landPue,
          safeCpuLimit: settings.landSafeCpuLimit,
          tempWarningLimit: settings.landTempWarningLimit,
          cpuUtilization: Number(boundedCpu.toFixed(1)),
          temperature: Number(newTemp.toFixed(1)),
          currentPowerWatts: Number(facilityWatts.toFixed(1)),
        };
      });

      // 3. Periodic telemetry alerts generation if thresholds are breached
      if (Math.random() < 0.2) {
        if (underwaterDC.cpuUtilization > settings.underwaterSafeCpuLimit - 5) {
          setAlerts(prev => [
            {
              id: `alt-${Date.now()}`,
              severity: 'warning',
              title: 'Underwater DC High Utilization Notice',
              description: `Underwater CPU at ${underwaterDC.cpuUtilization}%, close to safe limit of ${settings.underwaterSafeCpuLimit}%.`,
              affectedTarget: 'Underwater',
              timestamp: new Date().toLocaleTimeString(),
              status: 'active',
            },
            ...prev.slice(0, 19),
          ]);
        } else if (landDC.temperature >= settings.landTempWarningLimit - 2) {
          setAlerts(prev => [
            {
              id: `alt-${Date.now()}`,
              severity: 'warning',
              title: 'Land DC Chiller Stress Warning',
              description: `Facility temperature at ${landDC.temperature}°C approaching limit of ${settings.landTempWarningLimit}°C.`,
              affectedTarget: 'Land-Based',
              timestamp: new Date().toLocaleTimeString(),
              status: 'active',
            },
            ...prev.slice(0, 19),
          ]);
        }
      }

    }, intervalTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, settings, underwaterDC.cpuUtilization, landDC.cpuUtilization, underwaterDC.temperature, landDC.temperature]);

  const startSimulation = () => setIsRunning(true);
  const pauseSimulation = () => setIsRunning(false);

  const resetSimulation = () => {
    setIsRunning(false);
    setSettings(INITIAL_SETTINGS);
    setUnderwaterDC(INITIAL_UNDERWATER_DC);
    setLandDC(INITIAL_LAND_DC);
    setWorkloads(INITIAL_WORKLOADS);
    setAlerts(INITIAL_ALERTS);
    setTrendHistory(INITIAL_TREND_HISTORY);
  };

  const updateSettings = (newSettings: SimulationSettings) => {
    setSettings(newSettings);
    // Refresh derived properties
    setUnderwaterDC(prev => ({
      ...prev,
      pue: newSettings.underwaterPue,
      safeCpuLimit: newSettings.underwaterSafeCpuLimit,
      tempWarningLimit: newSettings.underwaterTempWarningLimit,
      waterFactor: newSettings.underwaterWaterFactor,
    }));
    setLandDC(prev => ({
      ...prev,
      pue: newSettings.landPue,
      safeCpuLimit: newSettings.landSafeCpuLimit,
      tempWarningLimit: newSettings.landTempWarningLimit,
      waterFactor: newSettings.landWaterFactor,
    }));
  };

  const restoreDefaultSettings = () => {
    updateSettings(INITIAL_SETTINGS);
  };

  const submitWorkload = (workloadInput: Omit<Workload, 'id' | 'status' | 'submittedAt'>) => {
    const decision = evaluateAndScheduleWorkload(workloadInput, underwaterDC, landDC, settings);
    const newId = `wl-${Date.now().toString().slice(-4)}`;

    if (!decision.isEligible) {
      const rejectedWorkload: Workload = {
        ...workloadInput,
        id: newId,
        status: 'Rejected',
        submittedAt: new Date().toISOString(),
        rejectionReason: decision.rejectionReason,
      };
      setWorkloads(prev => [rejectedWorkload, ...prev]);

      // Alert for rejected workload
      setAlerts(prev => [
        {
          id: `alt-${Date.now()}`,
          severity: 'critical',
          title: 'Workload Placement Rejected',
          description: `Workload "${workloadInput.name}" rejected: ${decision.rejectionReason}`,
          affectedTarget: 'System',
          timestamp: new Date().toLocaleTimeString(),
          status: 'active',
        },
        ...prev,
      ]);

      return {
        success: false,
        reason: decision.rejectionReason || 'Unable to schedule workload safely.',
        workloadId: newId,
      };
    }

    const assignedLoc: LocationType = decision.selectedLocation!;
    const isUnderwater = assignedLoc === 'Underwater';
    const energy = isUnderwater ? decision.estimatedEnergyUnderwater : decision.estimatedEnergyLand;
    const water = isUnderwater ? decision.estimatedWaterUnderwater : decision.estimatedWaterLand;
    const energySaved = decision.energyDiffKWh && decision.energyDiffKWh > 0 ? decision.energyDiffKWh : 0;
    const waterSaved = decision.waterDiffLiters && decision.waterDiffLiters > 0 ? decision.waterDiffLiters : 0;

    const acceptedWorkload: Workload = {
      ...workloadInput,
      id: newId,
      assignedLocation: assignedLoc,
      estimatedEnergyKWh: energy,
      estimatedWaterLiters: water,
      energySavedKWh: energySaved,
      waterSavedLiters: waterSaved,
      status: 'Running',
      submittedAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      scheduledReason: decision.selectionReason,
    };

    setWorkloads(prev => [acceptedWorkload, ...prev]);

    // Update the chosen DC capacity and metrics immediately
    if (isUnderwater) {
      setUnderwaterDC(prev => {
        const newCpu = Math.min(100, prev.cpuUtilization + workloadInput.cpuRequired);
        return {
          ...prev,
          cpuUtilization: Number(newCpu.toFixed(1)),
          workloadCount: prev.workloadCount + 1,
          activeWorkloadIds: [...prev.activeWorkloadIds, newId],
        };
      });
    } else {
      setLandDC(prev => {
        const newCpu = Math.min(100, prev.cpuUtilization + workloadInput.cpuRequired);
        return {
          ...prev,
          cpuUtilization: Number(newCpu.toFixed(1)),
          workloadCount: prev.workloadCount + 1,
          activeWorkloadIds: [...prev.activeWorkloadIds, newId],
        };
      });
    }

    // Add informational notification
    setAlerts(prev => [
      {
        id: `alt-${Date.now()}`,
        severity: 'info',
        title: `Workload Scheduled: ${assignedLoc}`,
        description: `Scheduled "${workloadInput.name}". Reason: ${decision.selectionReason}`,
        affectedTarget: assignedLoc,
        timestamp: new Date().toLocaleTimeString(),
        status: 'active',
      },
      ...prev,
    ]);

    return {
      success: true,
      reason: decision.selectionReason,
      workloadId: newId,
    };
  };

  const cancelWorkload = (id: string) => {
    setWorkloads(prev => {
      const wl = prev.find(w => w.id === id);
      if (!wl || wl.status !== 'Running') return prev;

      // Release CPU capacity
      if (wl.assignedLocation === 'Underwater') {
        setUnderwaterDC(dc => ({
          ...dc,
          cpuUtilization: Math.max(10, Number((dc.cpuUtilization - wl.cpuRequired).toFixed(1))),
          workloadCount: Math.max(0, dc.workloadCount - 1),
          activeWorkloadIds: dc.activeWorkloadIds.filter(wid => wid !== id),
        }));
      } else if (wl.assignedLocation === 'Land-Based') {
        setLandDC(dc => ({
          ...dc,
          cpuUtilization: Math.max(10, Number((dc.cpuUtilization - wl.cpuRequired).toFixed(1))),
          workloadCount: Math.max(0, dc.workloadCount - 1),
          activeWorkloadIds: dc.activeWorkloadIds.filter(wid => wid !== id),
        }));
      }

      return prev.map(w => (w.id === id ? { ...w, status: 'Cancelled' as const } : w));
    });
  };

  const completeWorkload = (id: string) => {
    setWorkloads(prev => {
      const wl = prev.find(w => w.id === id);
      if (!wl || wl.status !== 'Running') return prev;

      // Release CPU capacity
      if (wl.assignedLocation === 'Underwater') {
        setUnderwaterDC(dc => ({
          ...dc,
          cpuUtilization: Math.max(10, Number((dc.cpuUtilization - wl.cpuRequired).toFixed(1))),
          workloadCount: Math.max(0, dc.workloadCount - 1),
          activeWorkloadIds: dc.activeWorkloadIds.filter(wid => wid !== id),
        }));
      } else if (wl.assignedLocation === 'Land-Based') {
        setLandDC(dc => ({
          ...dc,
          cpuUtilization: Math.max(10, Number((dc.cpuUtilization - wl.cpuRequired).toFixed(1))),
          workloadCount: Math.max(0, dc.workloadCount - 1),
          activeWorkloadIds: dc.activeWorkloadIds.filter(wid => wid !== id),
        }));
      }

      return prev.map(w =>
        w.id === id ? { ...w, status: 'Completed' as const, completedAt: new Date().toISOString() } : w
      );
    });
  };

  const retryWorkload = (id: string) => {
    const wl = workloads.find(w => w.id === id);
    if (!wl) return;

    submitWorkload({
      name: `${wl.name} (Retry)`,
      type: wl.type,
      cpuRequired: wl.cpuRequired,
      durationMinutes: wl.durationMinutes,
      priority: wl.priority,
      memoryGB: wl.memoryGB,
      preferredLocation: wl.preferredLocation,
    });
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, status: 'resolved' as const } : a)));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <SimulationContext.Provider
      value={{
        isRunning,
        settings,
        underwaterDC,
        landDC,
        workloads,
        alerts,
        trendHistory,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        updateSettings,
        restoreDefaultSettings,
        submitWorkload,
        cancelWorkload,
        completeWorkload,
        retryWorkload,
        resolveAlert,
        dismissAlert,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
