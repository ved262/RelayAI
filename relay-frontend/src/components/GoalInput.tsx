import { useState } from "react";
import type { IRun } from "../types";
import { createRun } from "../api/runs";

interface GoalInputProps {
    onRunCreated: (run: IRun) => void
}

function GoalInput({ onRunCreated }: GoalInputProps) {
    const [goal, setGoal] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit() {
        if (!goal.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const run = await createRun(goal);
            onRunCreated(run);
            setGoal('');
        } catch (error) {
            setError('Failed to create run');
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-2 w-full max-w-xl">
            <textarea
                className="rounded-md bg-gray-800 text-white p-3 resize-none"
                rows={3}
                placeholder="e.g. research electric cars and write a summary"
                value={goal}
                onChange={(e)=> setGoal(e.target.value)}
            />
            <button
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-md py-2"
                onClick={handleSubmit}
                disabled={loading}
            >
                { loading ? 'Submitting' : 'Submit Goal'}
            </button>
            { error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
    );
}

export default GoalInput