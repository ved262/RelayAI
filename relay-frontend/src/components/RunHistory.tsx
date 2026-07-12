import { useEffect, useState } from "react";
import { type IRunSummary } from "../types";
import { getRuns } from "../api/runs";

interface IRunHistoryProps {
    onSelectRun(runId: string):  void;
    refreshKey: number;
}

function RunHistory({ onSelectRun, refreshKey }: IRunHistoryProps) {
    const [runs, setRuns] = useState<IRunSummary[] | []>([]);
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        setLoading(true);
        getRuns().then(setRuns).finally(() => setLoading(false));
    }, [refreshKey])

    if (loading) return <p className="text-gray-500 text-sm">Loading history...</p>;
    if (runs.length === 0) return <p className="text-gray-500 text-sm">No runs yet.</p>;

    return (
        <div className="w-full max-w-xl">
            <h2 className="text-sm font-semibold text-gray-400 mb-2">Run History</h2>
            <div className="flex flex-col gap-2">
                {runs.map((run) => (
                    <button
                        key={run._id}
                        onClick={() => onSelectRun(run._id)}
                        className="text-left bg-gray-800 hover:bg-gray-700 rounded-md p-3"
                    >
                        <p className="text-sm text-gray-200 truncate">{run.goal}</p>
                        <p className="text-xs text-gray-500">
                            {run.status} · {new Date(run.createdAt).toLocaleString()}
                        </p>
                    </button>

                ))}
            </div>
        </div>
    )
}

export default RunHistory;