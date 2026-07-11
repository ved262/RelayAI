import { useEffect, useRef, useState } from "react";
import type { AgentName, IRun } from "../types";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface IUseSocketResult{
    activeAgent: AgentName | null;
    liveRun: IRun | null;
}

export function useSocket(runId: string | null, initialRun: IRun | null): IUseSocketResult {
    const [liveRun, setLiveRun] = useState<IRun | null>(initialRun); 
    const [activeAgent, setActiveAgent] = useState<AgentName | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(()=>{
        setLiveRun(initialRun);
    }, [initialRun]);

    useEffect(()=>{
        if(!runId) return;
        const socket = io(SOCKET_URL);

        socket.emit('join:run', runId);
        socket.on('agent:started', ({ agent }: { agent: AgentName})=>{
            setActiveAgent(agent);
        })

        socket.on('agent:completed', ({ agent, output}: { agent:AgentName, output: string})=>{
            setLiveRun((prev)=>{
                if(!prev) return prev;
                return {
                    ...prev,
                    agentOutputs: [ ...prev.agentOutputs, { agent, output }]
                };
            });
        });

        socket.on('run:completed', ({ finalResult }: { finalResult: string})=>{
            setActiveAgent(null);
            setLiveRun((prev)=> ( prev ? { ... prev, status: 'completed', finalResult }: prev));
        });

        socket.on('run:failed', ()=>{
            setActiveAgent(null);
            setLiveRun((prev)=> prev ? { ...prev, status: 'failed' }: prev);
        })

        return () => {
            socket.disconnect();
        };
    }, [runId]);
    return { activeAgent, liveRun};
}