import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { artifacts } from "../data/artifacts";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Search, X, RefreshCw } from "lucide-react";
import { getFavorites } from "../utils/userData";

export function ArtifactsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  const [featuredArtifact, setFeaturedArtifact] = useState(artifacts[0]);

  const pickRandomArtifact = () => {
    const randomIndex = Math.floor(Math.random() * artifacts.length);
    setFeaturedArtifact(artifacts[randomIndex]);
  };

  useEffect(() => {
    pickRandomArtifact();
  }, []);

  const favoritesMode = searchParams.get("favorites") === "true";
  const favoriteIds = useMemo(() => (favoritesMode ? getFavorites() : []), [favoritesMode]);

  const filteredArtifacts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const source = favoritesMode ? artifacts.filter((item) => favoriteIds.includes(item.id)) : artifacts;
    if (!query) return source;

    return source.filter((item) => {
      return (
        t(item.name).toLowerCase().includes(query) ||
        t(item.dynasty).toLowerCase().includes(query) ||
        t(item.description).toLowerCase().includes(query)
      );
    });
  }, [searchQuery, t, favoritesMode, favoriteIds]);

  return (
    <div className="min-h-full bg-[#F8F6F2] text-slate-800 pb-20antialiased">
      {/* 1. 艺术化页眉 */}
      <div className="bg-white/50 backdrop-blur-md border-b border-slate-200/60 px-6 py-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-slate-900" />
            <h1 className="text-2xl font-yuwei tracking-[0.2em] text-slate-900 pl-4 uppercase">
              {favoritesMode ? t('我的收藏') : t('精品文物')}
            </h1>
            <p className="text-[9px] text-slate-400 mt-1 pl-4 uppercase tracking-[0.3em]">
               {t('SUZHOU MUSEUM DIGITAL COLLECTION')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('搜索文物...')}
                className="bg-transparent border-b border-slate-300 py-1 pl-8 pr-8 text-xs focus:border-slate-900 transition-colors outline-none min-w-[180px]"
              />
              <Search className="absolute left-0 top-1.5 h-3.5 w-3.5 text-slate-400" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-0 top-1.5">
                  <X className="h-3 w-3 text-slate-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 随机推荐展示区 - 居中标题与磨砂长方形按钮 */}
      {!favoritesMode && !searchQuery && (
        <div className="max-w-6xl mx-auto px-6 pt-10">
          <div className="relative group rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:shadow-2xl">
            
            {/* A. 居中标题区 - 显眼不遮挡 */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 text-center flex flex-col items-center">
              <div className="flex items-center justify-center gap-3 mb-2 px-6 py-2 bg-[#F8F6F2] rounded-full">
                <h2 className="text-3xl font-yuwei tracking-[0.2em] text-slate-900 whitespace-nowrap">
                  {t('随机推荐')}
                </h2>
              </div>
              <span className="text-[10px] font-bold text-slate-300 tracking-[0.3em] uppercase">
                {t('FEATURED ARCHIVE')}
              </span>
            </div>
            
            <Link to={`/artifacts/${featuredArtifact.id}`} className="block relative z-0">
              <div className="flex flex-col lg:flex-row items-center">
                {/* B. 推荐图 - 降低高度和占比 */}
                <div className="w-full lg:w-3/7 h-64 sm:h-72 overflow-hidden bg-[#FBFBFA] flex items-center justify-center p-6 border-r border-slate-50">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={featuredArtifact.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full"
                    >
                      <ImageWithFallback 
                        src={featuredArtifact.image} 
                        alt={featuredArtifact.name}
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* C. 推荐信息 - 调小字体 */}
                <div className="w-full lg:w-4/7 p-10 lg:p-12 flex flex-col justify-center relative">
                  
                  {/* D. 刷新按钮 - 磨砂长方形质感 */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault(); // 阻止点击 Link 跳转
                      pickRandomArtifact();
                    }}
                    className="absolute top-8 right-10 z-20 flex items-center gap-2.5 px-5 py-2.5 bg-white/40 backdrop-blur-xl border border-white rounded-full shadow-sm hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 group/btn"
                    title={t('换一批')}
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500 transition-transform duration-700 group-hover/btn:rotate-180" />
                    <span className="text-[11px] font-bold text-slate-700 tracking-widest uppercase">
                       {t('换一批')}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-[1px] w-8 bg-slate-200" />
                    <span className="text-[10px] text-slate-400 tracking-widest uppercase">{t(featuredArtifact.dynasty)}</span>
                  </div>
                  <h2 className="text-3xl font-yuwei text-slate-900 tracking-wider mb-5 group-hover:text-blue-900 transition-colors">
                    {t(featuredArtifact.name)}
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-light mb-8 max-w-lg">
                    {t(featuredArtifact.description)}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-900 group-hover:translate-x-2 transition-transform">
                    <span>{t('EXPLORE STORY')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-16 flex items-center gap-3">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-slate-400">{t('更多馆藏')}</h3>
            <div className="h-[1px] flex-1 bg-slate-200/60" />
          </div>
        </div>
      )}

      {/* 3. 文物列表 */}
      <motion.div 
        className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        initial="hidden"
        animate="visible"
      >
        {filteredArtifacts.map((artifact) => (
          <motion.div 
            key={artifact.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to={`/artifacts/${artifact.id}`}
              className="group block relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500"
            >
              <div className="flex flex-col sm:flex-row h-full">
                <div className="w-full sm:w-40 h-48 sm:h-auto overflow-hidden bg-[#FBFBFA]">
                  <ImageWithFallback
                    src={artifact.image}
                    className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 p-6">
                   <span className="text-[9px] text-slate-400 tracking-widest uppercase mb-1 block">{t(artifact.dynasty)}</span>
                   <h3 className="text-xl font-yuwei text-slate-900 mb-3 group-hover:text-blue-900 transition-colors">
                     {t(artifact.name)}
                   </h3>
                   <p className="text-xs text-slate-500 line-clamp-2 font-light">{t(artifact.description)}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}