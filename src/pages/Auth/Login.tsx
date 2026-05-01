import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNotification } from '../../context/NotificationContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const { showNotification } = useNotification();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      if (error.message === 'Invalid login credentials' && email === 'leader@rawaq.com') {
        const confirmCreate = window.confirm("هذا الحساب غير موجود في قاعدة بيانات Supabase الحقيقية. هل تريد إنشاؤه الآن كحساب مسؤول حقيقي؟");
        if (confirmCreate) {
          const { error: signUpError } = await supabase.auth.signUp({ email, password });
          if (signUpError) {
            showNotification(signUpError.message, 'error');
          } else {
            showNotification('تم إنشاء الحساب! يرجى تفعيل البريد الإلكتروني (إذا كان التفعيل مفعلاً في Supabase) ثم حاول الدخول.', 'success');
          }
        }
      } else {
        showNotification(error.message, 'error');
      }
    } else {
      showNotification('Welcome back to RAWAQ', 'success');
      navigate('/');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      showNotification(message, 'error');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-tertiary/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] p-12 shadow-2xl space-y-10">
          <header className="text-center space-y-4">
            <h1 className="text-5xl font-headline font-black tracking-tighter uppercase text-on-surface">Sign In</h1>
            <p className="text-white/40 text-[10px] tracking-[0.3em] font-bold uppercase">Experience Signature Dining</p>
          </header>

          <div className="space-y-6">
            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-white text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              Continue with Google
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold">Or use email</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/30 transition-all font-light"
                  placeholder="name@luxury.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/30 transition-all font-light"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-on-primary py-5 rounded-2xl font-headline font-black uppercase tracking-[0.3em] text-[11px] shadow-xl transition-all duration-500 hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </div>

          <footer className="text-center pt-6">
            <p className="text-white/30 text-[10px] tracking-widest uppercase">
              Don't have an account? {' '}
              <Link to="/signup" className="text-tertiary font-bold hover:underline underline-offset-4">Join Rawaq</Link>
            </p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
