import React, { useEffect, useState } from 'react';
import { Clipboard, Clock, MessageSquare, X, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: (text: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onCopy }) => {
  const [isLateHours, setIsLateHours] = useState<boolean>(false);

  useEffect(() => {
    // Use India Standard Time (UTC+5:30) check
    const updateTimeCheck = () => {
      const d = new Date();
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      const nd = new Date(utc + (3600000 * 5.5));
      const currentHour = nd.getHours();
      // If > 9 PM (21:00) OR < 9 AM (09:00)
      setIsLateHours(currentHour >= 21 || currentHour < 9);
    };

    updateTimeCheck();
    // Re-check every minute
    const interval = setInterval(updateTimeCheck, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />
      
      <div
        className={`fixed top-0 left-0 h-full w-[320px] z-50 transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) shadow-[4px_0_24px_rgba(0,0,0,0.1)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border-r border-gray-100 dark:border-white/5 flex flex-col
        `}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 dark:bg-brand-medRed/20 rounded-lg text-brand-primary dark:text-brand-medRed">
              <MessageSquare size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Quick Snippets
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="md:hidden p-2 text-gray-400 hover:text-brand-primary hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">Common Responses</div>
          
          <SnippetCard 
            label="WITH RRN" 
            text="We've sent an SMS with the refund reference number." 
            onCopy={onCopy} 
          />
          
          <SnippetCard 
            label="W/O RRN" 
            text="We've sent an SMS with the refund details." 
            onCopy={onCopy} 
          />

          <div className="my-6 border-t border-gray-100 dark:border-white/5"></div>
          
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">Smart Context</div>

          {/* Time Based Snippet */}
          <button 
            onClick={() => onCopy(isLateHours 
              ? "Could you please confirm if I can share the refund details with you via SMS?" 
              : "Let me share the refund details over SMS too."
            )}
            className="w-full text-left group relative p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gradient-to-br from-gray-50 to-white dark:from-white/5 dark:to-transparent hover:border-brand-primary/30 dark:hover:border-brand-pink/30 hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative flex flex-col gap-2">
              <div className="flex items-center justify-between">
                {isLateHours && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800`}>
                    Evening Mode
                  </span>
                )}
                <Clock size={14} className="text-gray-400 group-hover:text-brand-primary transition-colors ml-auto" />
              </div>
              
              <div className="space-y-1">
                 <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {isLateHours ? "SMS after 9 PM" : "SMS before 9 PM"}
                 </span>
                 <p className="text-sm text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
                  {isLateHours 
                    ? "Could you please confirm if I can share the refund details with you via SMS?" 
                    : "Let me share the refund details over SMS too."
                  }
                </p>
              </div>
            </div>
          </button>

          <div className="my-6 border-t border-gray-100 dark:border-white/5"></div>

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">Closing</div>

          <SnippetCard 
            label="Empathy" 
            text="I really appreciate you being so patient while I helped." 
            onCopy={onCopy} 
          />

        </div>
      </div>
    </>
  );
};

interface SnippetCardProps {
  label: string;
  text: string;
  onCopy: (text: string) => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ label, text, onCopy }) => (
  <button 
    onClick={() => onCopy(text)}
    className="w-full text-left group p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-brand-primary/20 dark:hover:border-brand-pink/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-bold text-brand-primary dark:text-brand-pink uppercase tracking-widest">{label}</span>
      <Clipboard size={14} className="text-gray-300 group-hover:text-brand-primary transition-colors" />
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-relaxed">
      {text}
    </p>
  </button>
);

export default Sidebar;
