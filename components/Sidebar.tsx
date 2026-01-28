import React, { useEffect, useState } from 'react';
import { Clipboard, Clock, MessageSquare, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: (text: string) => void;
  smsContext?: {
    firstSentence: string;
    isVisible: boolean;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onCopy, smsContext }) => {
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
        className={`fixed top-0 left-0 h-full w-[320px] z-50 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) shadow-[4px_0_40px_rgba(0,0,0,0.1)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-2xl border-r border-gray-100 dark:border-white/5 flex flex-col
        `}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-brand-royal to-brand-vivid rounded-xl text-white shadow-lg shadow-brand-royal/20">
              <MessageSquare size={18} strokeWidth={2.5} />
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

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

          <div className="space-y-3">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Common Responses</div>
            <SnippetCard
              label="WITH RRN"
              text="We've sent an SMS with the refund reference number."
              onCopy={onCopy}
              colorClass="text-brand-primary dark:text-brand-medRed"
            />
            <SnippetCard
              label="W/O RRN"
              text="We've sent an SMS with the refund details."
              onCopy={onCopy}
              colorClass="text-brand-royal dark:text-indigo-400"
            />
          </div>

          <div className="border-t border-gray-100 dark:border-white/5"></div>

          <div className="space-y-3">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Smart Context</div>

            {/* Time Based Snippet */}
            <button
              onClick={() => onCopy(isLateHours
                ? "Could you please confirm if I can share the refund details with you via SMS?"
                : "Let me share the refund details over SMS too."
              )}
              className="w-full text-left group relative p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 hover:border-brand-royal/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide border 
                    ${isLateHours
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800'
                      : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800'
                    }`}>
                    {isLateHours ? 'Evening Mode' : 'Day Mode'}
                  </span>
                  <Clock size={16} className="text-gray-400 group-hover:text-brand-royal transition-colors ml-auto" />
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
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
          </div>

          <div className="border-t border-gray-100 dark:border-white/5"></div>

          <div className="space-y-3">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Closing</div>
            <SnippetCard
              label="Empathy"
              text="I really appreciate you being so patient while I helped."
              onCopy={onCopy}
              colorClass="text-brand-vivid dark:text-purple-400"
            />
          </div>

          {/* SMS to be Sent Section */}
          {smsContext?.isVisible && (
            <>
              <div className="border-t border-gray-100 dark:border-white/5"></div>
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 text-green-600 dark:text-green-400">
                  SMS to be sent
                </div>
                <SnippetCard
                  label="Flipkart Update"
                  text={`Flipkart Update: Thanks for reaching us. ${smsContext.firstSentence} For more details, click here: https://www.flipkart.com/helpcentre`}
                  onCopy={onCopy}
                  colorClass="text-green-600 dark:text-green-400"
                />
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
};

interface SnippetCardProps {
  label: string;
  text: string;
  onCopy: (text: string) => void;
  colorClass?: string;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ label, text, onCopy, colorClass = "text-gray-500" }) => (
  <button
    onClick={() => onCopy(text)}
    className="w-full text-left group p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-200 dark:hover:border-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
  >
    <div className="flex items-center justify-between mb-2">
      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${colorClass}`}>{label}</span>
      <Clipboard size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-relaxed font-medium">
      {text}
    </p>
  </button>
);

export default Sidebar;