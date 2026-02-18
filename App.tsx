import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, Copy, Check, ChevronDown, RefreshCw, RotateCcw, Sparkles } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatWidget from './components/ChatWidget';
import { RefundMode, RefundStatus, FormData } from './types';
import { generateRefundResponse, parseCustomDate } from './utils/responseLogic';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    rrn: '',
    initDate: '',
    mode: RefundMode.CreditCard,
    status: RefundStatus.Processing,
    superCoinsBalance: '',
    sla: ''
  });

  // Handle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Window Resize for Sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-Select "Post SLA" Status if current time > SLA time
  useEffect(() => {
    if (formData.sla) {
      const slaDate = parseCustomDate(formData.sla);
      if (slaDate) {
        const now = new Date();
        // If SLA date is in the past, auto-switch to CompletedPost
        if (now > slaDate) {
          setFormData(prev => {
            // Only update if not already CompletedPost to avoid loops/unnecessary renders
            if (prev.status !== RefundStatus.CompletedPost) {
              return { ...prev, status: RefundStatus.CompletedPost };
            }
            return prev;
          });
        }
      }
    }
  }, [formData.sla]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Strict numeric restriction for amount
    if (name === 'amount') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      amount: '',
      rrn: '',
      initDate: '',
      mode: RefundMode.CreditCard,
      status: RefundStatus.Processing,
      superCoinsBalance: '',
      sla: ''
    });
    setGeneratedText('');
  };

  const handleGenerate = () => {
    try {
      const response = generateRefundResponse(formData);
      setGeneratedText(response);
    } catch (error) {
      console.error("Generation failed", error);
      setToastMessage("Error generating response");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage('Copied to clipboard!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDataExtracted = (data: Partial<FormData>) => {
    setFormData({
      amount: '',
      rrn: '',
      initDate: '',
      mode: RefundMode.CreditCard,
      status: RefundStatus.Processing,
      superCoinsBalance: '',
      sla: '',
      ...data
    });
    setToastMessage("Form Auto-Filled!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#0f0f0f] flex font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden`}>

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-pink/20 dark:bg-brand-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-royal/20 dark:bg-brand-royal/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-brand-vivid/20 dark:bg-brand-vivid/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCopy={copyToClipboard}
        smsContext={{
          firstSentence: generatedText ? generatedText.split('\n')[0] : '', // Safe split
          isVisible: true
        }}
      />

      {/* Main Content Area */}
      <div
        className={`relative z-10 flex-1 transition-all duration-300 flex justify-center items-start pt-6 md:pt-12 px-4 pb-12
          ${isSidebarOpen ? 'md:ml-[320px]' : 'ml-0'}
        `}
      >
        {/* Toggle Button (Floating) */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed top-6 z-40 p-3 rounded-xl bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur text-brand-primary dark:text-brand-pink shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-white/10 hover:scale-105 hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-royal hover:text-white dark:hover:text-white transition-all duration-300
            ${isSidebarOpen ? 'left-[340px]' : 'left-6'}
          `}
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>

        {/* Card Container */}
        <div className="w-full max-w-3xl flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500">

          {/* Main Card */}
          <div className="bg-white/70 dark:bg-[#1a1a1a]/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-none border border-white/60 dark:border-white/10 p-6 md:p-10 relative overflow-hidden group">
            {/* Subtle top border gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-vivid to-brand-royal opacity-80" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold pb-2">
                  <span className="bg-gradient-to-r from-brand-primary via-brand-medRed to-brand-royal bg-clip-text text-transparent">
                    Refund Response
                  </span>
                </h1>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Sparkles size={14} className="text-brand-vivid" />
                  Generate standardized customer support messages
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="p-2.5 rounded-xl bg-gray-50/50 dark:bg-white/5 text-gray-500 hover:text-brand-royal hover:bg-brand-royal/5 hover:scale-105 transition-all duration-200"
                  title="Reset Form"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50/50 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-white hover:shadow-lg dark:hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200"
                >
                  {isDarkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-brand-royal" />}
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">

              {/* Amount Input */}
              <div className="space-y-2 md:col-span-1 group/field">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 group-focus-within/field:text-brand-royal transition-colors">
                  Refund Amount
                </label>
                <div className="relative transform transition-transform duration-200 focus-within:-translate-y-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/60 font-semibold text-lg">₹</span>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="499"
                    className="w-full pl-9 pr-4 py-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold text-lg shadow-sm focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/50 outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* RRN Input */}
              <div className="space-y-2 md:col-span-1 group/field">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 group-focus-within/field:text-brand-vivid transition-colors">
                  RRN (Optional)
                </label>
                <div className="transform transition-transform duration-200 focus-within:-translate-y-1">
                  <input
                    type="text"
                    name="rrn"
                    value={formData.rrn}
                    onChange={handleInputChange}
                    placeholder="Reference Number"
                    className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold text-lg shadow-sm focus:ring-4 focus:ring-brand-vivid/10 focus:border-brand-vivid/50 outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-2 md:col-span-2 group/field">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 group-focus-within/field:text-brand-ocean transition-colors">
                  Refund Initiated Date
                </label>
                <div className="transform transition-transform duration-200 focus-within:-translate-y-1">
                  <input
                    type="text"
                    name="initDate"
                    value={formData.initDate}
                    onChange={handleInputChange}
                    placeholder="e.g. 28 Dec 25, 02:44 am"
                    className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold text-lg shadow-sm focus:ring-4 focus:ring-brand-ocean/10 focus:border-brand-ocean/50 outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* SLA Timeframe Input */}
              <div className="space-y-2 md:col-span-2 group/field">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 group-focus-within/field:text-brand-medRed transition-colors">
                  SLA Date (Deadline)
                </label>
                <div className="transform transition-transform duration-200 focus-within:-translate-y-1">
                  <input
                    type="text"
                    name="sla"
                    value={formData.sla}
                    onChange={handleInputChange}
                    placeholder="e.g. 28 Dec 25"
                    className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold text-lg shadow-sm focus:ring-4 focus:ring-brand-medRed/10 focus:border-brand-medRed/50 outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Mode Select */}
              <div className="space-y-2 md:col-span-1 group/field">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 group-focus-within/field:text-brand-primary transition-colors">
                  Refund Mode
                </label>
                <div className="relative transform transition-transform duration-200 focus-within:-translate-y-1">
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold text-base shadow-sm focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/50 outline-none appearance-none transition-all cursor-pointer"
                  >
                    {Object.values(RefundMode).map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary pointer-events-none" size={18} strokeWidth={2.5} />
                </div>
              </div>

              {/* Status Select */}
              <div className="space-y-2 md:col-span-1 group/field">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 group-focus-within/field:text-brand-royal transition-colors">
                  Status
                </label>
                <div className="relative transform transition-transform duration-200 focus-within:-translate-y-1">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold text-base shadow-sm focus:ring-4 focus:ring-brand-royal/10 focus:border-brand-royal/50 outline-none appearance-none transition-all cursor-pointer"
                  >
                    {Object.values(RefundStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-royal pointer-events-none" size={18} strokeWidth={2.5} />
                </div>
              </div>

              {formData.mode === RefundMode.SuperCoins && (
                <div className="space-y-2 md:col-span-2 animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 text-yellow-500">
                    SuperCoins Balance
                  </label>
                  <input
                    type="text"
                    name="superCoinsBalance"
                    value={formData.superCoinsBalance || ''}
                    onChange={handleInputChange}
                    placeholder="Enter current balance (e.g. 120)"
                    className="w-full px-4 py-3.5 rounded-2xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/30 text-gray-900 dark:text-white font-semibold text-lg shadow-sm focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
              )}

              {/* Generate Button */}
              <div className="md:col-span-2 pt-6">
                <button
                  onClick={handleGenerate}
                  className="group relative w-full py-4 px-6 bg-gradient-to-r from-brand-primary via-brand-primary to-brand-royal dark:from-brand-medRed dark:to-brand-royal hover:shadow-2xl hover:shadow-brand-primary/30 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" strokeWidth={2.5} />
                    Generate Response
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          {generatedText && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">

              {/* Line by Line Breakdown */}
              <div className="bg-white/70 dark:bg-[#1a1a1a]/70 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white/60 dark:border-white/10 shadow-lg">
                <div className="flex justify-between items-center mb-6 px-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-royal"></span>
                    Breakdown
                  </h3>
                  <button
                    onClick={() => copyToClipboard(generatedText)}
                    className="text-xs font-bold bg-gray-100 dark:bg-white/10 border border-transparent hover:border-brand-royal hover:text-brand-royal text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200"
                  >
                    <Copy size={14} />
                    COPY FULL
                  </button>
                </div>
                <div className="space-y-4">
                  {generatedText.split('\n').filter(line => line.trim() !== '').map((line, index) => {
                    // Cyclic colors for the numbers
                    const colors = [
                      'bg-brand-primary text-white',
                      'bg-brand-royal text-white',
                      'bg-brand-vivid text-white',
                      'bg-brand-ocean text-white'
                    ];
                    const colorClass = colors[index % colors.length];

                    return (
                      <button
                        key={index}
                        onClick={() => copyToClipboard(line)}
                        className="w-full text-left group flex items-start gap-5 p-5 bg-white dark:bg-[#252525] border border-gray-100 dark:border-neutral-700/50 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-brand-royal/5 hover:border-brand-royal/20 dark:hover:border-brand-royal/30 hover:-translate-y-1 transition-all duration-200"
                      >
                        <div className="min-w-[28px] pt-0.5">
                          <div className={`w-7 h-7 rounded-lg ${colorClass} shadow-lg shadow-current/20 flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110 duration-300`}>
                            {index + 1}
                          </div>
                        </div>
                        <p className="flex-1 text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          {line}
                        </p>
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 self-center text-brand-royal dark:text-brand-vivid">
                          <Copy size={18} strokeWidth={2.5} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <div
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-gray-900/90 dark:bg-white/90 backdrop-blur text-white dark:text-gray-900 px-6 py-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] font-semibold transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
          ${toastMessage ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-90 pointer-events-none'}
        `}
      >
        <div className="bg-green-500 p-1 rounded-full text-white">
          <Check size={14} strokeWidth={4} />
        </div>
        {toastMessage}
      </div>

      {/* Chat Widget */}
      <ChatWidget onDataExtracted={handleDataExtracted} />

    </div>
  );
};

export default App;