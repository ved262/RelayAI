import type { AgentName, IAgentOutput } from "../types";

const AGENTS: AgentName[] = ['researcher', 'summarizer', 'writer'];

interface IAgentTimelineProps {
    agentOutputs: IAgentOutput[];
    activeAgent: AgentName;
}

function AgentTimeline({ agentOutputs, activeAgent }: IAgentTimelineProps) {
    function statusFor(agent: AgentName): 'done' | 'active' | 'pending' {
        if (agentOutputs.some((o) => o.agent === agent)) return 'done';
        if (activeAgent === agent) return 'active'
        return 'pending'
    }

    return (
        <div className="flex gap-4 w-full max-w-xl">
            {AGENTS.map((agent) => {
                const status = statusFor(agent);
                return (
                    <div key={agent} className="flex-1 text-center">
                        <div
                            className={`h-2 rounded-full mb-2 ${status === 'done'
                                ? 'bg-green-500'
                                : status === 'active'
                                    ? 'bg-blue-500 animate-pulse'
                                    : 'bg-gray-700'
                                }`}
                        />
                        <p className="text-xs capitalize text-gray-400">{agent}</p>
                    </div>
                )
            })}
        </div>
    );
}

export default AgentTimeline;