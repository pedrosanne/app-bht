
import React, { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileImage, Loader2 } from 'lucide-react';
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
          <p className="text-gray-300 mb-4">
            {isActive 
              ? "Arraste uma imagem do gráfico aqui ou clique para selecionar"
              : "Ative a IA primeiro para fazer upload"
            }
          </p>
          
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
              Selecionar Imagem
            </label>
          </Button>
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
