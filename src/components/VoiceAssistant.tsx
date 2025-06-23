
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
  const [lastPlayedAudio, setLastPlayedAudio] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Arquivos de áudio locais
  const audioFiles = {
    solicitarGrafico: '/audio/solicitar-grafico.mp3',
    analisando: '/audio/analisando.mp3',
    analiseCompleta: '/audio/analise-completa.mp3'
  };

  // Função para parar qualquer áudio que esteja tocando
  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
    setCurrentMessage('');
  };

  // Função para reproduzir áudio local com controle de sobreposição
  const playAudio = async (audioKey: keyof typeof audioFiles, message: string) => {
    // Evitar tocar o mesmo áudio novamente
    if (lastPlayedAudio === audioKey) {
      return;
    }

    // Parar qualquer áudio anterior
    stopCurrentAudio();

    if (isMuted) {
      setCurrentMessage(message);
      setIsSpeaking(true);
      setLastPlayedAudio(audioKey);
      setTimeout(() => {
        setIsSpeaking(false);
        setCurrentMessage('');
      }, 3000);
      return;
    }

    try {
      setCurrentMessage(message);
      setIsSpeaking(true);
      setLastPlayedAudio(audioKey);

      // Criar novo elemento de áudio
      const audio = new Audio(audioFiles[audioKey]);
      audioRef.current = audio;
      
      audio.volume = 0.8;
      audio.preload = 'auto';
      
      audio.onended = () => {
        setIsSpeaking(false);
        setCurrentMessage('');
        audioRef.current = null;
      };

      audio.onerror = (error) => {
        console.log('Erro ao carregar áudio:', error);
        setTimeout(() => {
          setIsSpeaking(false);
          setCurrentMessage('');
          audioRef.current = null;
        }, 3000);
      };

      audio.oncanplaythrough = () => {
        audio.play().catch(error => {
          console.log('Erro ao reproduzir áudio:', error);
          setTimeout(() => {
            setIsSpeaking(false);
            setCurrentMessage('');
            audioRef.current = null;
          }, 3000);
        });
      };

      audio.load();
    } catch (error) {
      console.log('Erro geral ao reproduzir áudio:', error);
      setTimeout(() => {
        setIsSpeaking(false);
        setCurrentMessage('');
        audioRef.current = null;
      }, 3000);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && isSpeaking) {
      stopCurrentAudio();
    }
  };

  // Efeito para áudio de solicitar gráfico (só quando IA está ativa e não tem imagem)
  useEffect(() => {
    if (isActive && !hasImage && !isAnalyzing && !analysisComplete) {
      playAudio('solicitarGrafico', 'Adicione um print do gráfico.');
    } else if (hasImage || isAnalyzing || analysisComplete) {
      // Se já tem imagem, está analisando ou análise completa, parar o áudio de solicitar
      if (lastPlayedAudio === 'solicitarGrafico') {
        stopCurrentAudio();
        setLastPlayedAudio('');
      }
    }
  }, [isActive, hasImage, isAnalyzing, analysisComplete]);

  // Efeito para áudio de análise (só quando tem imagem e está analisando)
  useEffect(() => {
    if (hasImage && isAnalyzing && !analysisComplete) {
      playAudio('analisando', 'Obrigado! Estou analisando…');
    }
  }, [hasImage, isAnalyzing, analysisComplete]);

  // Efeito para áudio de análise completa
  useEffect(() => {
    if (analysisComplete && !isAnalyzing) {
      playAudio('analiseCompleta', 'Análise finalizada com sucesso! Realize a entrada imediatamente.');
    }
  }, [analysisComplete, isAnalyzing]);

  // Reset do estado quando a IA é desativada
  useEffect(() => {
    if (!isActive) {
      stopCurrentAudio();
      setLastPlayedAudio('');
    }
  }, [isActive]);

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      stopCurrentAudio();
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
