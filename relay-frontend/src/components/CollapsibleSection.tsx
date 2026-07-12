import type { ReactNode } from "react";

interface ICollapsibleSection {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    statusLabel?: string;
    highlight?: boolean;
    children: ReactNode;
}

function CollapsibleSection({ title, isOpen, onToggle, statusLabel, highlight = false, children }: ICollapsibleSection) {
    return (
        <div
            className={`rounded-md overflow-hidden border ${highlight ? 'bg-green-900/20 border-green-700' : 'bg-gray-800 border-gray-700'
                }`}
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-3 text-left"
            >
                <span className="font-semibold capitalize">{title}</span>
                <div className="flex items-center gap-2">
                    {statusLabel && <span className="text-xs text-gray-400">{statusLabel}</span>}
                    <span className={`text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                </div>
            </button>
            {isOpen && <div className="px-3 pb-3">{children}</div>}
        </div>

    )
}

export default CollapsibleSection;