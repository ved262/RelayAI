import { useState } from "react";
import GoalInput from '../src/components/GoalInput'
import type { IRun } from "./types";
import { useSocket } from "./hooks/useSocket";
import AgentTimeline from "./components/AgentTimeline";
import { getRunById } from "./api/runs";
import RunHistory from "./components/RunHistory";

function App() {
  const [createdRun, setCreatedRun] = useState<IRun | null>(null);
  const { activeAgent, liveRun } = useSocket(createdRun?._id ?? null, createdRun);
  const [historyKey, setHistoryKey] = useState(0);

  function handleRunCreated(run:IRun){
    setCreatedRun(run);
    setHistoryKey((k)=>k+1);
  }

  async function handleSelectRun(runId:string){
    const run = await getRunById(runId);
    setCreatedRun(run);
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-6 p-6">
      <h1 className="text-2xl font-bold">RelayAI</h1>
      <GoalInput onRunCreated={handleRunCreated} />

      {liveRun && (
        <div className="w-full max-w-xl flex flex-col gap-6">
          <AgentTimeline agentOutputs={liveRun.agentOutputs} activeAgent={activeAgent}/>
          <div className="text-sm text-gray-300">
            <p className="text-gray-400 mb-2">
              Run: <span className="font-mono">{liveRun._id}</span> — status: {liveRun.status}
            </p>
            {
              liveRun.agentOutputs.map((a)=>(
                <div key={a.agent} className="mt-3 bg-gray-800 p-3 rounded-md">
                  <p className="font-semibold capitalize">{a.agent}</p>
                  <p className="text-gray-300 whitespace-pre-wrap">{a.output}</p>
                </div>
              ))
            }
          </div>
          { liveRun.status==='completed' && liveRun.finalResult && (
            <div className="bg-green-900/30 border border-green-700 p-4 rounded-md">
               <p className="font-semibold text-green-400 mb-2">Final Result</p>
               <p className="text-gray-200 whitespace-pre-wrap">{liveRun.finalResult}</p>
            </div>
          )}
        </div>
      )}

      <RunHistory onSelectRun={handleSelectRun} refreshKey={historyKey}/>
    </div>
  )
}

export default App;