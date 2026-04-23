import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, RotateCcw, Trophy, Lightbulb, ChevronDown } from "lucide-react";
import { artifacts } from "../data/artifacts";
import { useLanguage } from "../contexts/LanguageContext";

export function PuzzleGame() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [currentArtifact, setCurrentArtifact] = useState(artifacts[0]);
  const [pieces, setPieces] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showArtifactSelector, setShowArtifactSelector] = useState(false);

  const gridSize = 3;

  const initializePuzzle = useCallback(() => {
    let newPieces = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
    }

    setPieces(newPieces);
    setMoves(0);
    setIsComplete(false);
    setSelectedPiece(null);
  }, [gridSize]);

  useEffect(() => {
    initializePuzzle();
  }, [initializePuzzle, currentArtifact]);

  const handlePieceClick = (index: number) => {
    if (isComplete) return;

    if (selectedPiece === null) {
      setSelectedPiece(index);
    } else if (selectedPiece === index) {
      setSelectedPiece(null);
    } else {
      const newPieces = [...pieces];
      [newPieces[selectedPiece], newPieces[index]] = [newPieces[index], newPieces[selectedPiece]];
      setPieces(newPieces);
      setMoves(prev => prev + 1);
      setSelectedPiece(null);

      if (newPieces.every((piece, i) => piece === i)) {
        setIsComplete(true);
      }
    }
  };

  const handleArtifactSelect = (artifact: typeof artifacts[0]) => {
    setCurrentArtifact(artifact);
    setShowArtifactSelector(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-10">
      <div className="bg-white px-4 py-6 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <button onClick={() => navigate("/games")} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="font-bold text-gray-800">{t('文物修复计划')}</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t('Puzzle Challenge')}</p>
        </div>
        <button onClick={initializePuzzle} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="max-w-md mx-auto p-6 flex flex-col items-center">
        <div className="w-full flex justify-between items-end mb-6">
          <div className="flex-1 mr-4">
            <span className="text-xs text-gray-400 block mb-1">{t('正在修复')}</span>
            <div className="relative">
              <button
                onClick={() => setShowArtifactSelector(!showArtifactSelector)}
                className="flex items-center gap-2 text-lg font-bold text-[#2F3E46] hover:text-blue-600 transition-colors"
              >
                {currentArtifact.name}
                <ChevronDown size={16} className={`transition-transform ${showArtifactSelector ? 'rotate-180' : ''}`} />
              </button>
              
              {showArtifactSelector && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-64 overflow-y-auto z-20">
                  {artifacts.map((artifact) => (
                    <button
                      key={artifact.id}
                      onClick={() => handleArtifactSelect(artifact)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        artifact.id === currentArtifact.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={artifact.image} alt={artifact.name} className="w-10 h-10 object-cover rounded-lg" />
                        <span className="font-medium">{artifact.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block mb-1">{t('交换次数')}</span>
            <span className="text-xl font-mono font-bold text-blue-600">{moves}</span>
          </div>
        </div>

        <div className="relative w-full aspect-square bg-gray-200 rounded-2xl p-1.5 shadow-inner">
          <div className="grid grid-cols-3 gap-1 h-full w-full">
            {pieces.map((pieceIndex, i) => {
              const correctRow = Math.floor(pieceIndex / gridSize);
              const correctCol = pieceIndex % gridSize;
              const isSelected = selectedPiece === i;
              const isCorrect = pieceIndex === i;

              return (
                <div
                  key={i}
                  onClick={() => handlePieceClick(i)}
                  className={`relative rounded-lg overflow-hidden transition-all duration-200 cursor-pointer border-2 ${
                    isSelected 
                      ? "border-blue-500 scale-95 shadow-lg" 
                      : isCorrect 
                        ? "border-green-400" 
                        : "border-white/30"
                  }`}
                  style={{
                    backgroundImage: `url(${currentArtifact.image})`,
                    backgroundSize: `${gridSize * 100}%`,
                    backgroundPosition: `${(correctCol * 100) / (gridSize - 1)}% ${(correctRow * 100) / (gridSize - 1)}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                    <span className="text-[8px] text-white/30">{pieceIndex + 1}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{pieceIndex + 1}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 w-full">
          <p className="text-center text-sm text-gray-500 mb-4">
            {t('点击两个格子交换位置，将图片恢复原样')}
          </p>
        </div>

        <div className="mt-4 w-full flex gap-3">
          <button 
            onClick={() => setShowHint(!showHint)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-xl text-sm font-medium border border-gray-100 shadow-sm"
          >
            <Lightbulb size={16} className={showHint ? "text-yellow-500" : "text-gray-400"} />
            {showHint ? t('隐藏原图') : t('查看原图')}
          </button>
        </div>

        {showHint && (
          <div className="mt-4 p-2 bg-white rounded-lg shadow-sm animate-in fade-in zoom-in duration-300">
            <img src={currentArtifact.image} alt="Hint" className="w-32 h-32 object-cover rounded shadow-inner opacity-60" />
          </div>
        )}
      </div>

      {isComplete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-yellow-600 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('修复成功！')}</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {t('你只用了 {moves} 次交换就让 {artifactName} 焕发新生。', { moves, artifactName: currentArtifact.name })}
            </p>
            <div className="space-y-3">
              <button
                onClick={initializePuzzle}
                className="w-full bg-[#2F3E46] text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                {t('再玩一次')}
              </button>
              <button
                onClick={() => navigate("/games")}
                className="w-full bg-gray-50 text-gray-500 py-3 rounded-xl text-sm"
              >
                {t('回到大厅')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
