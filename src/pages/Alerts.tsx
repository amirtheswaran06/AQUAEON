import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Filter,
  Trash2,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { AlertSeverity } from '../types';

export const Alerts: React.FC = () => {
  const { alerts, resolveAlert, dismissAlert } = useSimulation();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white m-0">
            Alerts & Telemetry Events
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Real-time environmental threshold warnings, thermal triggers, and workload placement event notifications.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-medium">
            {alerts.filter((a) => a.severity === 'critical' && a.status === 'active').length} Critical
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">
            {alerts.filter((a) => a.severity === 'warning' && a.status === 'active').length} Warnings
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-[#0B2942]/50 border border-[#153450] rounded-xl text-xs">
        <div className="flex items-center gap-1.5 text-[#94A3B8] font-medium mr-2">
          <Filter className="w-4 h-4 text-[#21D4D8]" />
          <span>Filters:</span>
        </div>

        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="bg-[#071827] border border-[#153450] text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#21D4D8] outline-none"
        >
          <option value="ALL">All Severities</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Informational</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#071827] border border-[#153450] text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#21D4D8] outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="resolved">Resolved Only</option>
        </select>

        <span className="ml-auto text-[#94A3B8]">
          Showing {filteredAlerts.length} events
        </span>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-[#0B2942]/40 border border-[#153450] rounded-xl text-slate-400 text-sm">
            No telemetry alerts found matching current filter criteria.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                alert.status === 'resolved'
                  ? 'bg-[#071827]/40 border-[#153450]/60 opacity-60'
                  : alert.severity === 'critical'
                  ? 'bg-red-950/20 border-red-500/40 shadow-sm shadow-red-500/10'
                  : alert.severity === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'bg-[#0B2942]/70 border-[#153450]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {alert.severity === 'critical' ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : alert.severity === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Info className="w-5 h-5 text-[#21D4D8]" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">{alert.title}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                        alert.severity === 'critical'
                          ? 'bg-red-500/20 text-red-300'
                          : alert.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-[#21D4D8]/20 text-[#21D4D8]'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Target: {alert.affectedTarget}
                    </span>
                    <span className="text-[11px] text-slate-500">• {alert.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {alert.status === 'active' ? (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-2.5 py-1 rounded bg-[#071827] hover:bg-[#153450] text-emerald-400 border border-emerald-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Acknowledge</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 font-medium italic">Resolved</span>
                )}

                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-[#153450] transition-colors"
                  title="Dismiss alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
