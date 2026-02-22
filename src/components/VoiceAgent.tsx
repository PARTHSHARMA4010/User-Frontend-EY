import { useVoice } from '../contexts/VoiceContext';
import { Button } from './ui/button';
import { Mic, MicOff, Loader2, Send } from 'lucide-react';

const VoiceAgent = () => {
  const { isListening, isThinking, startListening, stopListening, transcript } = useVoice();

  // We need to access the handleAIQuery function from the context for our manual override
  // Make sure you export it in VoiceContext.tsx, or we can just simulate the wake word!
  const forceSendToAI = async () => {
    if (!transcript) return;
    try {
      // Manually call the backend
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: transcript }),
      });
      const data = await response.json();
      
      // Speak the answer and clear mic
      const utterance = new SpeechSynthesisUtterance(data.answer);
      window.speechSynthesis.speak(utterance);
      stopListening(); // Reset the mic state
      setTimeout(startListening, 1000); // Turn it back on cleanly
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2 pointer-events-none">
      
      {isThinking && (
        <div className="bg-purple-900/90 border border-purple-500/50 text-purple-300 p-3 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] backdrop-blur-md flex items-center gap-3 pointer-events-auto animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="text-sm font-mono tracking-wide">PROCESSING QUERY...</p>
        </div>
      )}

      {/* Live Transcript WITH Manual Override Button */}
      {isListening && transcript && !isThinking && (
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-[#050b14]/90 border border-cyan-500/50 text-cyan-400 p-3 rounded-lg max-w-xs shadow-[0_0_15px_rgba(6,182,212,0.5)] backdrop-blur-md">
            <p className="text-sm font-mono tracking-wide">"{transcript}"</p>
          </div>
          
          {/* MANUAL OVERRIDE BUTTON */}
          <Button 
            onClick={forceSendToAI}
            size="icon" 
            className="bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] rounded-full h-10 w-10"
            title="Force Send to AI"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      <Button
        onClick={isListening ? stopListening : startListening}
        size="icon"
        className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 pointer-events-auto ${
          isThinking 
            ? 'bg-purple-600 shadow-[0_0_30px_rgba(168,85,247,0.8)] scale-110' 
            : isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]' 
              : 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
        }`}
        disabled={isThinking}
      >
        {isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
      </Button>
    </div>
  );
};

export default VoiceAgent;