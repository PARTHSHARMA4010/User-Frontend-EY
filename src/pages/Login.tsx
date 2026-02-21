// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Call the API
    const result = await api.login(userId, phone);

    if (result.success) {
      // Save user to "Local Storage" so they stay logged in
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      // Go to Dashboard
      navigate('/'); 
    } else {
      setError(result.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <Card className="w-full max-w-md bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AutoAI Access
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter your credentials to access your fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-slate-200">User ID</Label>
              <Input 
                id="userId" 
                placeholder="e.g. parth_01" 
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white focus:ring-cyan-500/50 focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-200">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="e.g. 9876543210" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white focus:ring-cyan-500/50 focus:border-cyan-500"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Access"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;