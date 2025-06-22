
import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Clock, Target } from 'lucide-react';

interface TradingFormProps {
  params: {
    asset: string;
    timeframe: string;
    precision: string;
  };
  onChange: (params: any) => void;
  disabled?: boolean;
}

const TradingForm: React.FC<TradingFormProps> = ({ params, onChange, disabled = false }) => {
  const updateParam = (key: string, value: string) => {
    onChange({ ...params, [key]: value });
  };

  const assetOptions = [
    { value: 'forex', label: 'Forex (EUR/USD, GBP/USD...)', icon: '💱' },
    { value: 'crypto', label: 'Criptomoedas (BTC, ETH...)', icon: '₿' },
    { value: 'stocks', label: 'Ações (AAPL, TSLA...)', icon: '📈' },
    { value: 'indices', label: 'Índices (S&P500, NASDAQ...)', icon: '📊' },
  ];

  const timeframeOptions = [
    { value: 'M1', label: '1 Minuto', duration: 'Scalping' },
    { value: 'M5', label: '5 Minutos', duration: 'Day Trade' },
    { value: 'M15', label: '15 Minutos', duration: 'Day Trade' },
    { value: 'H1', label: '1 Hora', duration: 'Swing' },
    { value: 'H4', label: '4 Horas', duration: 'Swing' },
    { value: 'D1', label: '1 Dia', duration: 'Position' },
  ];

  const precisionOptions = [
    { value: 'conservadora', label: 'Conservadora', description: 'Sinais mais seguros, menor frequência', color: 'bg-green-500/20 text-green-400' },
    { value: 'neutra', label: 'Neutra', description: 'Equilibrio entre risco e oportunidade', color: 'bg-yellow-500/20 text-yellow-400' },
    { value: 'agressiva', label: 'Agressiva', description: 'Mais sinais, maior risco/retorno', color: 'bg-red-500/20 text-red-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Tipo de Ativo */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center space-x-2">
          <BarChart3 className="h-4 w-4 text-neon-blue" />
          <span>Tipo de Ativo</span>
        </Label>
        <Select
          value={params.asset}
          onValueChange={(value) => updateParam('asset', value)}
          disabled={disabled}
        >
          <SelectTrigger className="glass-effect border-gray-600 focus:border-neon-blue">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black border-gray-600">
            {assetOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center space-x-2">
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Timeframe */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center space-x-2">
          <Clock className="h-4 w-4 text-neon-blue" />
          <span>Tempo Gráfico</span>
        </Label>
        <Select
          value={params.timeframe}
          onValueChange={(value) => updateParam('timeframe', value)}
          disabled={disabled}
        >
          <SelectTrigger className="glass-effect border-gray-600 focus:border-neon-blue">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black border-gray-600">
            {timeframeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center justify-between w-full">
                  <span>{option.label}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {option.duration}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Precisão */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center space-x-2">
          <Target className="h-4 w-4 text-neon-blue" />
          <span>Precisão da Análise</span>
        </Label>
        <Select
          value={params.precision}
          onValueChange={(value) => updateParam('precision', value)}
          disabled={disabled}
        >
          <SelectTrigger className="glass-effect border-gray-600 focus:border-neon-blue">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black border-gray-600">
            {precisionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span>{option.label}</span>
                    <Badge className={`text-xs ${option.color} border-0`}>
                      {option.value.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-400">
                    {option.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TradingForm;
