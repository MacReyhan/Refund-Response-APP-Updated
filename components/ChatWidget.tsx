import React, { useState } from 'react';
import { MessageSquare, X, Check, ArrowRight } from 'lucide-react';
import { parseRefundText } from '../utils/parser';
import { FormData } from '../types';

interface ChatWidgetProps {
    onDataExtracted: (data: Partial<FormData>) => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onDataExtracted }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [lastExtracted, setLastExtracted] = useState<Partial<FormData> | null>(null);

    const handleExtract = () => {
        if (!inputText.trim()) return;
        const data = parseRefundText(inputText);
        setLastExtracted(data);
        onDataExtracted(data);

        // Auto clear after short delay or keep it?
        // Let's keep it to show feedback
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 z-50 p-4 bg-brand-royal text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 group"
                title="Open Chat Parser"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:animate-pulse" />}
            </button>

            {/* Chat Interface */}
            {isOpen && (
                <div className="fixed bottom-24 right-8 z-50 w-80 md:w-96 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300">

                    {/* Header */}
                    <div className="bg-brand-royal p-4 flex justify-between items-center text-white">
                        <h3 className="font-bold flex items-center gap-2">
                            <MessageSquare size={18} />
                            Refund Data Extractor
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex-1 flex flex-col gap-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Paste the raw refund text below to auto-fill the form.
                        </p>

                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Paste refund details here..."
                            className="w-full h-32 p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-brand-royal/50 outline-none resize-none placeholder:text-gray-400 dark:text-gray-200"
                        />

                        <button
                            onClick={handleExtract}
                            disabled={!inputText}
                            className="w-full py-3 bg-brand-royal hover:bg-brand-royal/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-royal/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowRight size={18} />
                            Extract & Fill Form
                        </button>

                        {/* Success Feedback */}
                        {lastExtracted && (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-bold mb-1">
                                    <Check size={14} strokeWidth={3} />
                                    Data Extracted!
                                </div>
                                <div className="text-xs text-green-600 dark:text-green-300 space-y-0.5">
                                    {lastExtracted.amount && <p>Amount: {lastExtracted.amount}</p>}
                                    {lastExtracted.mode && <p>Mode: {lastExtracted.mode}</p>}
                                    {lastExtracted.status && <p>Status: {lastExtracted.status}</p>}
                                    {lastExtracted.sla && <p>SLA: {lastExtracted.sla}</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
