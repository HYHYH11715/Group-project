import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Send, Sparkles, ArrowLeft, MessageSquareText, History, Info, Trash2 } from "lucide-react";
import { artifacts } from "../data/artifacts"; 
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { getChatRecord, saveChatRecord, clearChatRecord } from "../utils/api";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export function AIChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number>(location.state?.artifactId || 1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  const artifact = artifacts.find((a) => a.id === selectedId) || artifacts[0];
  const ARK_API_KEY = "37b6daee-c751-4daf-a974-b4e50526647c";

  // 加载对话记录
  useEffect(() => {
    loadChatRecord();
  }, [selectedId]);

  // 初始欢迎语逻辑修复：响应语言切换与对象切换
  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([
        {
          id: 1,
          role: "assistant",
          content: `${t('欢迎语前缀')}${t(artifact.name)}${t('欢迎语中缀1')}${t(artifact.dynasty)}${t('欢迎语中缀2')}`,
        },
      ]);
    }
  }, [selectedId, language, t, artifact]);

  // 保存对话记录
  useEffect(() => {
    if (messages.length > 0) {
      saveChatRecord(selectedId, messages);
    }
  }, [messages, selectedId]);

  // 加载对话记录
  const loadChatRecord = async () => {
    const record = await getChatRecord(selectedId);
    if (record && record.length > 0) {
      setMessages(record);
    } else {
      setMessages([
        {
          id: 1,
          role: "assistant",
          content: `${t('欢迎语前缀')}${t(artifact.name)}${t('欢迎语中缀1')}${t(artifact.dynasty)}${t('欢迎语中缀2')}`,
        },
      ]);
    }
  };

  // 清除对话记录
  const handleClearChat = async () => {
    await clearChatRecord(selectedId);
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: `${t('欢迎语前缀')}${t(artifact.name)}${t('欢迎语中缀1')}${t(artifact.dynasty)}${t('欢迎语中缀2')}`,
      },
    ]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const systemPrompt = language === 'zh' ? `
        你现在是苏州博物馆的文物：${t(artifact.name)}。背景：${t(artifact.dynasty)}，性格：${artifact.personality}。
        1. 以第一人称对话。2. 语气符合身份。3. 简短有力，保持趣味性。4. 使用中文。
      ` : `
        You are ${t(artifact.name)} from Suzhou Museum. Era: ${t(artifact.dynasty)}. Personality: ${artifact.personality}.
        1. Speak in 1st person. 2. Match your character. 3. Be concise and playful. 4. Use English.
      `;

      const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ARK_API_KEY}`
        },
        body: JSON.stringify({
          model: "doubao-1-5-pro-32k-250115",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: input }
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          role: "assistant",
          content: data.choices[0].message.content
        }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { 
        id: Date.now() + 1, 
        role: "assistant", 
        content: t("时空缝隙不稳定，请稍后再试...") 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FBFBFA] text-slate-800">
      {/* 1. 艺术导航栏 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 sticky top-0 z-30">
        <div className="flex items-center gap-3 max-w-2xl mx-auto w-full">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
              <ImageWithFallback src={artifact.image} alt={t(artifact.name)} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
          </div>

          <div className="flex-1">
            <h2 className="font-yuwei text-lg tracking-widest text-slate-900">{t(artifact.name)}</h2>
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-emerald-600 font-bold">
              <span className="w-1 h-1 bg-emerald-500 rounded-full" />
              {t('灵识觉醒中')}
            </div>
          </div>

          <div className="relative group">
            <select 
              className="appearance-none bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest outline-none focus:ring-1 focus:ring-slate-900 transition-all text-slate-500 pr-8"
              value={selectedId}
              onChange={(e) => {
                setSelectedId(Number(e.target.value));
                setMessages([]);
              }}
            >
              {artifacts.map(a => <option key={a.id} value={a.id}>{t(a.name)}</option>)}
            </select>
            <History className="absolute right-3 top-2 w-3 h-3 text-slate-300 pointer-events-none" />
          </div>

          <button 
            onClick={handleClearChat}
            className="p-2 hover:bg-red-50 rounded-full transition-colors group"
            title={t('清除对话记录')}
          >
            <Trash2 className="w-5 h-5 text-slate-300 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* 2. 对话区域 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 relative">
        {/* 背景几何装饰：致敬苏博窗格 */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
          <div className="w-[80%] aspect-square border-[20px] border-slate-900 rotate-45" />
          <div className="absolute w-full h-[1px] bg-slate-900 top-1/2" />
          <div className="absolute h-full w-[1px] bg-slate-900 left-1/2" />
        </div>

        <div className="text-center relative z-10">
          <span className="text-[9px] bg-slate-100 text-slate-400 px-4 py-1.5 rounded-full uppercase tracking-[0.3em] font-medium border border-slate-200/50">
            {t('跨越千年的对话')}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.role === "assistant" && (
                  <div className="w-9 h-9 rounded-2xl bg-white flex-shrink-0 border border-slate-100 overflow-hidden shadow-sm">
                     <ImageWithFallback src={artifact.image} alt={t(artifact.name)} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className={`px-5 py-3.5 rounded-[1.5rem] text-sm leading-relaxed tracking-wide ${
                  msg.role === "user" 
                  ? "bg-slate-800 text-white rounded-tr-none shadow-lg shadow-slate-200" 
                  : "bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
             <div className="bg-white px-5 py-4 rounded-[1.5rem] rounded-tl-none shadow-sm border border-slate-100">
               <div className="flex gap-1.5">
                 <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. 输入区域：悬浮胶囊设计 */}
      <div className="p-6 relative z-20">
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute -top-10 left-0 right-0 flex justify-center">
             <div className="px-3 py-1 bg-amber-50 border border-amber-100 rounded-full flex items-center gap-1.5 shadow-sm">
                <Info size={10} className="text-amber-500" />
                <span className="text-[9px] text-amber-600 font-medium tracking-wider">{t('正在与历史共振')}</span>
             </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-2 flex items-center gap-2 shadow-2xl shadow-slate-200/50 focus-within:border-slate-400 transition-all">
            <div className="p-3 text-amber-500">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t('向文物提问...')}
              className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-300 font-light"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                input.trim() 
                ? "bg-slate-900 text-white scale-100 shadow-lg rotate-0" 
                : "bg-slate-100 text-slate-300 scale-90 rotate-12"
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}