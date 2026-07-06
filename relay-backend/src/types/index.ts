export type RunStatus = 'pending' | 'in_progress' | 'complete' | 'failed'

export interface IAgentOutput{
    agent: 'reasearcher' | 'summarizer' | 'writer';
    output: 'string';
    completedAt: Date;
}

export interface IRun{
    goal: string;
    status: RunStatus;
    agentOutputs: IAgentOutput[];
    finalResult?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IApiError {
    error: string;
}

