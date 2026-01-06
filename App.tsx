import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, Copy, Check, ChevronDown, RefreshCw, RotateCcw } from 'lucide-react';
import Sidebar from './components/Sidebar';
import { RefundMode, RefundStatus, FormData } from './types';
import { generateRefundResponse } from './utils/responseLogic';

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
    superCoinsBalance: ''
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
      superCoinsBalance: ''
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

  return (
    <div className={`min-h-screen bg-[#FDFCFD] dark:bg-[#0f0f0f] flex font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden`}>
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-light/10 dark:bg-brand-dark/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-pink/10 dark:bg-brand-medRed/20 blur-[120px]" />
      </div>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onCopy={copyToClipboard} 
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
          className={`fixed top-6 z-40 p-3 rounded-xl bg-white dark:bg-[#1a1a1a] text-brand-primary dark:text-brand-pink shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-white/10 hover:scale-105 hover:bg-brand-primary hover:text-white dark:hover:bg-brand-medRed dark:hover:text-white transition-all duration-300
            ${isSidebarOpen ? 'left-[340px]' : 'left-6'}
          `}
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>

        {/* Card Container */}
        <div className="w-full max-w-3xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
          
          {/* Main Card */}
          <div className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-white/50 dark:border-white/5 p-6 md:p-10">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-medRed bg-clip-text text-transparent">
                  Refund Response
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Generate standardized customer support messages
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-brand-primary hover:bg-white hover:shadow-md dark:hover:bg-white/10 dark:text-gray-400 dark:hover:text-brand-pink transition-all"
                  title="Reset Form"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-white hover:shadow-md dark:hover:bg-white/10 transition-all"
                >
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                  <span>{isDarkMode ? 'Light' : 'Dark'}</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              
              <div className="space-y-1.5 md:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">
                  Refund Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="499"
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">
                  RRN (Optional)
                </label>
                <input
                  type="text"
                  name="rrn"
                  value={formData.rrn}
                  onChange={handleInputChange}
                  placeholder="Reference Number"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">
                  Refund Initiated Date
                </label>
                <input
                  type="text"
                  name="initDate"
                  value={formData.initDate}
                  onChange={handleInputChange}
                  placeholder="e.g. 28 Dec 25, 02:44 am"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-1.5 md:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">
                  Refund Mode
                </label>
                <div className="relative">
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none appearance-none transition-all cursor-pointer"
                  >
                    {Object.values(RefundMode).map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">
                  Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none appearance-none transition-all cursor-pointer"
                  >
                    {Object.values(RefundStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              {formData.mode === RefundMode.SuperCoins && (
                <div className="space-y-1.5 md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">
                    SuperCoins Balance
                  </label>
                  <input
                    type="text"
                    name="superCoinsBalance"
                    value={formData.superCoinsBalance || ''}
                    onChange={handleInputChange}
                    placeholder="Enter current balance (e.g. 120)"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
              )}

              <div className="md:col-span-2 pt-4">
                <button
                  onClick={handleGenerate}
                  className="group relative w-full py-4 px-6 bg-brand-primary hover:bg-[#8a4045] dark:bg-brand-medRed dark:hover:bg-[#a66262] text-white font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none transition-all duration-200 flex justify-center items-center gap-2 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    Generate Response
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          {generatedText && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
              
              {/* Full Response Card */}
              <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="bg-gray-50/50 dark:bg-white/5 px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                   <h3 className="font-semibold text-gray-700 dark:text-gray-200">Full Response</h3>
                   <button 
                     onClick={() => copyToClipboard(generatedText)}
                     className="text-xs font-medium bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 hover:border-brand-primary text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                   >
                     <Copy size={12} />
                     Copy All
                   </button>
                </div>
                <div className="p-0">
                  <textarea
                    readOnly
                    value={generatedText}
                    className="w-full h-40 p-6 bg-transparent text-gray-600 dark:text-gray-300 resize-none focus:outline-none font-medium leading-relaxed"
                  />
                </div>
              </div>

              {/* Line by Line Breakdown */}
              <div className="bg-white/60 dark:bg-[#1a1a1a]/60 backdrop-blur-md rounded-3xl p-6 border border-gray-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4 px-2">
                  Line-by-Line Breakdown
                </h3>
                <div className="space-y-3">
                  {generatedText.split('\n').filter(line => line.trim() !== '').map((line, index) => (
                    <button 
                      key={index}
                      onClick={() => copyToClipboard(line)}
                      className="w-full text-left group flex items-start gap-4 p-4 bg-white dark:bg-[#252525] border border-gray-200 dark:border-neutral-700/50 rounded-xl shadow-sm hover:shadow-md hover:border-brand-primary/30 dark:hover:border-brand-pink/30 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="min-w-[24px] pt-1">
                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:bg-brand-primary group-hover:text-white dark:group-hover:bg-brand-medRed transition-colors">
                          {index + 1}
                        </div>
                      </div>
                      <p className="flex-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {line}
                      </p>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center text-brand-primary dark:text-brand-pink">
                        <Copy size={16} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <div 
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3.5 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] font-medium transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)
          ${toastMessage ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <div className="bg-green-500/20 p-1 rounded-full">
          <Check size={16} className="text-green-500" strokeWidth={3} />
        </div>
        {toastMessage}
      </div>

    </div>
  );
};

export default App;