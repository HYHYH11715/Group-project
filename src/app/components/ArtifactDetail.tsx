import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Box, Sparkles, Bookmark } from "lucide-react";
import { artifacts } from "../data/artifacts";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArtifactModel3D } from "./ArtifactModel3D";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import { addFootprint, toggleFavorite, isFavorite } from "../utils/userData";

export function ArtifactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // 查找对应文物
  const artifact = artifacts.find((a) => a.id === Number(id));
  const [viewMode, setViewMode] = useState<"image" | "3d">("image");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (!artifact) return;
    setFavorite(isFavorite(artifact.id));
    addFootprint(artifact.id);
  }, [artifact]);

  if (!artifact) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#FBFBFA]">
        <p className="text-slate-400 italic mb-4">{t('文物不存在')}</p>
        <button
          onClick={() => navigate("/artifacts")}
          className="text-slate-900 border-b border-slate-900 pb-1 text-sm"
        >
          {t('返回文物列表')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white pb-20">
      {/* 1. 顶部导航：极简透明风格 */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/artifacts")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs tracking-widest uppercase">{t('返回')}</span>
          </button>
          
          <Link
            to="/chat"
            state={{ artifactId: artifact.id }}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('与TA对话')}</span>
          </Link>
        </div>
      </div>

      {/* 2. 文物视觉展示区 */}
      <div className="relative w-full h-[28rem] sm:h-[32rem] bg-[#FBFBFA] flex items-center justify-center overflow-hidden">
        {viewMode === "image" ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full p-8"
          >
            <ImageWithFallback
              src={artifact.image}
              alt={t(artifact.name)}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>
        ) : (
          <div className="w-full h-full">
            <ArtifactModel3D 
              modelType={artifact.modelType} 
              imageSrc={artifact.image} 
              modelPath={artifact.modelPath} 
            />
          </div>
        )}
        
        {/* 视图切换：右侧垂直小挂件（解决遮挡问题） */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5 bg-white/50 backdrop-blur-md p-1 rounded-full border border-white/50 shadow-sm">
          <button
            onClick={() => setViewMode("image")}
            className={`w-9 h-9 flex items-center justify-center rounded-full text-[10px] font-bold transition-all ${
              viewMode === "image"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-500 hover:bg-white"
            }`}
          >
            {t('图')}
          </button>
          <button
            onClick={() => setViewMode("3d")}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
              viewMode === "3d"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-500 hover:bg-white"
            }`}
          >
            <Box size={16} />
          </button>
        </div>
      </div>

      {/* 3. 文物深度信息区 */}
      <div className="max-w-2xl mx-auto p-8 sm:p-12">
        {/* 标题排版 */}
        <header className="mb-10 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
            <div className="h-[1px] w-8 bg-slate-200" />
            <span className="text-[10px] text-slate-400 uppercase tracking-[0.4em] italic">
               Masterpiece Archive
            </span>
          </div>
          <h1 className="text-4xl font-yuwei tracking-wider text-slate-900 leading-tight">
            {t(artifact.name)}
          </h1>
        </header>
        
        {/* 元数据卡片 */}
        <div className="bg-[#FBFBFA] border border-slate-100 rounded-2xl p-6 mb-6 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-center">
          <div className="flex flex-col gap-1 sm:text-left">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{t('朝代')}</p>
            <p className="font-medium text-slate-800 tracking-widest">{t(artifact.dynasty)}</p>
          </div>
          <div className="hidden sm:block w-[1px] bg-slate-100 h-12" />
          <div className="flex flex-col gap-1 sm:text-left">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{t('年代')}</p>
            <p className="font-medium text-slate-800 text-sm tracking-tighter italic">{t(artifact.year)}</p>
          </div>
          <button
            onClick={() => {
              if (artifact) {
                const nextFavorites = toggleFavorite(artifact.id);
                setFavorite(nextFavorites.includes(artifact.id));
              }
            }}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
              favorite ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {favorite ? t('已收藏') : t('收藏')}
          </button>
        </div>

        {/* 详细描述 */}
        <section className="mb-12">
          <h2 className="text-[10px] text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
            <span>{t('文物介绍')}</span>
            <div className="h-[1px] flex-1 bg-slate-100" />
          </h2>
          <p className="text-slate-600 leading-[2.2] tracking-wide font-light italic text-justify">
            {t(artifact.description)}
          </p>
        </section>

        {/* 情感共鸣区：文物自述 */}
        <section className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-slate-900/10" />
          <h2 className="text-[10px] text-slate-400 uppercase tracking-[0.3em] mb-6 pl-4">
            {t('文物自述')}
          </h2>
          <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 relative overflow-hidden">
            <span className="absolute top-4 left-4 text-6xl text-slate-100 font-serif pointer-events-none">“</span>
            <p className="text-slate-500 leading-loose italic relative z-10 pl-2">
              {t(artifact.story)}
            </p>
          </div>
        </section>
      </div>

      <div className="flex justify-center pt-10 pb-20">
        <div className="h-16 w-[1px] bg-gradient-to-b from-slate-200 to-transparent" />
      </div>
    </div>
  );
}