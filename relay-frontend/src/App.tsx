import { useState } from "react";
import GoalInput from '../src/components/GoalInput'
import type { IRun } from "./types";

function App(){
  const [ latestRun, setLatestRun] = useState<IRun | null>(null)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-6 p-6">
      <h1 className="text-2xl font-bold">RelayAI</h1>
      <GoalInput onRunCreated={setLatestRun}/>
      { latestRun && (
        <p className="text-sm text-gray-400">
          Run created: <span className="font-mono">{latestRun._id}</span> - status: {latestRun.status}
        </p>
      )}
    </div>
  )
}

export default App;