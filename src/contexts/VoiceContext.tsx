import React, { createContext, useContext, useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface VoiceContextType {
  isListening: boolean;
  isThinking: boolean; // NEW: Tells UI the AI is processing
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // --- THE AI HANDLER ---
  const handleAIQuery = async (question: string, resetTranscript: () => void) => {
    resetTranscript(); // Clear the text immediately
    setIsThinking(true);
    toast.info(`Transmitting to AI: "${question}"`);

    try {
      // ⚠️ THIS IS WHERE YOUR FRONTEND TALKS TO YOUR BACKEND!
      // Example for when your Express backend is ready:
      // const res = await axios.post('http://localhost:5000/api/chat', { prompt: question });
      // const answer = res.data.answer;

      // 🛑 For testing right now, we will use a MOCK answer:
      await new Promise(resolve => setTimeout(resolve, 1500)); // Fake network delay
      const answer = `I received your query about ${question}. All fleet systems are currently optimal.`;

      speak(answer);
      toast.success("AI Response received");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to AI Core.");
      speak("Error connecting to server.");
    } finally {
      setIsThinking(false);
    }
  };

  const commands = [
    // ... [KEEP YOUR EXISTING NAVIGATION COMMANDS HERE] ...
    {
      command: ['go to overview', 'go to home', 'open dashboard'],
      callback: ({ resetTranscript }: any) => {
        navigate('/');
        speak('Opening overview');
        toast.success('Navigating to Overview');
        resetTranscript();
      },
    },
    {
      command: ['go to bookings', 'open bookings', 'service center', 'service centre', 'go to booking'],
      callback: ({ resetTranscript }: any) => {
        navigate('/bookings');
        speak('Opening service center bookings');
        toast.success('Navigating to Bookings');
        resetTranscript();
      },
    },
    {
      command: ['terminate session', 'log out', 'go to login'],
      callback: ({ resetTranscript }: any) => {
        navigate('/login');
        speak('Terminating session. Goodbye.');
        toast.error('Session Terminated');
        resetTranscript();
      },
    },
    {
      command: ['clear', 'clear transcript'],
      callback: ({ resetTranscript }: any) => resetTranscript()
    },
    // --- 🤖 NEW: THE CONVERSATIONAL AI WAKE WORD ---
    {
      // The '*' catches everything you say after the wake word!
      command: ['ask auto *', 'hey auto *', 'computer *'],
      callback: (question: string, { resetTranscript }: any) => handleAIQuery(question, resetTranscript)
    }
  ];

  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    // Give it a slightly higher pitch/rate for a robotic feel if you want!
    utterance.pitch = 1.1; 
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => SpeechRecognition.startListening({ continuous: true });
  const stopListening = () => SpeechRecognition.stopListening();

  return (
    <VoiceContext.Provider value={{ isListening, isThinking, transcript, startListening, stopListening, speak }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) throw new Error('useVoice must be used within a VoiceProvider');
  return context;
};