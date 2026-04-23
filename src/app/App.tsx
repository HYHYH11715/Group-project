import { useCallback, useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  // 简化状态逻辑：直接使用布尔值控制显示，让 AnimatePresence 处理动画
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState(5);

  const finishSplash = useCallback(() => {
    setIsVisible(false);
  }, []);

  // 倒计时逻辑
  useEffect(() => {
    if (!isVisible) return;

    const interval = window.setInterval(() => {
      setCountdown((v) => {
        if (v <= 1) {
          finishSplash(); // 倒计时结束自动进入
          return 0;
        }
        return v - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isVisible, finishSplash]);

  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-slate-50 overflow-hidden font-sans antialiased">
        <RouterProvider router={router} />

        {/* AnimatePresence 会监听子组件的销毁并触发 exit 动画 */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ 
                opacity: 0, 
                y: -100, // 向上滑出的效果
                transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } 
              }}
              className="fixed inset-0 z-[999] flex flex-col justify-between overflow-hidden bg-slate-950 text-white cursor-pointer"
              onClick={finishSplash} // 点击背景进入
            >
              {/* 背景层 */}
              <div className="absolute inset-0 z-0">
                <motion.div
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 10, ease: "linear" }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1712565237021-030e3a216a88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXpob3UlMjBtdXNldW0lMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc1ODAyMzUwfDA&ixlib=rb-4.1.0&q=80&w=1920')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/40 to-transparent opacity-90" />
              </div>

              {/* 顶部：跳过按钮 */}
              <header className="relative z-10 flex justify-end p-8 sm:p-12">
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // 阻止冒泡，防止触发两次
                    finishSplash();
                  }}
                  className="group flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-5 py-2 backdrop-blur-xl transition-all hover:bg-white/20 active:scale-95"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/80">Skip</span>
                  <div className="h-4 w-[1px] bg-white/20" />
                  <span className="min-w-[12px] font-mono text-sm font-bold">{countdown}</span>
                </button>
              </header>

              {/* 中间：文字排版 */}
              <main className="relative z-10 px-8 sm:px-20 lg:px-32">
                <div className="max-w-max">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    <h1 className="text-5xl font-extralight tracking-[0.3em] text-white sm:text-7xl lg:text-8xl font-yuwei">
                      苏州<span className="font-semibold">博物馆</span>
                    </h1>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="mt-6 h-[0.5px] bg-gradient-to-r from-white/80 to-transparent" 
                  />
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1 }}
                    className="mt-4 text-xs uppercase tracking-[0.6em] text-slate-200 sm:text-sm"
                  >
                    Suzhou Museum
                  </motion.p>
                </div>
              </main>

              {/* 底部引导 */}
              <footer className="relative z-10 flex flex-col items-center pb-12">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-white/40 to-transparent" />
                  <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
                    Click anywhere to enter
                  </p>
                </motion.div>
              </footer>

              {/* 装饰边框 */}
              <div className="pointer-events-none absolute inset-6 border border-white/5 sm:inset-10" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LanguageProvider>
  );
}