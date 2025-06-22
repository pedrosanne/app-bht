
import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

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
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // URLs dos áudios do Google Drive convertidos para download direto
  const audioUrls = {
    solicitarGrafico: 'https://drive.google.com/uc?export=download&id=1mhoStMfPoodosun0iQrR7iOj5-ya5NjU',
    analisando: 'https://drive.google.com/uc?export=download&id=12HlzNIqrbUSK8arUovA1y6HGE6pNrn7Q',
    analiseCompleta: 'https://drive.google.com/uc?export=download&id=1tO4iisChB8zq7J-OTuomuvYIytEFEuUZ'
  };

  // Função para reproduzir áudio real
  const playAudio = async (audioKey: keyof typeof audioUrls, message: string) => {
    if (isMuted) {
      setCurrentMessage(message);
      setIsSpeaking(true);
      setTimeout(() => {
        setIsSpeaking(false);
        setCurrentMessage('');
      }, 3000);
      return;
    }

    try {
      setCurrentMessage(message);
      setIsSpeaking(true);

      // Criar novo elemento de áudio
      const audio = new Audio(audioUrls[audioKey]);
      audioRef.current = audio;
      
      audio.volume = 0.8;
      
      audio.onended = () => {
        setIsSpeaking(false);
        setCurrentMessage('');
      };

      audio.onerror = () => {
        console.log('Erro ao carregar áudio, usando fallback');
        // Fallback: manter texto por 3 segundos se áudio falhar
        setTimeout(() => {
          setIsSpeaking(false);
          setCurrentMessage('');
        }, 3000);
      };

      await audio.play();
    } catch (error) {
      console.log('Erro ao reproduzir áudio:', error);
      // Fallback: manter texto por 3 segundos se áudio falhar
      setTimeout(() => {
        setIsSpeaking(false);
        setCurrentMessage('');
      }, 3000);
    }
  };

  // Função para parar áudio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    setCurrentMessage('');
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && isSpeaking) {
      stopAudio();
    }
  };

  useEffect(() => {
    if (isActive && !hasImage) {
      playAudio('solicitarGrafico', 'Adicione um print do gráfico.');
    }
  }, [isActive]);

  useEffect(() => {
    if (hasImage && isAnalyzing) {
      playAudio('analisando', 'Obrigado! Estou analisando…');
    }
  }, [hasImage, isAnalyzing]);

  useEffect(() => {
    if (analysisComplete) {
      playAudio('analiseCompleta', 'Análise finalizada com sucesso! Realize a entrada imediatamente.');
    }
  }, [analysisComplete]);

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

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
        
        <div className="flex items-center space-x-2">
          {isSpeaking && (
            <Volume2 className="h-5 w-5 text-neon-blue animate-pulse" />
          )}
          
          {/* Botão de Mute */}
          <button
            onClick={toggleMute}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            title={isMuted ? "Ativar áudio" : "Silenciar áudio"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-red-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
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
            {isMuted && (
              <p className="text-red-400 text-xs mt-1">
                (Áudio silenciado)
              </p>
            )}
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
            {isMuted && (
              <p className="text-red-400 text-xs mt-1">
                🔇 Áudio silenciado
              </p>
            )}
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
