import React, { createContext, useContext, useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // You have sonner in your package.json for cool toast notifications!

// Define what our context will provide to the rest of the app
interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);

  // Define our voice commands for navigation
  
  // Define our voice commands for navigation
  const commands = [
    {
      command: ['go to overview', 'go to home', 'open dashboard'],
      callback: ({ resetTranscript }: any) => {
        navigate('/');
        speak('Opening overview');
        toast.success('Navigating to Overview');
        resetTranscript(); // <--- This wipes the text clean!
      },
    },
    {
      command: ['go to bookings', 'open bookings', 'service center', 'service centre'],
      callback: ({ resetTranscript }: any) => {
        navigate('/bookings');
        speak('Opening service center bookings');
        toast.success('Navigating to Bookings');
        resetTranscript(); // <--- This wipes the text clean!
      },
    },
    {
      command: ['terminate session', 'log out', 'go to login'],
      callback: ({ resetTranscript }: any) => {
        navigate('/login');
        speak('Terminating session. Goodbye.');
        toast.error('Session Terminated');
        resetTranscript(); // <--- This wipes the text clean!
      },
    },
    {
      // Bonus: A command just to clear the screen manually if it gets cluttered
      command: ['clear', 'clear transcript', 'clear text'],
      callback: ({ resetTranscript }: any) => {
        resetTranscript();
      }
    }
  ];

  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

  // Sync our local state with the library's state
  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  // The Voice (Text-to-Speech function)
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    // You can change the voice/pitch here later if you want a robotic AI voice!
    utterance.pitch = 1; 
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser doesn't support speech recognition.");
  }

  return (
    <VoiceContext.Provider value={{ isListening, transcript, startListening, stopListening, speak }}>
      {children}
    </VoiceContext.Provider>
  );
};

// Custom hook so any component can use the voice context easily
export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};