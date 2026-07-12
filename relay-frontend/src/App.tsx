import { useState } from "react";
import GoalInput from '../src/components/GoalInput'
import type { IRun } from "./types";
import { useSocket } from "./hooks/useSocket";
import { getRunById } from "./api/runs";
import RunHistory from "./components/RunHistory";
import ResultPanel from "./components/ResultPanel";
import AgentTimeline from "./components/agentTimeline";

function App() {
  const [createdRun, setCreatedRun] = useState<IRun | null>(null);
  const { activeAgent, liveRun } = useSocket(createdRun?._id ?? null, createdRun);
  const [historyKey, setHistoryKey] = useState(0);

  function handleRunCreated(run: IRun) {
    setCreatedRun(run);
    setHistoryKey((k) => k + 1);
  }

  async function handleSelectRun(runId: string) {
    const run = await getRunById(runId);
    setCreatedRun(run);
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-6 p-6">
      <h1 className="text-2xl font-bold">RelayAI</h1>
      <GoalInput onRunCreated={handleRunCreated} />

      {liveRun && (
        <div className="w-full max-w-xl flex flex-col gap-6">
          <AgentTimeline agentOutputs={liveRun.agentOutputs} activeAgent={activeAgent} />
          <div className="text-sm text-gray-300">
            <p className="text-gray-400 mb-2">
              Run: <span className="font-mono">{liveRun._id}</span> — status: {liveRun.status}
            </p>
            <ResultPanel
              agentOutputs={liveRun.agentOutputs}
              activeAgent={activeAgent}
              finalResult={liveRun.finalResult}
              status={liveRun.status}
            />
          </div>
        </div>
      )}

      <RunHistory onSelectRun={handleSelectRun} refreshKey={historyKey} />
    </div>
  )
}

export default App;