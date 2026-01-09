import { useEffect, useRef, useState } from 'react';
import { ObjectDetector } from '@/ml/objectDetection';
import { analyzeRegionColor } from '@/ml/colorDetection';
import { Camera, Loader2 } from 'lucide-react';

interface WebcamCaptureProps {
  onDetectionsUpdate?: (detections: any[]) => void;
}

export function WebcamCapture({ onDetectionsUpdate }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector] = useState(() => new ObjectDetector());
  const [isLoading, setIsLoading] = useState(true);
  const [detections, setDetections] = useState<any[]>([]);
  function drawDetections(predictions: any[], videoOnly = false) {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar tamaño del canvas al video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // IMPORTANTE: Dibujar el video primero
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (videoOnly) return;

    // Dibujar las detecciones encima
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#00ff00';

    predictions.forEach((prediction: any) => {
      const [x, y, width, height] = prediction.bbox;
      // Rectángulo
      ctx.strokeRect(x, y, width, height);
      // Fondo para el texto
      const text = `${prediction.class} (${(prediction.score * 100).toFixed(0)}%)`;
      const textWidth = ctx.measureText(text).width;
      ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
      ctx.fillRect(x, y > 25 ? y - 25 : y, textWidth + 10, 25);
      // Texto
      ctx.fillStyle = '#000000';
      ctx.fillText(text, x + 5, y > 25 ? y - 5 : y + 20);
    });
  }

  async function startDetection() {
    if (!videoRef.current) return;
    const detect = async () => {
      try {
        const predictions = await detector.detect(videoRef.current!);

        // Enrich predictions with simple color analysis per bbox
        const enriched = predictions.map((p: any) => ({ ...p }));

        // draw video first so we can sample pixels
        drawDetections(enriched, true); // pass flag to draw video only

        // sample each bbox for color
        enriched.forEach((p: any) => {
          try {
            const [x, y, width, height] = p.bbox.map((v: number) => Math.max(0, Math.floor(v)));
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx && width > 0 && height > 0) {
              const img = ctx.getImageData(x, y, width, height);
              const colorAnalysis = analyzeRegionColor(img, 0.12); // threshold
              p.colorAnalysis = colorAnalysis;
            }
          } catch {
            // ignore sampling errors
          }
        });

        setDetections(enriched);
        if (onDetectionsUpdate) onDetectionsUpdate(enriched);
        drawDetections(enriched);
      } catch (error) {
        console.error('Error en detección:', error);
      }
      requestAnimationFrame(detect);
    };
    detect();
  }

  useEffect(() => {
    async function setup() {
      try {
        // Inicializar modelo
        await detector.initialize();
        
        // Iniciar webcam
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsLoading(false);
            startDetection();
          };
        }
      } catch (error) {
        console.error('Error al inicializar:', error);
        setIsLoading(false);
      }
    }
    
    setup();

    return () => {
      // Cleanup - copy the stream reference to avoid stale ref issues
      const vid = videoRef.current;
      if (vid?.srcObject) {
        const tracks = (vid.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [detector]);


  return (
    <div className="space-y-4">
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 rounded-lg">
            <div className="text-center">
              <Loader2 className="animate-spin text-white mx-auto mb-2" size={48} />
              <p className="text-white">Cargando modelo ML...</p>
            </div>
          </div>
        )}
        
        {/* Video oculto (solo para captura) */}
        <video 
          ref={videoRef} 
          style={{ display: 'none' }}
          playsInline
          autoPlay
          muted
        />
        
        {/* Canvas que muestra video + detecciones */}
        <canvas 
          ref={canvasRef} 
          className="w-full rounded-lg border-2 border-blue-500 bg-black"
        />
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
          <Camera size={20} />
          Objetos Detectados: {detections.length}
        </h3>
        <div className="flex flex-wrap gap-2">
          {detections.length === 0 ? (
            <span className="text-gray-400 text-sm">
              Esperando detecciones...
            </span>
          ) : (
            detections.map((d, i) => (
              <span 
                key={i} 
                className="px-3 py-1 bg-green-600 text-white rounded-full text-sm"
              >
                {d.class} ({(d.score * 100).toFixed(0)}%)
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}