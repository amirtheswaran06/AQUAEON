import React from 'react';
import {
  CloudCog,
  Radio,
  Cpu,
  BrainCircuit,
  Database,
  BarChart,
  Globe,
  ArrowRight,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const Architecture: React.FC = () => {
  const awsComponents = [
    {
      name: 'Simulated Subsea Pod Telemetry',
      icon: Radio,
      category: 'Simulated Edge Source',
      desc: 'Simulated acoustic modems & subsea umbilical cables streaming CPU load, heat exchanger differential temp, and pressure hull integrity.',
      color: 'text-[#21D4D8] border-[#21D4D8]/30',
    },
    {
      name: 'Simulated Continental DC Telemetry',
      icon: Radio,
      category: 'Simulated Edge Source',
      desc: 'Simulated facility CRAH sensors, mechanical chiller kilowatt meters, and cooling tower evaporative flow meters.',
      color: 'text-amber-400 border-amber-400/30',
    },
    {
      name: 'AWS IoT Core (Proposed Future)',
      icon: CloudCog,
      category: 'Ingestion Layer',
      desc: 'Scalable MQTT message broker for secure device gateway authentication and bidirectional telemetry synchronization.',
      color: 'text-teal-400 border-teal-400/30',
    },
    {
      name: 'AWS Lambda (Proposed Future)',
      icon: Cpu,
      category: 'Compute & Scheduling',
      desc: 'Serverless event-driven dispatchers triggering multi-criteria placement heuristics and routing workloads via hybrid VPC peering.',
      color: 'text-orange-400 border-orange-400/30',
    },
    {
      name: 'Amazon Bedrock (Proposed Future)',
      icon: BrainCircuit,
      category: 'AI / Foundation Models',
      desc: 'Foundation model orchestration for long-term weather forecasting, tidal current prediction, and workload queuing optimization.',
      color: 'text-purple-400 border-purple-400/30',
    },
    {
      name: 'Amazon DynamoDB (Proposed Future)',
      icon: Database,
      category: 'Persistence Layer',
      desc: 'Sub-millisecond latency NoSQL store persisting workload scheduling audit logs, operational history, and environmental metadata.',
      color: 'text-blue-400 border-blue-400/30',
    },
    {
      name: 'Amazon CloudWatch (Proposed Future)',
      icon: BarChart,
      category: 'Observability & Alarms',
      desc: 'Metrics collection, thermal threshold alarm triggers, and anomaly detection over hybrid facility infrastructure.',
      color: 'text-emerald-400 border-emerald-400/30',
    },
    {
      name: 'AQUAEON Web Dashboard',
      icon: Globe,
      category: 'Presentation Layer',
      desc: 'Modern React TypeScript operational frontend providing real-time visibility and direct administrative control.',
      color: 'text-[#21D4D8] border-[#21D4D8]/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white m-0">
            AWS Cloud Integration Architecture
          </h1>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold uppercase">
            Proposed Future Design
          </span>
        </div>
        <p className="text-sm text-[#94A3B8] mt-1">
          Target enterprise production architecture for scaling AQUAEON across distributed maritime and terrestrial infrastructure.
        </p>
      </div>

      {/* Prominent Architectural Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-amber-300 mb-0.5">
            Architectural Blueprint Notice:
          </strong>
          This diagram illustrates the intended production cloud infrastructure design. The current web application runs completely client-side in the browser using simulated in-memory telemetry, with zero database dependencies, no paid external APIs, and no AWS credentials required.
        </div>
      </div>

      {/* Architecture Flow Diagram */}
      <div className="p-6 bg-[#0B2942]/70 border border-[#153450] rounded-2xl shadow-lg">
        <h3 className="text-base font-semibold text-white mb-6">
          System Dataflow & Component Interaction Model
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-[#071827] border border-[#21D4D8]/30 text-center space-y-2">
            <Radio className="w-6 h-6 text-[#21D4D8] mx-auto" />
            <h4 className="text-xs font-bold text-white uppercase">1. Telemetry Ingest</h4>
            <p className="text-[11px] text-slate-400">
              Sensors stream thermals, PUE & power to AWS IoT Core MQTT endpoints.
            </p>
          </div>

          <div className="hidden md:flex justify-center text-[#21D4D8]">
            <ArrowRight className="w-6 h-6" />
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-[#071827] border border-orange-400/30 text-center space-y-2">
            <Cpu className="w-6 h-6 text-orange-400 mx-auto" />
            <h4 className="text-xs font-bold text-white uppercase">2. AI Dispatch Engine</h4>
            <p className="text-[11px] text-slate-400">
              AWS Lambda evaluates Bedrock models & thermal limits to assign node.
            </p>
          </div>

          <div className="hidden md:flex justify-center text-[#21D4D8]">
            <ArrowRight className="w-6 h-6" />
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-[#071827] border border-blue-400/30 text-center space-y-2">
            <Database className="w-6 h-6 text-blue-400 mx-auto" />
            <h4 className="text-xs font-bold text-white uppercase">3. Persistent Ledger</h4>
            <p className="text-[11px] text-slate-400">
              Amazon DynamoDB & CloudWatch record audit logs and carbon metrics.
            </p>
          </div>

          <div className="hidden md:flex justify-center text-[#21D4D8]">
            <ArrowRight className="w-6 h-6" />
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-[#071827] border border-emerald-400/30 text-center space-y-2">
            <Globe className="w-6 h-6 text-emerald-400 mx-auto" />
            <h4 className="text-xs font-bold text-white uppercase">4. AQUAEON UI</h4>
            <p className="text-[11px] text-slate-400">
              Operations console displays live analytics, control switches & reports.
            </p>
          </div>
        </div>
      </div>

      {/* Component Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {awsComponents.map((comp) => {
          const Icon = comp.icon;
          return (
            <div
              key={comp.name}
              className="p-4 rounded-xl bg-[#0B2942]/60 border border-[#153450] hover:border-[#21D4D8]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg border bg-[#071827] ${comp.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {comp.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{comp.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{comp.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
