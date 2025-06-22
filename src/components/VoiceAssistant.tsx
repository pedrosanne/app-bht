
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceAssistantProps {
  isActive: boolean;
  isAnalyzing: boolean;
  hasImage: boolean;
  analysisComplete: boolean;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  isActive,
  isAnalyzing,
  hasImage,
  analysisComplete
}) => {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Simular fala da IA
  const speak = (text: string) => {
    setCurrentMessage(text);
    setIsSpeaking(true);
    
    // Simular duração da fala
    setTimeout(() => {
      setIsSpeaking(false);
      setCurrentMessage('');
    }, 3000);
  };

  useEffect(() => {
    if (isActive && !hasImage) {
      speak("Adicione um print do gráfico.");
    }
  }, [isActive]);

  useEffect(() => {
    if (hasImage && isAnalyzing) {
      speak("Obrigado! Estou analisando…");
    }
  }, [hasImage, isAnalyzing]);

  useEffect(() => {
    if (analysisComplete) {
      speak("Análise finalizada com sucesso! Realize a entrada imediatamente.");
    }
  }, [analysisComplete]);

  // Componente do espectro visual
  const AudioSpectrum = () => (
    <div className="flex items-end justify-center space-x-1 h-16">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="spectrum-bar w-2"
          style={{
            '--delay': `${i * 0.1}s`,
            height: `${Math.random() * 40 + 20}px`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );

  return (
    <Card className="p-6 glass-effect border-neon-blue/30 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          {isActive ? (
            <Mic className="h-5 w-5 text-green-400" />
          ) : (
            <MicOff className="h-5 w-5 text-red-400" />
          )}
          <span>Assistente de Voz</span>
        </h3>
        
        {isSpeaking && (
          <Volume2 className="h-5 w-5 text-neon-blue animate-pulse" />
        )}
      </div>

      {/* Avatar da IA */}
      <div className="flex flex-col items-center space-y-4">
        <div className={`
          w-20 h-20 rounded-full bg-gradient-metal flex items-center justify-center
          ${isActive ? 'animate-pulse-neon' : 'opacity-50'}
          transition-all duration-300
        `}>
          <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center">
            <Mic className={`h-8 w-8 ${isActive ? 'text-neon-blue' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Espectro de áudio */}
        {isSpeaking && (
          <div className="w-full animate-fade-in-up">
            <AudioSpectrum />
          </div>
        )}

        {/* Mensagem atual */}
        {currentMessage && (
          <div className="text-center animate-fade-in-up">
            <p className="text-neon-blue font-semibold text-lg mb-2">
              🎙️ IA Assistant
            </p>
            <p className="text-white text-sm bg-black/40 rounded-lg p-3 border border-neon-blue/30">
              "{currentMessage}"
            </p>
          </div>
        )}

        {/* Status quando não está falando */}
        {!isSpeaking && (
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {isActive 
                ? "Assistente pronto para ajudar"
                : "Ative a IA para começar"
              }
            </p>
          </div>
        )}
      </div>

      {/* Efeito de fundo */}
      {isSpeaking && (
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-transparent to-neon-blue/5 animate-pulse" />
      )}
    </Card>
  );
};

export default VoiceAssistant;
