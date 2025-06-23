import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, Power, TrendingUp, TrendingDown, BarChart3, Clock, Target, Trophy, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';
import VoiceAssistant from '@/components/VoiceAssistant';
import AnalysisResult from '@/components/AnalysisResult';
import GameScore from '@/components/GameScore';
import TradingForm from '@/components/TradingForm';

const Index = () => {
  const [isAIActive, setIsAIActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [tradingParams, setTradingParams] = useState<{
    assetType: string;
    asset: string;
    timeframe: string;
    precision: number;
  }>({
    assetType: 'moedas',
    asset: '',
    timeframe: '5m',
    precision: 50
  });
  const { toast } = useToast();
  const analysisResultRef = useRef<HTMLDivElement>(null);

  // Scroll automático para o resultado quando a análise for concluída
  useEffect(() => {
    if (analysisResult && !isAnalyzing && analysisResultRef.current) {
      setTimeout(() => {
        analysisResultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 500); // Pequeno delay para garantir que o componente foi renderizado
    }
  }, [analysisResult, isAnalyzing]);

  const handleAIToggle = () => {
    setIsAIActive(!isAIActive);
    if (!isAIActive) {
      toast({
        title: "IA Ativada",
        description: "Assistente de voz está pronto para análise",
      });
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setIsAnalyzing(true);
    
    // Simular análise da IA
    setTimeout(() => {
      const signals = ['Compra', 'Venda'];
      const signal = signals[Math.floor(Math.random() * signals.length)];
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
      const score = Math.floor(Math.random() * 300) + 200; // 200-500 pontos
      
      const result = {
        signal,
        confidence,
        score,
        reasoning: signal === 'Compra' 
          ? "Padrão de reversão detectado com RSI oversold e volume crescente. Suporte forte identificado." 
          : "Resistência clara com divergência bearish no MACD. Padrão de topo duplo confirmado.",
        entry: signal === 'Compra' ? 1.2534 : 1.2598,
        stopLoss: signal === 'Compra' ? 1.2510 : 1.2620,
        takeProfit: signal === 'Compra' ? 1.2580 : 1.2550,
        riskReward: "1:2.5"
      };
      
      setAnalysisResult(result);
      setIsAnalyzing(false);
      setAnalysisCount(prev => prev + 1);
      setTotalScore(prev => prev + score);
      
      // Calcular novo nível
      const newLevel = Math.floor(totalScore / 1000) + 1;
      if (newLevel > userLevel) {
        setUserLevel(newLevel);
        toast({
          title: "🎉 Level Up!",
          description: `Parabéns! Você alcançou o nível ${newLevel}`,
        });
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-dark text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/b6caf80d-f50c-4265-87a8-3b903b1176c7.png" 
                alt="Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <GameScore 
                level={userLevel}
                score={totalScore}
                analysisCount={analysisCount}
              />
              
              <Button
                onClick={handleAIToggle}
                className={`metal-button flex items-center space-x-2 ${
                  isAIActive ? 'animate-pulse-neon' : ''
                }`}
              >
                <Power className={`h-4 w-4 ${isAIActive ? 'text-green-400' : 'text-red-400'}`} />
                <span>{isAIActive ? 'IA ATIVA' : 'ATIVAR IA'}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upload e Análise */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status e Controles */}
            <Card className="p-6 glass-effect border-neon-blue/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-neon-blue" />
                  <span>Centro de Análise</span>
                </h2>
                <Badge 
                  variant={isAIActive ? "default" : "secondary"}
                  className={isAIActive ? "bg-green-500" : "bg-red-500"}
                >
                  {isAIActive ? "IA ONLINE" : "IA OFFLINE"}
                </Badge>
              </div>

              <TradingForm 
                params={tradingParams}
                onChange={setTradingParams}
                disabled={!isAIActive}
              />
            </Card>

            {/* Upload de Imagem */}
            <Card className="p-6 glass-effect border-neon-blue/30">
              <ImageUpload
                onImageUpload={handleImageUpload}
                isActive={isAIActive}
                uploadedImage={uploadedImage}
                isAnalyzing={isAnalyzing}
              />
            </Card>

            {/* Resultado da Análise */}
            {analysisResult && (
              <div ref={analysisResultRef}>
                <AnalysisResult 
                  result={analysisResult}
                  tradingParams={{
                    asset: tradingParams.asset,
                    timeframe: tradingParams.timeframe,
                    precision: tradingParams.precision.toString()
                  }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Assistente de Voz */}
            <VoiceAssistant 
              isActive={isAIActive}
              isAnalyzing={isAnalyzing}
              hasImage={!!uploadedImage}
              analysisComplete={!!analysisResult}
            />

            {/* Estatísticas */}
            <Card className="p-6 glass-effect border-neon-blue/30">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span>Suas Estatísticas</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Análises Hoje</span>
                  <span className="text-white font-semibold">{analysisCount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Pontuação Total</span>
                  <span className="text-neon-blue font-semibold">{totalScore}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Nível Atual</span>
                  <span className="text-yellow-400 font-semibold">#{userLevel}</span>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Progresso do Nível</span>
                    <span className="text-sm text-gray-400">
                      {totalScore % 1000}/1000
                    </span>
                  </div>
                  <Progress 
                    value={(totalScore % 1000) / 10} 
                    className="h-2"
                  />
                </div>
              </div>
            </Card>

            {/* Dicas Rápidas */}
            <Card className="p-6 glass-effect border-neon-blue/30">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5 text-neon-blue" />
                <span>Dicas de Trading</span>
              </h3>
              
              <div className="space-y-3 text-sm text-gray-300">
                <p>• Sempre defina stop loss antes de entrar</p>
                <p>• Mantenha disciplina no gerenciamento de risco</p>
                <p>• Aguarde confirmação em múltiplos timeframes</p>
                <p>• Nunca arrisque mais de 2% do capital por trade</p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
