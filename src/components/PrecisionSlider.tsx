
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Target, Thermometer } from 'lucide-react';

interface PrecisionSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const PrecisionSlider: React.FC<PrecisionSliderProps> = ({ value, onChange, disabled = false }) => {
  const getPrecisionColor = (precision: number) => {
    if (precision <= 30) return 'from-green-500 to-green-400';
    if (precision <= 70) return 'from-yellow-500 to-yellow-400';
    return 'from-red-500 to-red-400';
  };

  const getPrecisionLabel = (precision: number) => {
    if (precision <= 30) return 'Conservadora';
    if (precision <= 70) return 'Neutra';
    return 'Agressiva';
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold flex items-center space-x-2">
        <Target className="h-4 w-4 text-neon-blue" />
        <span>Precisão da Análise</span>
      </Label>
      
      <div className="space-y-3">
        {/* Termômetro Visual */}
        <div className="flex items-center space-x-3">
          <Thermometer className="h-5 w-5 text-neon-blue" />
          <div className="flex-1 relative">
            <div className="h-6 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
              <div 
                className={`h-full bg-gradient-to-r ${getPrecisionColor(value)} transition-all duration-300 rounded-full`}
                style={{ width: `${value}%` }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xs font-semibold drop-shadow-lg">
                {value}%
              </span>
            </div>
          </div>
        </div>

        {/* Slider */}
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          max={100}
          min={1}
          step={1}
          disabled={disabled}
          className="w-full"
        />

        {/* Label de Precisão */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Conservadora</span>
          <span className={`text-sm font-semibold ${
            value <= 30 ? 'text-green-400' : 
            value <= 70 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {getPrecisionLabel(value)}
          </span>
          <span className="text-xs text-gray-400">Agressiva</span>
        </div>
      </div>
    </div>
  );
};

export default PrecisionSlider;
