import { useState } from 'react';
import { WebcamCapture } from './components/WebcamCapture';
import { VoiceInput } from './components/VoiceInput';
import { RobotCanvas } from './components/RobotCanvas';
import { orchestrateCommand } from './agents';
import { useRobotStore } from './store/useRobotStore';
import { Loader2, Bot, Sparkles } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState('🤖 Esperando comando...');
  const [isProcessing, setIsProcessing] = useState(false);
  const [detections, setDetections] = useState<any[]>([]);
  const [lastResult, setLastResult] = useState<any>(null);
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
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Comando de prueba rápido
  const testCommand = () => {
    handleVoiceCommand('Robot muévete hacia adelante');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="text-blue-400" size={48} />
            <h1 className="text-3xl md:text-4xl font-bold text-blue-400">
              Voice + Vision Robot Commander
            </h1>
          </div>
          <p className="text-gray-400 flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-400" />
            Controla el robot usando voz + ML con Gemini AI
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Vision */}
          <div className="space-y-6">
            <WebcamCapture onDetectionsUpdate={setDetections} />
            
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
              <h3 className="font-bold mb-2 text-blue-300">💡 Comandos de ejemplo:</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• "Robot, muévete hacia adelante"</p>
                <p>• "Gira a la izquierda"</p>
                <p>• "Ve hacia la persona"</p>
                <p>• "Busca el objeto detectado"</p>
              </div>
              
              <button
                onClick={testCommand}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                🧪 Probar comando rápido
              </button>
            </div>
          </div>

          {/* Right Column - Robot & Control */}
          <div className="space-y-6">
            <RobotCanvas />
            
            <VoiceInput onCommand={handleVoiceCommand} />
            
            {/* Status Panel */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
              <h3 className="font-bold mb-2 text-green-400">Estado del Sistema</h3>
              <div className="flex items-center gap-2">
                {isProcessing && <Loader2 className="animate-spin text-blue-400" size={16} />}
                <p className="text-sm text-gray-300">{status}</p>
              </div>
              
              {lastResult && (
                <div className="mt-3 p-3 bg-gray-900/50 rounded text-xs">
                  <p className="text-gray-400 mb-1">Última decisión de IA:</p>
                  <p className="text-green-400">{lastResult.plan?.reasoning}</p>
                </div>
              )}
            </div>
            
            {/* Command History */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
              <h3 className="font-bold mb-2 text-purple-400">📝 Historial de Comandos</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {robotState.commandHistory.length === 0 ? (
                  <p className="text-sm text-gray-500">Sin comandos aún...</p>
                ) : (
                  robotState.commandHistory.map((cmd, i) => (
                    <p key={i} className="text-sm text-gray-400">
                      {i + 1}. {cmd}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>🤖 Powered by TensorFlow.js + Gemini AI + React</p>
        </footer>
      </div>
    </div>
  );
}