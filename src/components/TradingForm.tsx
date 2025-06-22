
import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Clock } from 'lucide-react';
import PrecisionSlider from './PrecisionSlider';

interface TradingFormProps {
  params: {
    assetType: string;
    asset: string;
    timeframe: string;
    precision: number;
  };
  onChange: (params: any) => void;
  disabled?: boolean;
}

const TradingForm: React.FC<TradingFormProps> = ({ params, onChange, disabled = false }) => {
  const updateParam = (key: string, value: string | number) => {
    const newParams = { ...params, [key]: value };
    // Reset asset when changing asset type
    if (key === 'assetType') {
      newParams.asset = '';
    }
    onChange(newParams);
  };

  const assetTypes = [
    { value: 'moedas', label: 'Moedas', icon: '💱', description: 'Pares de moedas Forex' },
    { value: 'acoes', label: 'Ações', icon: '📈', description: 'Ações de grandes empresas' },
    { value: 'crypto', label: 'Crypto', icon: '₿', description: 'Criptomoedas principais' },
  ];

  const assetsByType = {
    moedas: [
      { value: 'AUD-CAD-OTC', label: 'AUD-CAD (OTC)' },
      { value: 'AUD-JPY-OTC', label: 'AUD-JPY (OTC)' },
      { value: 'EUR-GBP-OTC', label: 'EUR-GBP (OTC)' },
      { value: 'EUR-JPY-OTC', label: 'EUR-JPY (OTC)' },
      { value: 'EUR-USD-OTC', label: 'EUR-USD (OTC)' },
      { value: 'GBP-JPY-OTC', label: 'GBP-JPY (OTC)' },
      { value: 'GBP-USD-OTC', label: 'GBP-USD (OTC)' },
      { value: 'USD-BRL-OTC', label: 'USD-BRL (OTC)' },
      { value: 'USD-JPY-OTC', label: 'USD-JPY (OTC)' },
      { value: 'AUD-CAD', label: 'AUD-CAD' },
      { value: 'AUD-JPY', label: 'AUD-JPY' },
      { value: 'EUR-GBP', label: 'EUR-GBP' },
      { value: 'EUR-JPY', label: 'EUR-JPY' },
      { value: 'EUR-USD', label: 'EUR-USD' },
      { value: 'GBP-JPY', label: 'GBP-JPY' },
      { value: 'GBP-USD', label: 'GBP-USD' },
      { value: 'USD-JPY', label: 'USD-JPY' },
    ],
    acoes: [
      { value: 'Amazon-OTC', label: 'Amazon (OTC)' },
      { value: 'Apple-OTC', label: 'Apple (OTC)' },
      { value: 'Facebook-OTC', label: 'Facebook (OTC)' },
      { value: 'Google-OTC', label: 'Google (OTC)' },
      { value: 'Intel-OTC', label: 'Intel (OTC)' },
      { value: 'McDonalds-OTC', label: "McDonald's (OTC)" },
      { value: 'Microsoft-OTC', label: 'Microsoft (OTC)' },
      { value: 'NVIDIA-OTC', label: 'NVIDIA (OTC)' },
      { value: 'Tesla-OTC', label: 'Tesla (OTC)' },
      { value: 'Amazon', label: 'Amazon' },
      { value: 'Apple', label: 'Apple' },
      { value: 'Facebook', label: 'Facebook' },
      { value: 'Google', label: 'Google' },
      { value: 'Intel', label: 'Intel' },
      { value: 'McDonalds', label: "McDonald's" },
      { value: 'Microsoft', label: 'Microsoft' },
      { value: 'NVIDIA', label: 'NVIDIA' },
      { value: 'Tesla', label: 'Tesla' },
    ],
    crypto: [
      { value: 'Bitcoin-OTC', label: 'Bitcoin (OTC)' },
      { value: 'Cardano-OTC', label: 'Cardano (OTC)' },
      { value: 'Dogecoin-OTC', label: 'Dogecoin (OTC)' },
      { value: 'Ethereum-OTC', label: 'Ethereum (OTC)' },
      { value: 'Solana-OTC', label: 'Solana (OTC)' },
      { value: 'TRON-OTC', label: 'TRON (OTC)' },
      { value: 'USDT-OTC', label: 'USDT (OTC)' },
      { value: 'XRP-OTC', label: 'XRP (OTC)' },
    ],
  };

  const timeframeOptions = [
    { value: '5s', label: '5 Segundos', duration: 'Ultra-rápido' },
    { value: '10s', label: '10 Segundos', duration: 'Muito rápido' },
    { value: '15s', label: '15 Segundos', duration: 'Rápido' },
    { value: '30s', label: '30 Segundos', duration: 'Rápido' },
    { value: '1m', label: '1 Minuto', duration: 'Scalping' },
    { value: '2m', label: '2 Minutos', duration: 'Scalping' },
    { value: '3m', label: '3 Minutos', duration: 'Scalping' },
    { value: '5m', label: '5 Minutos', duration: 'Day Trade' },
  ];

  const currentAssets = params.assetType ? assetsByType[params.assetType as keyof typeof assetsByType] || [] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Tipo de Ativo */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center space-x-2">
          <BarChart3 className="h-4 w-4 text-neon-blue" />
          <span>Categoria</span>
        </Label>
        <Select
          value={params.assetType}
          onValueChange={(value) => updateParam('assetType', value)}
          disabled={disabled}
        >
          <SelectTrigger className="glass-effect border-gray-600 focus:border-neon-blue">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent className="bg-black border-gray-600">
            {assetTypes.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
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

      {/* Ativo Específico */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center space-x-2">
          <BarChart3 className="h-4 w-4 text-neon-blue" />
          <span>Ativo</span>
        </Label>
        <Select
          value={params.asset}
          onValueChange={(value) => updateParam('asset', value)}
          disabled={disabled || !params.assetType}
        >
          <SelectTrigger className="glass-effect border-gray-600 focus:border-neon-blue">
            <SelectValue placeholder="Selecione o ativo" />
          </SelectTrigger>
          <SelectContent className="bg-black border-gray-600 max-h-60">
            {currentAssets.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center justify-between w-full">
                  <span>{option.label}</span>
                  {option.label.includes('(OTC)') && (
                    <Badge variant="outline" className="ml-2 text-xs text-orange-400 border-orange-400">
                      OTC
                    </Badge>
                  )}
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
            <SelectValue placeholder="Selecione o tempo" />
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
        <PrecisionSlider
          value={params.precision}
          onChange={(value) => updateParam('precision', value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default TradingForm;
