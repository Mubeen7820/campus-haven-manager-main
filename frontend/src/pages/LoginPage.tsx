import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ShieldCheck, UtensilsCrossed, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BlurText from "@/components/BlurText";
import { AuroraText } from "@/components/AuroraText";
import Footer from "@/components/Footer";
import LogoLoop from "@/components/LogoLoop";
import Particles from "@/components/Particles";
import { supabase } from "@/lib/supabase";
const featureLogos = [
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">🍽️</span> <span className="text-3xl font-bold text-slate-700">Smart Mess</span></div>, title: "Smart Mess" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">🏠</span> <span className="text-3xl font-bold text-slate-700">Room Hub</span></div>, title: "Room Hub" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">📲</span> <span className="text-3xl font-bold text-slate-700">Hostel Pass</span></div>, title: "Hostel Pass" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">📊</span> <span className="text-3xl font-bold text-slate-700">Food Meter</span></div>, title: "Food Meter" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">🔔</span> <span className="text-3xl font-bold text-slate-700">Quick Alerts</span></div>, title: "Quick Alerts" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">🧾</span> <span className="text-3xl font-bold text-slate-700">Mess Feedback</span></div>, title: "Mess Feedback" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">🛠️</span> <span className="text-3xl font-bold text-slate-700">Fix Requests</span></div>, title: "Fix Requests" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">📅</span> <span className="text-3xl font-bold text-slate-700">Leave Desk</span></div>, title: "Leave Desk" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">👨‍💼</span> <span className="text-3xl font-bold text-slate-700">Warden Panel</span></div>, title: "Warden Panel" },
  { node: <div className="flex items-center gap-6 whitespace-nowrap"><span className="text-6xl">📢</span> <span className="text-3xl font-bold text-slate-700">Hostel Updates</span></div>, title: "Hostel Updates" },
];

const roles: { role: UserRole; label: string; icon: React.ElementType; desc: string }[] = [
  { role: "student", label: "Student", icon: GraduationCap, desc: "Access room, menu & payments" },
  { role: "admin", label: "Admin", icon: ShieldCheck, desc: "Manage hostel operations" },
  { role: "mess_staff", label: "Mess Staff", icon: UtensilsCrossed, desc: "Manage kitchen & food" },
];

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { role: userRole, error: loginError } = await login(email, password);

    if (loginError) {
      setError(loginError.message || "Incorrect email or password");
      return;
    }

    if (userRole !== selectedRole) {
      const roleNames = { student: "Student", admin: "Admin", mess_staff: "Mess Staff" };
      setError(`Unauthorized: Your account is not registered as ${roleNames[selectedRole]}. Please select the correct role.`);
      await logout();
      return;
    }

    const paths: Record<UserRole, string> = { admin: "/admin", student: "/student", mess_staff: "/mess" };
    navigate(paths[userRole]);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-950 overflow-y-auto"
    >
      <div
        className="min-h-screen w-full flex p-8 lg:p-16 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      >
        <div className={`absolute inset-0 transition-all duration-1000 ${showLogin ? "bg-black/75 backdrop-blur-[2px]" : "bg-black/30"}`} />

        {/* Top Right Login Toggle */}
        {!showLogin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-8 right-8 z-30"
          >
            <button
              onClick={() => setShowLogin(true)}
              className="relative p-[1.5px] bg-white/10 dark:bg-black rounded-lg overflow-hidden group shadow-xl transition-all hover:scale-105"
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'conic-gradient(from var(--angle), transparent 25%, #06b6d4, transparent 50%)',
                  animation: 'shimmer-spin 2.5s linear infinite',
                }}
              />
              <span className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-md text-white text-base font-bold rounded-lg group-hover:bg-white/20 transition-all">
                <ShieldCheck className="w-5 h-5 text-white" />
                Login
              </span>
            </button>
          </motion.div>
        )}

        <div className="relative z-10 w-full flex-1 flex flex-col lg:flex-row justify-between gap-12">

          {/* Left Side: Hero Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-white text-center lg:text-left self-start lg:mt-8"
          >
            <h1 className="text-4xl lg:text-[54px] xl:text-[64px] font-extrabold mb-6 text-white leading-[1.1] tracking-tight text-center lg:text-left drop-shadow-xl">
              <img
                src="/aurora-logo.png"
                alt="A"
                className="h-[0.95em] w-auto inline-block -mr-[0.05em] align-baseline"
              />
              <AuroraText speed={1} colors={["#FFFFFF", "#38BDF8", "#BD4733", "#FFFFFF", "#195DBA"]}>
                urora's Hostel & Mess System
              </AuroraText>
            </h1>

            <BlurText
              text="Streamline hostel operations, manage mess services, and enhance student living experience — all in one platform."
              delay={30}
              animateBy="words"
              direction="top"
              className="text-lg lg:text-xl text-white max-w-2xl mb-12 leading-relaxed"
            />

            <div className="flex justify-center lg:justify-start gap-10 lg:gap-14">
              {[
                { num: "500+", label: "Students" },
                { num: "120", label: "Rooms" },
                { num: "3", label: "Mess Halls" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl lg:text-3xl font-bold text-orange-500">{s.num}</p>
                  <p className="text-xs lg:text-sm font-medium text-white/80">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Login Card */}
          <div className="w-full lg:w-5/12 flex items-center justify-center self-center">
            <AnimatePresence>
              {showLogin && (
                <motion.div
                  key="login-card"
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="w-full max-w-md bg-white p-10 lg:p-12 rounded-2xl shadow-2xl relative"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setShowLogin(false)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                    title="Close"
                  >
                    <ArrowRight className="w-6 h-6 rotate-180" />
                  </button>

                  <h2 className="text-3xl font-bold mb-2 text-slate-900">Login</h2>
                  <p className="text-base text-slate-500 mb-8 font-medium">Identify your role to continue</p>

                  {/* Role selector */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {roles.map(({ role, label, icon: Icon }) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedRole === role
                          ? "border-primary bg-primary/5"
                          : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                          }`}
                      >
                        <Icon className={`w-8 h-8 ${selectedRole === role ? "text-primary" : "text-slate-400"}`} />
                        <p className={`text-sm font-bold ${selectedRole === role ? "text-slate-900" : "text-slate-500"}`}>{label}</p>
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@aurora.edu.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-base py-6 px-4 rounded-xl border-slate-200"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" title="password" className="text-sm font-bold text-slate-700">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="text-base py-6 px-4 pr-12 rounded-xl border-slate-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100 transition-colors text-slate-400"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    {error && (
                      <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="relative w-full p-[1.5px] rounded-xl overflow-hidden group shadow-lg transition-all hover:scale-[1.02]"
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'conic-gradient(from var(--angle), transparent 25%, #06b6d4, transparent 50%)',
                          animation: 'shimmer-spin 2.5s linear infinite',
                        }}
                      />
                      <span className="relative z-10 w-full text-xl py-5 bg-[#1e293b] text-white rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#0f172a] transition-all font-black tracking-wide">
                        LOGIN <ArrowRight className="w-6 h-6 ml-2" />
                      </span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="relative bg-[#fafafa] overflow-hidden">
        {/* Diagonal Grid Background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px),
              repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute inset-0 z-0">
          <Particles
            particleColors={["#14b8a6", "#3b82f6", "#06b6d4"]}
            particleCount={150}
            particleSpread={12}
            speed={0.1}
            particleBaseSize={80}
            moveParticlesOnHover
            alphaParticles={true}
            disableRotation={false}
            pixelRatio={1}
          />
        </div>

        {/* Core Features Loop */}
        <div className="py-16 relative z-10 overflow-hidden">
          <div className="container mx-auto px-4 mb-10 text-center">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Our Core FACILITIES & Services</h3>
          </div>
          <LogoLoop
            logos={featureLogos}
            speed={40}
            direction="left"
            logoHeight={100}
            gap={160}
            scaleOnHover
            fadeOut
            fadeOutColor="#fafafa"
          />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default LoginPage;