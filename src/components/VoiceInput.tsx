import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';

interface VoiceInputProps {
  onCommand: (text: string) => void;
}

export function VoiceInput({ onCommand }: VoiceInputProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [manualInput, setManualInput] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const [supported] = useState(Boolean(SpeechRecognitionCtor));
  const lastTranscriptRef = useRef('');

  // Función para enviar el comando
  const sendCommand = useCallback((text: string) => {
    if (text.trim()) {
      console.log('🎤 Enviando comando:', text);
      onCommand(text.trim());
      setTranscript('');
      lastTranscriptRef.current = '';
    }
  }, [onCommand]);

  // Función para detener la escucha y enviar si hay contenido
  const stopAndSend = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch { /* ignore */ }
    }
    if (lastTranscriptRef.current.trim()) {
      sendCommand(lastTranscriptRef.current);
    }
    setIsListening(false);
  }, [sendCommand]);

  useEffect(() => {
    if (!SpeechRecognitionCtor) return;

    const recog = new SpeechRecognitionCtor();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = 'es-ES';
    recog.maxAlternatives = 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recog.onresult = (event: any) => {
      let currentTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }

      console.log('🎤 Transcript:', currentTranscript);
      setTranscript(currentTranscript);
      lastTranscriptRef.current = currentTranscript;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recog.onerror = (event: any) => {
      console.error('❌ Error de reconocimiento de voz:', event.error);
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        setIsListening(false);
      }
      if (event.error === 'not-allowed') {
        setTranscript('⚠️ Permisos de micrófono denegados. Usa el campo de texto.');
      }
    };

    recog.onend = () => {
      console.log('🔚 Reconocimiento terminado');
      // No hacer nada aquí - el usuario controla manualmente
    };

    recognitionRef.current = recog;

    return () => {
      try { recog.stop(); } catch { /* ignore */ }
    };
  }, [SpeechRecognitionCtor]);

  const toggleListening = () => {
    if (!supported) {
      setTranscript('⚠️ Speech Recognition no soportado. Usa el campo de texto.');
      return;
    }

    if (isListening) {
      // Detener y enviar lo que haya
      stopAndSend();
    } else {
      // Iniciar escucha
      setTranscript('🎤 Escuchando... (haz clic otra vez para enviar)');
      lastTranscriptRef.current = '';
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error('Error starting recognition:', e);
        // Reiniciar el reconocimiento si falla
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
            setIsListening(true);
          } catch { /* ignore */ }
        }, 100);
      }
    }
  };

  // Manejar envío manual
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      sendCommand(manualInput);
      setManualInput('');
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          {isListening ? <Mic className="text-red-400 animate-pulse" /> : <MicOff className="text-slate-400" />}
          Control por Voz
        </h3>
        <button
          onClick={toggleListening}
          className={`p-3 rounded-full transition-all ${
            isListening 
              ? 'bg-red-600 animate-pulse shadow-lg shadow-red-500/50' 
              : 'bg-blue-600 hover:bg-blue-500'
          }`}
          title={isListening ? 'Haz clic para enviar el comando' : 'Haz clic para empezar a hablar'}
        >
          {isListening ? <Mic className="text-white" size={20} /> : <MicOff className="text-white" size={20} />}
        </button>
      </div>
      
      {/* Transcripción de voz */}
      <div className="bg-slate-900/50 p-3 rounded-lg min-h-[48px] mb-3">
        <p className={`text-sm ${transcript ? 'text-white' : 'text-slate-500'}`}>
          {transcript || (supported ? 'Haz clic en el micrófono → habla → haz clic otra vez para enviar' : 'Speech Recognition no soportado')}
        </p>
      </div>

      {/* Instrucción adicional cuando está escuchando */}
      {isListening && (
        <p className="text-xs text-amber-400 mb-3">
          👆 Cuando termines de hablar, haz clic en el botón rojo para enviar el comando
        </p>
      )}

      {/* Input manual como alternativa */}
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <input
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="Escribe un comando aquí (ej: ve hacia la persona)"
          className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!manualInput.trim()}
          className="bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:cursor-not-allowed px-3 py-2 rounded-lg transition-colors"
        >
          <Send size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
}