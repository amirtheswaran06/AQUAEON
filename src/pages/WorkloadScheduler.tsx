import React, { useState } from 'react';
import {
  CalendarClock,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  AlertTriangle,
  Info,
  X,
  Sparkles,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import {
  Workload,
  WorkloadPriority,
  WorkloadType,
  WorkloadLocationPreference,
} from '../types';

export const WorkloadScheduler: React.FC = () => {
  const {
    workloads,
    submitWorkload,
    cancelWorkload,
    completeWorkload,
    retryWorkload,
    underwaterDC,
    landDC,
    settings,
  } = useSimulation();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkload, setSelectedWorkload] = useState<Workload | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<WorkloadType>('AI Model Inference');
  const [cpuRequired, setCpuRequired] = useState<number>(20);
  const [durationMinutes, setDurationMinutes] = useState<number>(10);
  const [priority, setPriority] = useState<WorkloadPriority>('Normal');
  const [memoryGB, setMemoryGB] = useState<number>(32);
  const [preferredLocation, setPreferredLocation] = useState<WorkloadLocationPreference>('Automatic');
  const [formError, setFormError] = useState<string | null>(null);
  const [lastSubmissionResult, setLastSubmissionResult] = useState<{
    success: boolean;
    reason: string;
  } | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setLastSubmissionResult(null);

    // Validation
    if (!name.trim()) {
      setFormError('Workload name is required.');
      return;
    }
    if (cpuRequired <= 0 || cpuRequired > 100) {
      setFormError('Required CPU capacity must be greater than 0% and no greater than 100%.');
      return;
    }
    if (durationMinutes <= 0) {
      setFormError('Duration must be greater than 0 minutes.');
      return;
    }

    const result = submitWorkload({
      name: name.trim(),
      type,
      cpuRequired,
      durationMinutes,
      priority,
      memoryGB,
      preferredLocation,
    });

    setLastSubmissionResult(result);

    if (result.success) {
      // Reset form
      setName('');
      setCpuRequired(20);
      setDurationMinutes(10);
      setPriority('Normal');
      setMemoryGB(32);
      setPreferredLocation('Automatic');
      setTimeout(() => {
        setIsModalOpen(false);
        setLastSubmissionResult(null);
      }, 1500);
    }
  };

  const filteredWorkloads = workloads.filter((w) => {
    if (statusFilter !== 'ALL' && w.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && w.priority !== priorityFilter) return false;
    if (locationFilter !== 'ALL' && w.assignedLocation !== locationFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Call to Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white m-0">
            Workload Scheduler & Dispatch Engine
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Submit compute jobs for multi-criteria placement optimization across subsea and terrestrial data centers.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setLastSubmissionResult(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#14B8A6] to-[#21D4D8] hover:opacity-95 text-[#071827] font-semibold text-sm rounded-lg shadow-lg shadow-[#21D4D8]/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Submit New Workload</span>
        </button>
      </div>

      {/* Headroom Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#0B2942]/70 border border-[#21D4D8]/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#21D4D8] uppercase tracking-wider">
              Underwater Subsea Node
            </span>
            <p className="text-sm text-slate-300 mt-0.5">
              Current CPU: <strong className="text-white">{underwaterDC.cpuUtilization}%</strong> (Safety Cap: {settings.underwaterSafeCpuLimit}%)
            </p>
          </div>
          <span className="text-sm font-bold px-2.5 py-1 rounded bg-[#21D4D8]/10 text-[#21D4D8] border border-[#21D4D8]/30">
            {(settings.underwaterSafeCpuLimit - underwaterDC.cpuUtilization).toFixed(1)}% Available
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B2942]/70 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Land-Based Facility Node
            </span>
            <p className="text-sm text-slate-300 mt-0.5">
              Current CPU: <strong className="text-white">{landDC.cpuUtilization}%</strong> (Safety Cap: {settings.landSafeCpuLimit}%)
            </p>
          </div>
          <span className="text-sm font-bold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
            {(settings.landSafeCpuLimit - landDC.cpuUtilization).toFixed(1)}% Available
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-[#0B2942]/50 border border-[#153450] rounded-xl text-xs">
        <div className="flex items-center gap-1.5 text-[#94A3B8] font-medium mr-2">
          <Filter className="w-4 h-4 text-[#21D4D8]" />
          <span>Filters:</span>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#071827] border border-[#153450] text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#21D4D8] outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="Running">Running</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-[#071827] border border-[#153450] text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#21D4D8] outline-none"
        >
          <option value="ALL">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
          <option value="Low">Low</option>
        </select>

        {/* Location Filter */}
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="bg-[#071827] border border-[#153450] text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#21D4D8] outline-none"
        >
          <option value="ALL">All Locations</option>
          <option value="Underwater">Underwater</option>
          <option value="Land-Based">Land-Based</option>
        </select>

        <span className="ml-auto text-[#94A3B8]">
          Showing <strong>{filteredWorkloads.length}</strong> of {workloads.length} workloads
        </span>
      </div>

      {/* Workloads Table */}
      <div className="bg-[#0B2942]/70 border border-[#153450] rounded-xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#071827]/90 border-b border-[#153450] text-[#94A3B8] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Workload Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">CPU</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Est. Energy</th>
                <th className="py-3 px-3">Est. Water</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#153450]/60 text-slate-300">
              {filteredWorkloads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No workloads matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredWorkloads.map((wl) => (
                  <tr
                    key={wl.id}
                    className="hover:bg-[#0B2942] transition-colors cursor-pointer"
                    onClick={() => setSelectedWorkload(wl)}
                  >
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#94A3B8]">{wl.id}</span>
                      <span className="truncate max-w-[180px]">{wl.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{wl.type}</td>
                    <td className="py-3 px-3 font-semibold text-white">{wl.cpuRequired}%</td>
                    <td className="py-3 px-3">{wl.durationMinutes}m</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          wl.priority === 'Critical'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : wl.priority === 'High'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-700/50 text-slate-300'
                        }`}
                      >
                        {wl.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {wl.assignedLocation === 'Underwater' ? (
                        <span className="text-[#21D4D8] font-medium flex items-center gap-1">
                          Underwater
                        </span>
                      ) : wl.assignedLocation === 'Land-Based' ? (
                        <span className="text-amber-400 font-medium flex items-center gap-1">
                          Land-Based
                        </span>
                      ) : (
                        <span className="text-slate-500">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {wl.estimatedEnergyKWh ? `${wl.estimatedEnergyKWh.toFixed(2)} kWh` : '-'}
                    </td>
                    <td className="py-3 px-3">
                      {wl.estimatedWaterLiters ? `${wl.estimatedWaterLiters.toFixed(2)} L` : '-'}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          wl.status === 'Running'
                            ? 'bg-[#21D4D8]/20 text-[#21D4D8] border border-[#21D4D8]/30'
                            : wl.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : wl.status === 'Rejected'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {wl.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                      {wl.status === 'Running' && (
                        <>
                          <button
                            onClick={() => completeWorkload(wl.id)}
                            className="p-1 rounded hover:bg-emerald-500/20 text-emerald-400"
                            title="Complete workload now"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => cancelWorkload(wl.id)}
                            className="p-1 rounded hover:bg-red-500/20 text-red-400"
                            title="Cancel workload"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {wl.status === 'Rejected' && (
                        <button
                          onClick={() => retryWorkload(wl.id)}
                          className="p-1 rounded hover:bg-[#21D4D8]/20 text-[#21D4D8]"
                          title="Retry workload evaluation"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUBMISSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0B2942] border border-[#153450] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#153450]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-[#21D4D8]/10 text-[#21D4D8] rounded-lg">
                <CalendarClock className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white m-0">Submit New Workload</h2>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {lastSubmissionResult && (
              <div
                className={`mb-4 p-3 rounded-lg text-xs flex items-start gap-2 ${
                  lastSubmissionResult.success
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-300'
                }`}
              >
                {lastSubmissionResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                )}
                <div>
                  <strong className="block mb-0.5">
                    {lastSubmissionResult.success ? 'Workload Accepted & Scheduled' : 'Workload Placement Rejected'}
                  </strong>
                  <span>{lastSubmissionResult.reason}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Workload Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Learning Transformer Training"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:border-[#21D4D8] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Workload Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as WorkloadType)}
                    className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                  >
                    <option value="AI Model Inference">AI Model Inference</option>
                    <option value="Scientific Computing">Scientific Computing</option>
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="Video Processing">Video Processing</option>
                    <option value="Batch Processing">Batch Processing</option>
                    <option value="File Processing">File Processing</option>
                    <option value="General Computing">General Computing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as WorkloadPriority)}
                    className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">CPU Req (%) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={cpuRequired}
                    onChange={(e) => setCpuRequired(Number(e.target.value))}
                    className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Duration (min) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Memory (GB)</label>
                  <input
                    type="number"
                    min="1"
                    value={memoryGB}
                    onChange={(e) => setMemoryGB(Number(e.target.value))}
                    className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Placement Preference</label>
                <select
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value as WorkloadLocationPreference)}
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                >
                  <option value="Automatic">Automatic (AI Multi-Factor Optimizer)</option>
                  <option value="Underwater">Prefer Underwater Pod</option>
                  <option value="Land-Based">Prefer Land-Based Facility</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Automatic mode dynamically selects the optimal node factoring in PUE, water intensity, and thermal limits.
                </p>
              </div>

              <div className="pt-3 border-t border-[#153450] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#071827] text-slate-300 hover:bg-[#153450]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#14B8A6] to-[#21D4D8] text-[#071827] font-semibold hover:opacity-90"
                >
                  Evaluate & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {selectedWorkload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0B2942] border border-[#153450] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedWorkload(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#153450]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#21D4D8]" />
              Workload Details & AI Placement Rationale
            </h2>
            <p className="text-xs text-slate-400 mb-4">{selectedWorkload.id} • {selectedWorkload.name}</p>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-[#071827] p-3 rounded-xl border border-[#153450]">
                <div>
                  <span className="text-slate-400">Assigned Node:</span>
                  <p className="font-semibold text-white">{selectedWorkload.assignedLocation || 'None'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Execution Status:</span>
                  <p className="font-semibold text-white">{selectedWorkload.status}</p>
                </div>
                <div>
                  <span className="text-slate-400">Estimated Energy:</span>
                  <p className="font-semibold text-amber-400">{selectedWorkload.estimatedEnergyKWh?.toFixed(3)} kWh</p>
                </div>
                <div>
                  <span className="text-slate-400">Estimated Water:</span>
                  <p className="font-semibold text-teal-400">{selectedWorkload.estimatedWaterLiters?.toFixed(3)} L</p>
                </div>
              </div>

              <div className="bg-[#071827] p-3 rounded-xl border border-[#153450]">
                <span className="text-[#21D4D8] font-semibold block mb-1">
                  Scheduling Decision Explanation
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {selectedWorkload.scheduledReason || selectedWorkload.rejectionReason || 'No detailed rationale recorded.'}
                </p>
              </div>

              <div className="text-[11px] text-slate-400">
                Submitted: {new Date(selectedWorkload.submittedAt).toLocaleString()}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#153450] flex justify-end">
              <button
                onClick={() => setSelectedWorkload(null)}
                className="px-4 py-2 rounded-lg bg-[#071827] text-slate-300 hover:bg-[#153450] text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
