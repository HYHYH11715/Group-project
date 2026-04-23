import { Outlet, Link, useLocation } from "react-router";
import { Home, Library, MessageSquareText, Gamepad2, User, Languages } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";

export function Layout() {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { path: "/", icon: Home, label: t('首页') },
    { path: "/artifacts", icon: Library, label: t('文物') },
    { path: "/games", icon: Gamepad2, label: t('功能页') },
    { path: "/my", icon: User, label: t('我的') },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#FBFBFA] relative shadow-2xl shadow-slate-200/50">
      <main className="flex-1 overflow-auto scrollbar-hide pb-28">
        <Outlet />
      </main>

      {/* 2. 语言切换：移动到右下角，避免挡住顶部的选择框 */}
      <div className="fixed bottom-28 right-[calc(50%-180px)] z-[100] max-md:right-6">
        <button
          onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-xl border border-slate-200 shadow-lg hover:shadow-md transition-all active:scale-95 rounded-full"
        >
          <Languages className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[10px] font-bold tracking-widest text-slate-700 uppercase">
            {language === 'zh' ? 'English' : '中文'}
          </span>
        </button>
      </div>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[88%] max-w-[340px] z-50">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-1.5 flex justify-around items-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center py-2 flex-1 group"
              >
                {active && (
                  <motion.div 
                    layoutId="nav-active-white"
                    className="absolute inset-0 bg-slate-100/80 rounded-2xl mx-1"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className={`relative transition-all duration-500 ${active ? "scale-110" : "scale-95 opacity-40"}`}>
                  <Icon className={`w-5 h-5 mb-0.5 ${active ? "text-slate-900" : "text-slate-600"}`} strokeWidth={active ? 2 : 1.5} />
                </div>
                <span className={`relative text-[9px] tracking-[0.15em] font-bold transition-colors ${active ? "text-slate-900 opacity-100" : "text-slate-400"}`}>
                  {item.label}
                </span>
                {active && (
                  <motion.div layoutId="nav-line" className="absolute -bottom-1 w-3 h-[2px] bg-slate-900 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FBFBFA] via-[#FBFBFA]/80 to-transparent pointer-events-none z-40" />
    </div>
  );
}