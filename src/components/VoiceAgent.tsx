import { useVoice } from '../contexts/VoiceContext';
import { Button } from './ui/button';
import { Mic, MicOff } from 'lucide-react';

const VoiceAgent = () => {
  const { isListening, startListening, stopListening, transcript } = useVoice();

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2 pointer-events-none">
      
      {/* Live Transcript - Shows what you are saying in real-time */}
      {isListening && transcript && (
        <div className="bg-[#050b14]/90 border border-cyan-500/50 text-cyan-400 p-3 rounded-lg max-w-xs shadow-[0_0_15px_rgba(6,182,212,0.5)] backdrop-blur-md pointer-events-auto transition-all">
          <p className="text-sm font-mono tracking-wide">"{transcript}"</p>
        </div>
      )}
      
      {/* The Mic Button */}
      <Button
        onClick={isListening ? stopListening : startListening}
        size="icon"
        className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 pointer-events-auto ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]' 
            : 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
        }`}
      >
        {isListening ? (
          <MicOff className="w-8 h-8 text-white" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
      </Button>
      
    </div>
  );
};

export default VoiceAgent;