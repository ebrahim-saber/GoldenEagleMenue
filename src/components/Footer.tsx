import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-surface relative w-full pt-32 pb-16 overflow-hidden border-t border-white/5">
      {/* Decorative background light */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
      
      <div className="px-6 md:px-12 max-w-[1920px] mx-auto space-y-24 font-headline relative z-10">
        
        {/* Top Section: Brand + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-tertiary font-black text-4xl tracking-[0.2em] uppercase leading-none">Rawaq</span>
                <div className="h-[1px] w-12 bg-primary/30"></div>
              </div>
              <p className="text-white/40 max-w-sm text-xs leading-relaxed tracking-widest uppercase font-bold">
                Where architectural legacy meets culinary precision. Rawaq is the signature sanctuary of the Imperial Plaza.
              </p>
            </div>
            
            <div className="flex gap-4">
               {['instagram', 'twitter', 'facebook'].map((icon) => (
                 <motion.button 
                   key={icon}
                   whileHover={{ y: -5, color: '#9cd2b5' }}
                   className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-white/30 hover:border-primary/20 transition-colors"
                 >
                   <span className="material-symbols-outlined text-lg">{icon === 'instagram' ? 'photo_camera' : icon === 'twitter' ? 'share' : 'public'}</span>
                 </motion.button>
               ))}
            </div>
          </div>

          {/* Newsletter / Club signup */}
          <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 flex flex-col md:flex-row justify-between items-center gap-12 group">
             <div className="space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-black uppercase text-white tracking-tighter">The Obsidian Circle</h3>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">Priority access to seasonal vaults & culinary manifestations.</p>
             </div>
             <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="IMPERIAL@IDENTITY.COM" 
                  className="bg-transparent border-b border-white/10 px-6 py-4 text-[10px] text-white tracking-widest font-black focus:border-primary outline-none transition-all placeholder:text-white/5 min-w-[300px]"
                />
                <button className="bg-white text-surface px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary transition-all active:scale-95 shadow-xl">Join</button>
             </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pb-24 border-b border-white/5 italic font-light">
          <div className="space-y-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 not-italic">Archive</span>
            <nav className="flex flex-col gap-4">
              {['Menu', 'Reservations', 'Private Dining', 'Gallery'].map(link => (
                <Link key={link} to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-sm text-white/40 hover:text-white transition-colors">{link}</Link>
              ))}
            </nav>
          </div>

          <div className="space-y-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 not-italic">Heritage</span>
            <nav className="flex flex-col gap-4">
              {['Our Story', 'The Resort', 'Artistry', 'Provenance'].map(link => (
                <Link key={link} to="/our-story" className="text-sm text-white/40 hover:text-white transition-colors">{link}</Link>
              ))}
            </nav>
          </div>

          <div className="space-y-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 not-italic">Inquiries</span>
            <div className="flex flex-col gap-4 text-sm text-white/40">
               <p className="hover:text-primary transition-colors cursor-pointer">concierge@rawaq.resort</p>
               <p className="hover:text-primary transition-colors cursor-pointer">+20 100 000 0000</p>
               <p>Imperial Plaza, Vault III</p>
            </div>
          </div>

          <div className="space-y-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 not-italic">Staff Entry</span>
            <div className="flex flex-col gap-6">
               <Link to="/admin" className="inline-block px-6 py-3 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/5 transition-all text-center">Admin Portal</Link>
               <div className="flex items-center gap-3 text-white/10">
                  <span className="material-symbols-outlined text-sm">security</span>
                  <span className="text-[8px] font-black uppercase tracking-widest">Encrypted Session</span>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-12 text-[9px] font-black text-white/15 uppercase tracking-[0.3em]">
             <Link to="#" className="hover:text-white">Privacy</Link>
             <Link to="#" className="hover:text-white">Terms</Link>
             <Link to="#" className="hover:text-white">Accessibility</Link>
          </div>
          <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">© 2024 RAWAQ COLLECTIONS. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
