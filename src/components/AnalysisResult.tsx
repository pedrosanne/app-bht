
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Target, Shield, Award, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResultProps {
  result: {
    signal: string;
    confidence: number;
    score: number;
    reasoning: string;
    entry: number;
    stopLoss: number;
    takeProfit: number;
    riskReward: string;
  };
  tradingParams: {
    asset: string;
    timeframe: string;
    precision: string;
  };
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, tradingParams }) => {
  const { toast } = useToast();
  const isUpSignal = result.signal === 'Compra';

  const handleGenerateReport = () => {
    toast({
      title: "Relatório Gerado",
      description: "PDF da análise está sendo preparado...",
    });
  };

  return (
    <Card className="p-6 glass-effect border-neon-blue/30 animate-bounce-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center space-x-2">
          {isUpSignal ? (
            <TrendingUp className="h-6 w-6 text-green-400" />
          ) : (
            <TrendingDown className="h-6 w-6 text-red-400" />
          )}
          <span>Resultado da Análise</span>
        </h3>
        
        <div className="flex items-center space-x-2">
          <Badge className="bg-yellow-500">
            <Award className="h-3 w-3 mr-1" />
            +{result.score} pts
          </Badge>
        </div>
      </div>

      {/* Sinal Principal */}
      <div className={`
        rounded-lg p-6 mb-6 text-center
        ${isUpSignal ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}
      `}>
        <div className="text-3xl font-bold mb-2">
          {isUpSignal ? '🚀 COMPRA' : '📉 VENDA'}
        </div>
        <div className="text-lg">
          Confiança: <span className="font-semibold">{result.confidence}%</span>
        </div>
      </div>

      {/* Parâmetros do Trade */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-black/40 rounded-lg p-4 border border-gray-600">
          <div className="text-sm text-gray-400 mb-1">Entrada</div>
          <div className="text-lg font-semibold text-neon-blue">{result.entry}</div>
        </div>
        
        <div className="bg-black/40 rounded-lg p-4 border border-gray-600">
          <div className="text-sm text-gray-400 mb-1">Stop Loss</div>
          <div className="text-lg font-semibold text-red-400">{result.stopLoss}</div>
        </div>
        
        <div className="bg-black/40 rounded-lg p-4 border border-gray-600">
          <div className="text-sm text-gray-400 mb-1">Take Profit</div>
          <div className="text-lg font-semibold text-green-400">{result.takeProfit}</div>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Ativo:</span>
          <span className="font-semibold text-white">{tradingParams.asset.toUpperCase()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Timeframe:</span>
          <span className="font-semibold text-white">{tradingParams.timeframe}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Risco/Retorno:</span>
          <span className="font-semibold text-neon-blue">{result.riskReward}</span>
        </div>
      </div>

      {/* Justificativa */}
      <div className="bg-black/40 rounded-lg p-4 mb-6 border border-gray-600">
        <h4 className="font-semibold mb-2 flex items-center space-x-2">
          <Target className="h-4 w-4 text-neon-blue" />
          <span>Análise Técnica</span>
        </h4>
        <p className="text-gray-300 text-sm leading-relaxed">
          {result.reasoning}
        </p>
      </div>

      {/* Alertas de Risco */}
      <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-4 w-4 text-orange-400" />
          <span className="font-semibold text-orange-400">Aviso de Risco</span>
        </div>
        <p className="text-sm text-orange-200">
          Trading envolve riscos significativos. Nunca invista mais do que pode perder. 
          Esta análise é apenas sugestiva e não constitui aconselhamento financeiro.
        </p>
      </div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          className="metal-button flex-1"
          onClick={handleGenerateReport}
        >
          <Download className="h-4 w-4 mr-2" />
          Gerar Relatório PDF
        </Button>
        
        <Button 
          variant="outline" 
          className="border-gray-600 hover:border-neon-blue flex-1"
          onClick={() => window.location.reload()}
        >
          Nova Análise
        </Button>
      </div>
    </Card>
  );
};

export default AnalysisResult;
