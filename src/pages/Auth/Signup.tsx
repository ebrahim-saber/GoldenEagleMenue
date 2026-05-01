import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useNotification } from '../../context/NotificationContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data: authData, error: signupError } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          role: 'user'
        }
      }
    });

    if (signupError) {
      showNotification(signupError.message, 'error');
    } else if (authData.user) {
      // Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id, 
            full_name: fullName, 
            phone: phone, 
            role: 'user' 
          }
        ]);

      if (profileError) {
        showNotification('Account created but profile setup failed. Please contact support.', 'info');
      } else {
        showNotification('Welcome to the RAWAQ Legacy. Please verify your email.', 'success');
      }
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-tertiary/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] p-12 shadow-2xl space-y-10">
          <header className="text-center space-y-4">
            <h1 className="text-5xl font-headline font-black tracking-tighter uppercase text-on-surface">Join Us</h1>
            <p className="text-white/40 text-[10px] tracking-[0.3em] font-bold uppercase">Begin Your Culinary Journey</p>
          </header>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/30 transition-all font-light"
                placeholder="Ex: Ebrahim Saber"
                required
              />
            </div>

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
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Phone Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/30 transition-all font-light"
                placeholder="+20 1XX XXX XXXX"
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <footer className="text-center pt-6">
            <p className="text-white/30 text-[10px] tracking-widest uppercase">
              Already a member? {' '}
              <Link to="/login" className="text-tertiary font-bold hover:underline underline-offset-4">Sign In</Link>
            </p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
