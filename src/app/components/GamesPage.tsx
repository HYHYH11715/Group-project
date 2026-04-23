import { Link } from "react-router";
import { MessageSquareText, Puzzle, Sparkles, ChevronRight, Compass } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";

export function GamesPage() {
  const { t } = useLanguage();

  const features = [
    {
      id: "chat",
      name: "灵识对话",
      eng: "AI ORACLE",
      description: "跨越千年岁月，与馆藏珍宝席地而谈。听听那件秘色瓷或古砚台，都有什么想对你说的。",
      icon: MessageSquareText,
      // 天青色调
      color: "bg-sky-50 text-sky-600 border-sky-100",
      path: "/chat",
      isLarge: true, // 突出显示的大卡片
    },
    {
      id: "puzzle",
      name: "文物修复",
      eng: "RELIC RECON",
      description: "指尖触碰，将破碎的历史记忆拼凑完整。",
      icon: Puzzle,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
      path: "/games/puzzle",
    },
    {
      id: "guess",
      name: "博学鉴宝",
      eng: "SCHOLAR'S RIDDLE",
      description: "凭一丝线索，识万千珍玩。你能认出它吗？",
      icon: Sparkles,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      path: "/games/guess",
    },
  ];

  return (
    <div className="min-h-full bg-[#FBFBFA] pb-32 text-slate-800 antialiased">
      {/* 1. 艺术感页眉 */}
      <header className="bg-white border-b border-slate-100 px-8 py-16 relative overflow-hidden">
        {/* 背景装饰：苏博标志性的几何窗影感 */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-slate-50 rounded-full opacity-60" />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-4">
            <Compass className="w-5 h-5 text-slate-400" />
            <div className="h-[1px] w-12 bg-slate-200" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-slate-400">Digital Discovery</span>
          </div>
          <h1 className="text-5xl font-yuwei tracking-widest text-slate-900 mb-4">{t('数字发现')}</h1>
          <p className="text-sm text-slate-400 font-light tracking-wide max-w-md leading-relaxed">
            {t('在这里进入 AI 对话、拼图游戏和猜文物等功能')}
          </p>
        </motion.div>
      </header>

      {/* 2. 交互式功能网格 */}
      <div className="px-6 -mt-8 relative z-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={feature.isLarge ? "md:col-span-2" : "md:col-span-1"}
              >
                <Link
                  to={feature.path}
                  className="group block relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_4px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_25px_50px_rgb(0,0,0,0.06)] transition-all duration-500 overflow-hidden active:scale-[0.98]"
                >
                  {/* 卡片内部装饰 */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-bl-[5rem] -mr-10 -mt-10 transition-transform group-hover:scale-110" />

                  <div className={`flex ${feature.isLarge ? 'flex-col sm:flex-row items-center sm:items-start text-center sm:text-left' : 'flex-col'} gap-6 relative z-10`}>
                    
                    {/* 图标区域 */}
                    <div className={`w-20 h-20 rounded-[1.5rem] ${feature.color} border flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:rotate-[10deg] group-hover:shadow-lg`}>
                      <Icon className="w-10 h-10" strokeWidth={1.5} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold text-slate-300 tracking-[0.3em] uppercase">
                          {feature.eng}
                        </span>
                        <span className="text-[10px] text-slate-200 font-mono font-bold italic">
                          REF #{String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-yuwei text-slate-900 tracking-widest mb-3 transition-colors group-hover:text-blue-700">
                        {t(feature.name)}
                      </h3>
                      
                      <p className="text-sm text-slate-500 font-light leading-relaxed max-w-lg italic">
                        {t(feature.description)}
                      </p>

                      <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-all">
                        <span>{t('进入探索')}</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. 底部建议卡片：展厅导言感 */}
      <div className="px-8 mt-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900 text-white rounded-[3rem] p-10 relative overflow-hidden shadow-2xl"
        >
          {/* 贝聿铭几何线条装饰 */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0 100 L50 0 L100 100" stroke="white" fill="none" strokeWidth="0.5" />
             </svg>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl shadow-inner">
               🏮
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-white/40 mb-3">Curator's Note</h4>
              <p className="text-lg text-slate-200 font-serif leading-relaxed italic pr-4">
                {t('“万物有灵，历史不应只是冰冷的橱窗，而是一场活色生香的相遇。”')}
              </p>
              <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-light">
                {t('通过游戏可以更好地记住文物的特征和历史背景哦！')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 底部点缀 */}
      <div className="flex justify-center mt-20 opacity-10">
        <div className="h-24 w-[1px] bg-slate-900" />
      </div>
    </div>
  );
}