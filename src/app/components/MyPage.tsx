import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
  User, 
  Bookmark, 
  History, 
  ChevronRight, 
  Mail, 
  Lock,
  LogOut,
  Sparkles
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { artifacts } from "../data/artifacts";
import { getFavorites, getFootprints } from "../utils/userData";
import { login, register, getCurrentUser, logout } from "../utils/api";

export function MyPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showAuth, setShowAuth] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [footprints, setFootprints] = useState<{ id: number; label: string; at: number }[]>([]);
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // 检查登录状态
    checkLoginStatus();
    setFavoriteCount(getFavorites().length);
    const nextFootprints = getFootprints().map((item) => ({
      id: item.id,
      label: artifacts.find((artifact) => artifact.id === item.id)?.name || `Document ${item.id}`,
      at: item.at,
    }));
    setFootprints(nextFootprints);
  }, []);

  const checkLoginStatus = async () => {
    const user = await getCurrentUser();
    if (user) {
      setIsLoggedIn(true);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      setIsLoggedIn(true);
      setShowAuth(false);
    } catch (err: any) {
      setError(err.message || "登录失败，请检查账号密码");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await register(name, email, password);
      // 注册成功后自动登录
      await login(email, password);
      setIsLoggedIn(true);
      setShowAuth(false);
    } catch (err: any) {
      setError(err.message || "注册失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  const stats = [
    { label: 'My Favorites', count: String(favoriteCount), path: '/artifacts?favorites=true' },
    { label: 'Exploration Footprints', count: String(footprints.length), path: '/footprints' },
    { label: 'My Achievements', count: '1', path: '#' },
  ];

  return (
    <div className="min-h-full bg-[#F8F6F2] pb-24 text-slate-800">
      {/* 1. 艺术页眉 */}
      <header className="bg-white border-b border-slate-100 px-8 py-12 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-slate-50 border border-slate-100/50" />
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[1px] w-6 bg-slate-900" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400">Personal Center</span>
          </div>
          <h1 className="text-4xl font-yuwei tracking-widest text-slate-900">{t('我的面板')}</h1>
        </motion.div>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* 2. 用户身份卡片 (数字通行证) */}
        {!isLoggedIn ? (
          // 未登录状态
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 text-center"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto flex items-center justify-center mb-6">
              <User className="w-10 h-10 text-slate-200" />
            </div>
            <h2 className="text-2xl font-yuwei tracking-widest mb-2">{t('未登录')}</h2>
            <p className="text-xs text-slate-400 mb-8 tracking-widest leading-relaxed">
              {t('登录后开启你的数字博物馆之旅，记录每一次跨越时空的相遇')}
            </p>
            <div className="text-xs text-slate-500 mb-4">
              <p>默认账号: admin</p>
              <p>默认密码: 123456</p>
            </div>
            <button 
              onClick={() => setShowAuth(true)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold tracking-[0.2em] text-sm shadow-lg active:scale-95 transition-all"
            >
              {t('即刻登录')}
            </button>
          </motion.div>
        ) : (
          // 已登录状态
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl"
          >
            <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12" />
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-yuwei">
                  A
                </div>
                <div>
                  <h2 className="text-2xl font-yuwei tracking-widest">{t('数字馆员')}</h2>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">{t('DIGITAL PASS: SM-0824')}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                {stats.map((s, idx) => (
                  <button key={idx} onClick={() => navigate(s.path)} className="text-center group">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{t(s.label)}</p>
                    <p className="text-xl font-mono font-bold group-hover:text-blue-400 transition-colors">{s.count}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. 功能列表 */}
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/artifacts?favorites=true')}
            className="w-full flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-50 hover:bg-slate-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Bookmark size={20} />
              </div>
              <span className="text-sm font-medium tracking-widest">{t('My Favorites')}</span>
            </div>
            <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-900 transition-all" />
          </button>

          <button 
             onClick={() => navigate('/footprints')}
             className="w-full flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-50 hover:bg-slate-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <History size={20} />
              </div>
              <span className="text-sm font-medium tracking-widest">{t('Exploration Footprints')}</span>
            </div>
            <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-900 transition-all" />
          </button>

          {isLoggedIn && (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-6 text-red-400 text-sm font-medium tracking-widest mt-8"
            >
              <LogOut size={16} />
              {t('退出登录')}
            </button>
          )}
        </div>
      </div>

      {/* 4. 登录注册弹窗 (Auth Modal) */}
      <AnimatePresence>
        {showAuth && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuth(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="relative w-full max-w-sm bg-[#F8F6F2] rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              {/* 装饰边框 */}
              <div className="absolute inset-4 border border-slate-900/5 rounded-[2rem] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex justify-around mb-8 border-b border-slate-200">
                  <button 
                    onClick={() => setAuthMode("login")}
                    className={`pb-4 text-xs tracking-[0.3em] transition-all ${authMode === "login" ? "text-slate-900 border-b-2 border-slate-900 font-bold" : "text-slate-400"}`}
                  >
                    {t('登录')}
                  </button>
                  <button 
                    onClick={() => setAuthMode("register")}
                    className={`pb-4 text-xs tracking-[0.3em] transition-all ${authMode === "register" ? "text-slate-900 border-b-2 border-slate-900 font-bold" : "text-slate-400"}`}
                  >
                    {t('注册')}
                  </button>
                </div>

                {error && (
                  <div className="text-xs text-red-400 mb-4 text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {authMode === "register" && (
                    <div className="relative">
                      <User className="absolute left-4 top-4 h-4 w-4 text-slate-300" />
                      <input 
                        type="text" 
                        placeholder={t('用户名')} 
                        className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-300" />
                    <input 
                      type="text" 
                      placeholder={t('邮箱地址')} 
                      className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-4 w-4 text-slate-300" />
                    <input 
                      type="password" 
                      placeholder={t('输入密码')} 
                      className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  onClick={authMode === "login" ? handleLogin : handleRegister}
                  disabled={loading}
                  className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-bold tracking-[0.2em] text-sm shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (t('加载中...')) : (authMode === "login" ? t('登录') : t('创建账号'))}
                </button>
                
                <p className="text-[10px] text-slate-400 text-center mt-6 tracking-widest">
                  {t('点击即代表同意《数字苏博服务协议》')}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 底部装饰线 */}
      <div className="flex justify-center mt-12 opacity-10">
        <div className="h-20 w-[1px] bg-slate-900" />
      </div>
    </div>
  );
}