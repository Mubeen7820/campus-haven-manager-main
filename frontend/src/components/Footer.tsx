"use client";
import React from "react";
import { Phone, Mail } from "lucide-react";

const GitHubIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.835 2.809 1.305 3.492.998.108-.776.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const TwitterIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.594 0-6.492 2.901-6.492 6.492 0 .512.057 1.01.173 1.496-5.405-.271-10.187-2.86-13.387-6.795-.56.96-.883 2.077-.883 3.256 0 2.254 1.147 4.243 2.887 5.419-.847-.025-1.649-.26-2.35-.647-.029.749.208 1.45.746 2.005.679.679 1.574 1.186 2.603 1.307-.207.056-.424.086-.647.086-.159 0-.315-.015-.467-.045.767 2.405 2.989 4.168 5.636 4.217-2.868 2.247-6.49 3.586-10.462 3.586-.681 0-1.35-.039-2.006-.118 3.692 2.378 8.016 3.766 12.692 3.766 15.232 0 23.52-12.69 23.52-23.52 0-.357-.012-.71-.031-1.063z" />
  </svg>
);

const LinkedInIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="text-slate-900 py-12 px-4 font-inter border-t border-slate-200 relative z-20">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Top Logo and University Name */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
            <div className="flex items-center gap-8">
               <img src="/aurora-logo.png" alt="logo" className="h-24 w-auto object-contain" />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-slate-900">Aurora Higher Education and Research Academy</h2>
              <p className="text-lg lg:text-xl opacity-90 italic mt-1 text-slate-700">Deemed-to-be-University</p>
              <p className="text-base opacity-75 mt-0.5 text-slate-500">Estd. u/s 3 of UGC Act 1956</p>
            </div>
          </div>

          <div className="w-full h-px bg-slate-200 max-w-4xl mx-auto" />

          {/* Campus and Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 max-w-5xl">
            <div className="space-y-4">
              <h3 className="text-blue-600 font-extrabold text-xl uppercase tracking-widest">Our Campuses</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                <span className="text-slate-900 font-bold">Day-Scholar Campus:</span><br />
                Uppal, Hyderabad - 500098, Telangana.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                <span className="text-slate-900 font-bold">Residential Campus:</span><br />
                Bhongir, Yadadri - 508116, Telangana.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-blue-600 font-extrabold text-xl uppercase tracking-widest">Get In Touch</h3>
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-900">+91 91001 23456</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-500/10 rounded-xl text-pink-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold text-slate-700">info@aurora.edu.in</span>
                </div>
              </div>

              <div className="flex justify-center md:justify-start space-x-8 pt-4">
                <a href="#" className="text-slate-500 hover:text-blue-600 transition-all transform hover:scale-110">
                  <GitHubIcon size={28} />
                </a>
                <a href="#" className="text-slate-500 hover:text-blue-400 transition-all transform hover:scale-110">
                  <TwitterIcon size={28} />
                </a>
                <a href="#" className="text-slate-500 hover:text-blue-800 transition-all transform hover:scale-110">
                  <LinkedInIcon size={28} />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 w-full text-center text-slate-500 text-base">
            <p>&copy; {new Date().getFullYear()} Aurora's Hostel Management. All rights reserved.</p>
            <p className="mt-1 text-sm">
              Designed with <span className="text-red-500">&hearts;</span> by Aurora Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
