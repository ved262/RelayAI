export type RunStatus = 'pending' | 'in_progress' | 'complete' | 'failed'

export type AgentName = 'researcher' | 'summarizer' | 'writer';

export interface IAgentOutput{
    agent: AgentName;
    output: string;
    completedAt: Date;
}


export interface ISubTaskPlan{
    agent: AgentName;
    instructions: string;
}

export interface IRun{
    goal: string;
    status: RunStatus;
    plan: ISubTaskPlan[];
    agentOutputs: IAgentOutput[];
    finalResult?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IApiError {
    error: string;
}

