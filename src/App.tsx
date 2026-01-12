import { useState } from 'react';
import { WebcamCapture } from './components/WebcamCapture';
import { VoiceInput } from './components/VoiceInput';
import { RobotCanvas } from './components/RobotCanvas';
import { orchestrateCommand } from './agents';
import { useRobotStore } from './store/useRobotStore';
import { Loader2, Bot, Sparkles, Eye, Target, Cpu } from 'lucide-react';
import type { Detection } from './types';
import type { OrchestrationResult } from './agents/orchestrator';

export default function App() {
  const [status, setStatus] = useState('🤖 Esperando comando...');
  const [isProcessing, setIsProcessing] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [lastResult, setLastResult] = useState<OrchestrationResult | null>(null);
  const robotState = useRobotStore();

  const handleVoiceCommand = async (command: string) => {
    if (isProcessing) return;

    setIsProcessing(true);
    robotState.addCommand(command);

    try {
      const result = await orchestrateCommand(
        command,
        detections,
        robotState,
        setStatus
      );
      setLastResult(result);

      // Actualizar el target en el store para visualización con coordenadas normalizadas
      if (result.visionResult?.found) {
        robotState.setTarget(
          result.visionResult.bestMatch,
          result.visionResult.position,
          result.visionResult.verticalPosition || 'middle',
          result.visionResult.normalizedX ?? 0.5,
          result.visionResult.normalizedY ?? 0.5
        );
      }
      if (result.plan?.reasoning) {
        robotState.setReasoning(result.plan.reasoning);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('❌ Error procesando comando');
    } finally {
      setIsProcessing(false);
    }
  };

  // Comando de prueba dinámico basado en objetos detectados
  const getTestCommand = () => {
    if (detections.length > 0) {
      const firstObject = detections[0].class;
      return `Robot, ve hacia ${firstObject === 'person' ? 'la persona' : `el ${firstObject}`}`;
    }
    return 'Robot, muévete hacia adelante';
  };

  const testCommand = () => {
    handleVoiceCommand(getTestCommand());
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-4 md:p-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Bot className="text-blue-400" size={40} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Voice + Vision Robot Commander
              </h1>
              <p className="text-slate-400 flex items-center gap-2">
                <Sparkles size={14} className="text-yellow-400" />
                Controla el robot usando voz + ML con Gemini AI
              </p>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Vision */}
          <div className="space-y-6">
            <WebcamCapture onDetectionsUpdate={setDetections} />

            <div className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-xl border border-slate-700/50">
              <h3 className="font-bold mb-3 text-blue-300 flex items-center gap-2">
                <Target size={18} />
                Comandos de ejemplo:
              </h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p className="flex items-center gap-2">
                  <span className="text-blue-400">•</span>
                  "Robot, muévete hacia adelante"
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-blue-400">•</span>
                  "Gira a la izquierda"
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-400">•</span>
                  "Ve hacia la persona" <span className="text-xs text-slate-500">(si hay persona detectada)</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-400">•</span>
                  "Busca el objeto rojo"
                </p>
              </div>

              <button
                onClick={testCommand}
                disabled={isProcessing}
                className="mt-4 w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Cpu size={18} />
                    Probar: "{getTestCommand()}"
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Robot & Control */}
          <div className="space-y-6">
            <RobotCanvas />

            <VoiceInput onCommand={handleVoiceCommand} />

            {/* Status Panel */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-xl border border-slate-700/50">
              <h3 className="font-bold mb-3 text-green-400 flex items-center gap-2">
                <Cpu size={18} />
                Estado del Sistema
              </h3>
              <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg">
                {isProcessing && <Loader2 className="animate-spin text-blue-400" size={16} />}
                <p className="text-sm text-slate-300">{status}</p>
              </div>

              {lastResult?.visionResult && (
                <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Eye size={12} />
                    Vision Agent:
                  </p>
                  <p className={`text-sm ${lastResult.visionResult.found ? 'text-green-400' : 'text-amber-400'}`}>
                    {lastResult.visionResult.found
                      ? `✅ Encontrado: ${lastResult.visionResult.bestMatch} (${(lastResult.visionResult.confidence * 100).toFixed(0)}%) - ${lastResult.visionResult.position}-${lastResult.visionResult.verticalPosition || 'middle'}`
                      : '⚠️ No se encontró el objeto buscado'
                    }
                  </p>
                </div>
              )}

              {lastResult?.plan?.reasoning && (
                <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-green-500/20">
                  <p className="text-xs text-slate-500 mb-1">💡 Decisión de IA:</p>
                  <p className="text-sm text-green-400">{lastResult.plan.reasoning}</p>
                </div>
              )}
            </div>

            {/* Command History */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-xl border border-slate-700/50">
              <h3 className="font-bold mb-3 text-purple-400">📝 Historial de Comandos</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {robotState.commandHistory.length === 0 ? (
                  <p className="text-sm text-slate-500">Sin comandos aún...</p>
                ) : (
                  robotState.commandHistory.map((cmd, i) => (
                    <p key={i} className="text-sm text-slate-400 flex items-center gap-2">
                      <span className="text-purple-400/60">{i + 1}.</span>
                      {cmd}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-500 text-sm border-t border-slate-800 pt-6">
          <p className="flex items-center justify-center gap-2">
            <Bot size={16} className="text-blue-400" />
            Powered by TensorFlow.js + Gemini AI + React
          </p>
        </footer>
      </div>
    </div>
  );
}