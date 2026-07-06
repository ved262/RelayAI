export type RunStatus = 'pending' | 'in_progress' | 'completed' | 'failed'

export interface IAgentOutput{
    agent: 'researcher' | 'summarizer' | 'writer';
    output: string;
    completedAt: string;
}

export interface IRun{
    _id: string;
    goal: string;
    status: RunStatus;
    agentOutputs: IAgentOutput[];
    result: string;
    createdAt: string;
    updatedAt: string;
}