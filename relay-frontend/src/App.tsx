import { useEffect, useState } from "react";
import { checkHealth } from "./api/health";

function App(){
  const [status, setStatus] = useState<string>('Checking...');

  useEffect(()=>{
    checkHealth()
    .then((res)=> setStatus(res.status))
    .catch(()=> setStatus("Backend unreachable"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <p className="text-xl">Backend Status: <span className="font-bond">{status}</span></p>
    </div>
  )
}

export default App;