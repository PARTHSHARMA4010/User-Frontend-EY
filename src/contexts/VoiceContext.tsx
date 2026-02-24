import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface VoiceContextType {
  isListening: boolean;
  isThinking: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  setPageContext: (data: any) => void; // <-- NEW
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [pageContext, setPageContext] = useState<any>(null); // <-- NEW STATE

  // --- THE AI HANDLER ---
  const handleAIQuery = async (question: string, resetFn: () => void) => {
    if (!question || question.trim() === '') return;
    
    resetFn(); 
    setIsThinking(true);
    toast.info(`Transmitting to AI: "${question}"`);

    try {
      const response = await fetch('https://user-voice-backend.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question, context_data: pageContext }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      speak(data.answer);
      toast.success("AI Response received");
      
    } catch (error) {
      console.error("Backend connection failed:", error);
      toast.error("Failed to connect to AI Core.");
      speak("Error connecting to server.");
    } finally {
      setIsThinking(false);
    }
  };

  // --- ONLY STRICT NAVIGATION COMMANDS GO HERE NOW ---
  const commands = [
    {
      command: ['go to overview', 'go to home', 'open dashboard', "go to dashboard"],
      callback: ({ resetTranscript }: any) => {
        navigate('/');
        speak('Opening overview');
        toast.success('Navigating to Overview');
        resetTranscript();
      },
    },
    {
      command: ['go to bookings', 'open bookings', 'service center', 'go to booking', 'service centre'],
      callback: ({ resetTranscript }: any) => {
        navigate('/bookings');
        speak('Opening service center bookings');
        toast.success('Navigating to Bookings');
        resetTranscript();
      },
    },
    {
      command: ['terminate session', 'log out', 'go to login', 'logout'],
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
  ];

  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

  // --- 🤖 THE MAGIC SILENCE DETECTOR (BYPASSES LIBRARY BUGS) ---
  useEffect(() => {
    // If the AI is already thinking, or there is no text, do nothing.
    if (!transcript || isThinking) return;

    const lowerCaseTranscript = transcript.toLowerCase();
    
    // Check if the wake word is anywhere in the transcript
    if (
      lowerCaseTranscript.includes('hey auto') || 
      lowerCaseTranscript.includes('ask auto') || 
      lowerCaseTranscript.includes('computer')
    ) {
      
      // If we found the wake word, start a 1.5 second countdown.
      // Every time a new word is spoken, this countdown resets.
      // When you finally stop talking for 1.5s, it fires!
      const timer = setTimeout(() => {
        // Cut out the wake word and grab just the question
        const cleanQuestion = transcript.replace(/.*(?:hey auto|ask auto|computer)\s+/i, '').trim();
        
        console.log("🎯 SILENCE DETECTED! Auto-firing question:", cleanQuestion);
        handleAIQuery(cleanQuestion, resetTranscript);
      }, 2200);

      // Cleanup function to reset the timer if you keep talking
      return () => clearTimeout(timer);
    }
  }, [transcript, isThinking]); // Run this check every single time the transcript changes

  // Sync mic state
  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  // --- 🧹 THE JUNK CLEANER (Auto-clear transcript after 5 seconds) ---
  useEffect(() => {
    // If there is no text, or the AI is actively thinking, do nothing
    if (!transcript || isThinking) return;

    // Set a timer to wipe the text after 5 seconds of silence
    const clearTimer = setTimeout(() => {
      console.log("🧹 Clearing old transcript to keep UI clean...");
      resetTranscript();
    }, 5000);

    // CLEANUP: If the user says another word before 5 seconds is up, 
    // this cancels the timer and starts the 5-second countdown over again!
    return () => clearTimeout(clearTimer);
  }, [transcript, isThinking, resetTranscript]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.1; 
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => SpeechRecognition.startListening({ continuous: true });
  const stopListening = () => SpeechRecognition.stopListening();

  return (
    <VoiceContext.Provider value={{ isListening, isThinking, transcript, startListening, stopListening, speak, setPageContext }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) throw new Error('useVoice must be used within a VoiceProvider');
  return context;
};