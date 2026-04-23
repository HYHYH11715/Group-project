import { Link } from "react-router";
import { ArrowRight, BookOpen, Sparkles, Shapes, Search } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../contexts/LanguageContext";

export function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-full bg-[#F8F6F2] text-slate-800 font-sans antialiased">
      {/* 1. 顶部艺术封面 */}
      <div className="relative h-[32rem] sm:h-[38rem] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1712565237021-030e3a216a88?q=80&w=1920"
          alt="苏州博物馆"
          className="w-full h-full object-cover transition-transform duration-[10s] scale-105 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F6F2] via-transparent to-black/20" />
        
        <div className="absolute inset-x-0 bottom-0 px-6 pb-12 sm:px-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-white/60" />
              <p className="text-xs uppercase tracking-[0.5em] text-white/80 font-light">
                {t('Suzhou Museum Art Collection')}
              </p>
            </div>
            <h1 className="text-5xl sm:text-6xl font-yuwei tracking-[0.1em] text-white leading-tight drop-shadow-sm">
              {t('吴地遗珍')} <br/>
               <span className="text-3xl sm:text-4xl opacity-90 italic font-sans">{t('静默的历史回响')}</span>
            </h1>
          </div>
        </div>

        <div className="absolute top-10 right-10 w-24 h-24 border-t border-r border-white/20 pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20 pt-16 lg:px-12">
        {/* 2. 文化导引 */}
        <section className="mb-20">
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-8">
            <div className="max-w-2xl">
              <h2 className="text-sm uppercase tracking-[0.4em] text-slate-400 mb-2">{t('The Aesthetic')}</h2>
              <h3 className="text-3xl font-yuwei text-slate-900">
                {t('中而新，苏而新')}
              </h3>
              <p className="mt-4 font-yuwei text-slate-500 leading-relaxed tracking-wide">
                {t('从五代的秘色瓷到明清的书画珍品，每一件文物都是吴地文化的碎片。我们在现代几何的光影中，跨越时空与古人对话。')}
              </p>
            </div>
          </div>
        </section>

        {/* 3. 文物纵览 - 三个维度 */}
        <section className="mb-20">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="group p-8 bg-white/50 border border-slate-100 rounded-2xl transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-full bg-slate-900 text-white group-hover:scale-110 transition-transform">
                <Shapes size={20} />
              </div>
              <h4 className="text-3xl font-yuwei mb-3 tracking-wide">{t('材质之美')}</h4>
              <p className="text-s font-yuwei text-slate-500 leading-7">
                {t('涵盖青铜、玉石、陶瓷及丝绣，全方位展现古代工匠对自然材质的极致雕琢与审美。')}
              </p>
            </div>

            <div className="group p-8 bg-white/50 border border-slate-100 rounded-2xl transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-full bg-slate-900 text-white group-hover:scale-110 transition-transform">
                <BookOpen size={20} />
              </div>
              <h4 className="text-3xl font-yuwei tracking-wide">{t('历史脉络')}</h4>
              <p className="text-s font-yuwei text-slate-500 leading-7">
                {t('从史前良渚文化到明清盛世，严谨梳理苏州两千五百年来的建城史与文脉传承。')}
              </p>
            </div>

            <div className="group p-8 bg-white/50 border border-slate-100 rounded-2xl transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-full bg-slate-900 text-white group-hover:scale-110 transition-transform">
                <Search size={20} />
              </div>
              <h4 className="text-3xl font-yuwei tracking-wide">{t('深度交互')}</h4>
              <p className="text-s font-yuwei text-slate-500 leading-7">
                {t('利用AI导览与三维数字化技术，打破展柜的物理边界，近距离触摸文物的细节。')}
              </p>
            </div>
          </div>
        </section>

        {/* 4. 核心入口 */}
        <section>
          <div className="mb-8 px-2">
            <h2 className="text-sm uppercase tracking-[0.4em] text-slate-400 mb-2">{t('Exploration')}</h2>
            <h3 className="text-2xl font-medium">{t('开启探索之旅')}</h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <Link
              to="/artifacts"
              className="group relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white transition-all hover:-translate-y-2 shadow-2xl shadow-slate-900/20"
            >
              <div className="relative z-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Collection</p>
                <h3 className="text-2xl font-semibold mb-2">{t('精品文物')}</h3>
                <p className="text-xs text-white/60 mb-8">{t('沉浸式阅览馆藏珍品')}</p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>{t('进入库房')}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            </Link>

            <Link
              to="/chat"
              className="group relative overflow-hidden rounded-3xl bg-[#C7B299] p-8 text-white transition-all hover:-translate-y-2 shadow-2xl shadow-[#C7B299]/20"
            >
              <div className="relative z-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2">Intelligence</p>
                <h3 className="text-2xl font-semibold mb-2">{t('AI 对话')}</h3>
                <p className="text-xs text-white/70 mb-8">{t('与跨越千年的文物对谈')}</p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>{t('即刻启程')}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              <Sparkles className="absolute bottom-[-10%] right-[-5%] w-32 h-32 text-white/10 rotate-12" />
            </Link>

            {/* 这里之前误写成了 </div> 结尾，现在已修正为 </Link> */}
            <Link
              to="/games"
              className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 text-slate-900 transition-all hover:-translate-y-2 shadow-xl shadow-slate-200/30"
            >
              <div className="relative z-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-300 mb-2">Interactive</p>
                <h3 className="text-2xl font-semibold mb-2">{t('互动游戏')}</h3>
                <p className="text-xs text-slate-400 mb-8">{t('趣味探寻吴地文明')}</p>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span>{t('开始游戏')}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}