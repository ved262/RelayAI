import { useEffect, useState } from "react";
import type { AgentName, IAgentOutput, RunStatus } from "../types";
import CollapsibleSection from "./CollapsibleSection";
import MarkdownRenderer from "./MarkdownRenderer";

interface IResultPanelProps {
    agentOutputs: IAgentOutput[];
    activeAgent: AgentName | null;
    finalResult?: string;
    status: RunStatus;
}

function ResultPanel({ agentOutputs, activeAgent, finalResult, status }: IResultPanelProps) {
    const [openSection, setOpenSection] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'completed' && finalResult) {
            setOpenSection('final');
        } else if (activeAgent) {
            setOpenSection(activeAgent);
        } else if (agentOutputs.length > 0) {
            setOpenSection(agentOutputs[agentOutputs.length - 1].agent);
        }

    }, [activeAgent, agentOutputs.length, status, finalResult]);

    function toggle(section: string) {
        setOpenSection((prev: string | null) => (prev === section ? null : section));
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            {agentOutputs.map((a) => (
                <CollapsibleSection key={a.agent} title={a.agent} statusLabel="done" isOpen={openSection === a.agent} onToggle={() => toggle(a.agent)}>
                    <MarkdownRenderer content={a.output} />
                </CollapsibleSection>
            ))}

            {status === 'completed' && finalResult && (
                <CollapsibleSection title="Final Result" isOpen={openSection === 'final'} onToggle={() => toggle('final')} highlight statusLabel="✓">
                    <MarkdownRenderer content={finalResult} />
                </CollapsibleSection>
            )}
        </div>
    )
}


export default ResultPanel;