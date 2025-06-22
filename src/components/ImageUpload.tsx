
import React, { useCallback, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileImage, Loader2, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  isActive: boolean;
  uploadedImage: string | null;
  isAnalyzing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  isActive,
  uploadedImage,
  isAnalyzing
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback((file: File) => {
    if (!isActive) {
      toast({
        title: "IA Inativa",
        description: "Ative a IA primeiro para fazer upload de imagens",
        variant: "destructive"
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo Inválido",
        description: "Por favor, envie apenas arquivos de imagem",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      onImageUpload(imageUrl);
    };
    reader.readAsDataURL(file);
  }, [isActive, onImageUpload, toast]);

  const handlePasteImage = useCallback(async () => {
    if (!isActive) {
      toast({
        title: "IA Inativa",
        description: "Ative a IA primeiro para colar imagens",
        variant: "destructive"
      });
      return;
    }

    try {
      const clipboardItems = await navigator.clipboard.read();
      
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = await clipboardItem.getType(type);
            const file = new File([blob], 'pasted-image.png', { type });
            handleFileUpload(file);
            toast({
              title: "Imagem Colada",
              description: "Imagem colada com sucesso da área de transferência",
            });
            return;
          }
        }
      }
      
      toast({
        title: "Nenhuma Imagem",
        description: "Não foi encontrada nenhuma imagem na área de transferência",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Erro ao Colar",
        description: "Não foi possível acessar a área de transferência. Tente usar Ctrl+V.",
        variant: "destructive"
      });
    }
  }, [isActive, handleFileUpload, toast]);

  // Handler para Ctrl+V
  useEffect(() => {
    const handleKeyPaste = async (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'v' && isActive) {
        e.preventDefault();
        
        if (!navigator.clipboard || !navigator.clipboard.read) {
          // Fallback para browsers mais antigos
          return;
        }
        
        await handlePasteImage();
      }
    };

    document.addEventListener('keydown', handleKeyPaste);
    return () => document.removeEventListener('keydown', handleKeyPaste);
  }, [handlePasteImage, isActive]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center space-x-2">
        <FileImage className="h-5 w-5 text-neon-blue" />
        <span>Upload do Gráfico</span>
      </h3>

      {!uploadedImage ? (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
            ${isDragOver ? 'border-neon-blue bg-neon-blue/10' : 'border-gray-600'}
            ${isActive ? 'hover:border-neon-blue hover:bg-neon-blue/5 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
          `}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-6">
            {isActive 
              ? "Arraste uma imagem do gráfico aqui, cole com Ctrl+V ou clique para selecionar"
              : "Ative a IA primeiro para fazer upload"
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              disabled={!isActive}
            />
            
            <Button
              asChild
              className="metal-button"
              disabled={!isActive}
            >
              <label htmlFor="file-upload">
                <Upload className="h-4 w-4 mr-2" />
                Selecionar Imagem
              </label>
            </Button>

            <Button
              onClick={handlePasteImage}
              className="metal-button"
              disabled={!isActive}
            >
              <Clipboard className="h-4 w-4 mr-2" />
              Colar Imagem
            </Button>
          </div>

          {isActive && (
            <p className="text-xs text-gray-500 mt-4">
              💡 Dica: Você também pode usar Ctrl+V para colar uma imagem da área de transferência
            </p>
          )}
        </div>
      ) : (
        <Card className="p-4 glass-effect border-neon-blue/30">
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Gráfico enviado"
              className="w-full h-64 object-contain rounded-lg bg-black/20"
            />
            
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-neon-blue mx-auto mb-2" />
                  <p className="text-white font-semibold">Analisando gráfico...</p>
                  <p className="text-gray-300 text-sm">Aguarde alguns instantes</p>
                </div>
              </div>
            )}
          </div>
          
          {!isAnalyzing && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-green-400 text-sm">✓ Imagem carregada com sucesso</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="border-gray-600 hover:border-neon-blue"
              >
                Nova Análise
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;
