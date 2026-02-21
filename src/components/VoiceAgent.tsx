import { useVoice } from '../contexts/VoiceContext';
import { Button } from './ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';

const VoiceAgent = () => {
  const { isListening, isThinking, startListening, stopListening, transcript } = useVoice();

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2 pointer-events-none">
      
      {/* AI Processing State */}
      {isThinking && (
        <div className="bg-purple-900/90 border border-purple-500/50 text-purple-300 p-3 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] backdrop-blur-md flex items-center gap-3 pointer-events-auto animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="text-sm font-mono tracking-wide">PROCESSING QUERY...</p>
        </div>
      )}

      {/* Live Transcript */}
      {isListening && transcript && !isThinking && (
        <div className="bg-[#050b14]/90 border border-cyan-500/50 text-cyan-400 p-3 rounded-lg max-w-xs shadow-[0_0_15px_rgba(6,182,212,0.5)] backdrop-blur-md pointer-events-auto">
          <p className="text-sm font-mono tracking-wide">"{transcript}"</p>
        </div>
      )}
      
      {/* The Mic Button */}
      <Button
        onClick={isListening ? stopListening : startListening}
        size="icon"
        className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 pointer-events-auto ${
          isThinking 
            ? 'bg-purple-600 shadow-[0_0_30px_rgba(168,85,247,0.8)] scale-110' // Purple when thinking
            : isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]' 
              : 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
        }`}
        disabled={isThinking} // Prevent clicking while AI is answering
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