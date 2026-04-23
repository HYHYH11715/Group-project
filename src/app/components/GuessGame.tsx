import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Trophy, X, Check } from "lucide-react";
import { artifacts } from "../data/artifacts";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../contexts/LanguageContext";

interface Question {
  artifact: typeof artifacts[0];
  options: string[];
  correctAnswer: string;
}

export function GuessGame() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [revealLevel, setRevealLevel] = useState(0);
  const totalQuestions = 5;

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const artifact = artifacts[Math.floor(Math.random() * artifacts.length)];
    const correctAnswer = artifact.name;

    // 生成错误选项
    const otherArtifacts = artifacts.filter((a) => a.id !== artifact.id);
    const wrongOptions = otherArtifacts
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((a) => a.name);

    // 混合选项
    const options = [correctAnswer, ...wrongOptions].sort(
      () => Math.random() - 0.5
    );

    setCurrentQuestion({
      artifact,
      options,
      correctAnswer,
    });
    setSelectedAnswer(null);
    setShowResult(false);
    setRevealLevel(0);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion?.correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (questionsAnswered + 1 >= totalQuestions) {
        // 游戏结束
      } else {
        setQuestionsAnswered(questionsAnswered + 1);
        generateQuestion();
      }
    }, 2000);
  };

  const handleReveal = () => {
    if (revealLevel < 3) {
      setRevealLevel(revealLevel + 1);
    }
  };

  const resetGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    generateQuestion();
  };

  if (!currentQuestion) {
    return <div className="flex items-center justify-center h-full">{t('加载中...')}</div>;
  }

  const isGameOver = questionsAnswered >= totalQuestions && showResult;

  return (
    <div className="min-h-full bg-gradient-to-b from-green-50 to-white">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/games")}
            className="flex items-center gap-2 text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('返回')}</span>
          </button>
          <div className="text-sm">
            <span className="text-gray-600">{t('得分: ')}</span>
            <span className="text-lg text-green-600">{score}</span>
            <span className="text-gray-600">{t(' / ')} {questionsAnswered}</span>
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full ${
                i < questionsAnswered
                  ? "bg-green-600"
                  : i === questionsAnswered
                  ? "bg-green-300"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 游戏区域 */}
      <div className="p-6">
        <h2 className="text-xl mb-6 text-center">{t('这是什么文物？')}</h2>

        {/* 图片展示区 */}
        <div className="max-w-sm mx-auto mb-6">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
            <ImageWithFallback
              src={currentQuestion.artifact.image}
              alt="猜猜看"
              className="w-full h-full object-cover"
              style={{
                filter: `blur(${Math.max(0, 20 - revealLevel * 7)}px)`,
              }}
            />
          </div>
          <button
            onClick={handleReveal}
            disabled={revealLevel >= 3 || selectedAnswer !== null}
            className="w-full mt-3 py-2 bg-blue-100 text-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {revealLevel === 0
              ? t('Show clue (3 times)')
              : revealLevel === 1
              ? t('A bit clearer (2 times)')
              : revealLevel === 2
              ? t('Final hint (1 time)')
              : t('Full image displayed')}
          </button>
        </div>

        {/* 线索展示 */}
        {revealLevel > 0 && (
          <div className="max-w-sm mx-auto mb-6 space-y-2">
            {revealLevel >= 1 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  {t('💡 朝代：')}{currentQuestion.artifact.dynasty}
                </p>
              </div>
            )}
            {revealLevel >= 2 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  {t('💡 年代：')}{currentQuestion.artifact.year}
                </p>
              </div>
            )}
            {revealLevel >= 3 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  {t('💡 提示：')}{currentQuestion.artifact.description.slice(0, 30)}...
                </p>
              </div>
            )}
          </div>
        )}

        {/* 选项 */}
        <div className="max-w-sm mx-auto space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  showCorrect
                    ? "bg-green-100 border-green-600"
                    : showWrong
                    ? "bg-red-100 border-red-600"
                    : isSelected
                    ? "bg-gray-100 border-gray-400"
                    : "bg-white border-gray-200 hover:border-gray-400"
                } disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <span>{t(option)}</span>
                  {showCorrect && <Check className="w-5 h-5 text-green-600" />}
                  {showWrong && <X className="w-5 h-5 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* 结果提示 */}
        {showResult && !isGameOver && (
          <div className="max-w-sm mx-auto mt-4">
            <div
              className={`p-4 rounded-lg ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <p
                className={`text-center ${selectedAnswer === currentQuestion.correctAnswer
                  ? "text-green-800"
                  : "text-red-800"
                }`}
              >
                {selectedAnswer === currentQuestion.correctAnswer
                  ? t('🎉 回答正确！')
                  : `${t('❌ 正确答案是：')}${t(currentQuestion.correctAnswer)}`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 游戏结束弹窗 */}
      {isGameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl mb-2">{t('游戏结束！')}</h3>
            <p className="text-3xl text-green-600 mb-2">
              {score} / {totalQuestions}
            </p>
            <p className="text-gray-600 mb-6">
              {score === totalQuestions
                ? t('完美！你是文物专家！')
                : score >= totalQuestions * 0.6
                ? t('不错！继续加油！')
                : t('多看看文物介绍吧~')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg"
              >
                {t('再玩一次')}
              </button>
              <button
                onClick={() => navigate("/games")}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg"
              >
                {t('返回')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
