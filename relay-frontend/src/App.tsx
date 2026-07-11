import { useEffect, useState } from "react";
import GoalInput from '../src/components/GoalInput'
import type { IRun } from "./types";
import { getRun } from "./api/runs";

function App(){
  const [ latestRun, setLatestRun] = useState<IRun | null>(null)

  useEffect(() => {
    if(!latestRun || latestRun.status === 'completed' || latestRun.status === 'failed'){
      return;
    }

    const interval = setInterval(async()=>{
      const updated = await getRun(latestRun._id);
      setLatestRun(updated);
    }, 2000);

    return () => clearInterval(interval)
  }, [latestRun])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-6 p-6">
      <h1 className="text-2xl font-bold">RelayAI</h1>
      <GoalInput onRunCreated={setLatestRun}/>
      { latestRun && (
        <div className="text-sm text-gray-300 max-w-xl w-full">
          <p className="text-gray-400">Run: <span className="font-mono">{ latestRun._id }</span> - status: {latestRun.status}</p>
          { latestRun.agentOutputs.map((a)=>(
            <div className="text-sm text-gray-300 max-w-xl w-full">
              <p className="font-semibold capitalize">{a.agent}</p>
              <p className="text-gray-300 whitespace-pre-wrap">{a.output}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App;