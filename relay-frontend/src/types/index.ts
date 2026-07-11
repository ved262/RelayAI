export type RunStatus = 'pending' | 'in_progress' | 'completed' | 'failed'
export type AgentName = 'researcher' | 'summarizer' | 'writer'

export interface IAgentOutput{
    agent: AgentName;
    output: string;
    completedAt: string;
}

export interface ISubtaskPlan{
    agent: AgentName;
    instructions: string;
}

export interface IRun{
    _id: string;
    goal: string;
    status: RunStatus;
    plan: ISubtaskPlan[];
    agentOutputs: IAgentOutput[];
    result: string;
    createdAt: string;
    updatedAt: string;
}