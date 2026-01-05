import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

export function VoiceInput({ onCommand }: { onCommand: (text: string) => void }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES'; // Español

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);

        if (event.results[current].isFinal) {
          onCommand(transcript);
        }
      };

      setRecognition(recognition);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
    setIsListening(!isListening);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold">Control por Voz</h3>
        <button
          onClick={toggleListening}
          className={`p-3 rounded-full ${
            isListening ? 'bg-red-600 animate-pulse' : 'bg-blue-600'
          }`}
        >
          {isListening ? <Mic className="text-white" /> : <MicOff className="text-white" />}
        </button>
      </div>
      
      <div className="bg-gray-900 p-3 rounded min-h-[60px]">
        <p className="text-gray-400 text-sm">
          {transcript || 'Di algo como: "Robot, ve hacia el objeto rojo"'}
        </p>
      </div>
    </div>
  );
}