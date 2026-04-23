import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { artifacts } from "../data/artifacts";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getFootprints, clearFootprints } from "../utils/userData";

export function FootprintsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [footprints, setFootprints] = useState<{ id: number; label: string; at: number }[]>([]);

  useEffect(() => {
    const next = getFootprints().map((item) => ({
      id: item.id,
      label: artifacts.find((artifact) => artifact.id === item.id)?.name || `Document ${item.id}`,
      at: item.at,
    }));
    setFootprints(next);
  }, []);

  const onClear = () => {
    clearFootprints();
    setFootprints([]);
  };

  return (
    <div className="min-h-full bg-[#F8F6F2] text-slate-800 pb-20">
      <div className="bg-white border-b border-slate-100 px-6 py-8 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('返回')}
          </button>
          <div>
            <h1 className="text-3xl font-yuwei tracking-[0.2em] text-slate-900">{t('探索足迹')}</h1>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mt-2">{footprints.length} {t('条记录')}</p>
          </div>
          {footprints.length > 0 && (
            <button
              onClick={onClear}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 hover:bg-slate-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              {t('清除足迹')}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {footprints.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {footprints.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(`/artifacts/${item.id}`)}
                className="w-full rounded-3xl border border-slate-200 bg-white p-6 text-left transition hover:border-slate-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{t(item.label)}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(item.at)}</p>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.25em] text-slate-500">{t('查看详情')}</span>
                </div>
              </button>
            ))}
          </motion.div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            <p className="text-xl font-semibold text-slate-900 mb-3">{t('你还没有浏览过文物')}</p>
            <p className="text-sm leading-7">{t('探索足迹页面会记录你查看的每一个文物')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
