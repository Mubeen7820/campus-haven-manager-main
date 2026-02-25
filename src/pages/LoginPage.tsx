import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Building2, GraduationCap, ShieldCheck, UtensilsCrossed, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const roles: { role: UserRole; label: string; icon: React.ElementType; desc: string }[] = [
  { role: "student", label: "Student", icon: GraduationCap, desc: "Access room, menu & payments" },
  { role: "admin", label: "Admin", icon: ShieldCheck, desc: "Manage hostel operations" },
  { role: "mess_staff", label: "Mess Staff", icon: UtensilsCrossed, desc: "Manage kitchen & food" },
];

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedRole === "student" && !email.endsWith("@aurora.edu.in")) {
      setError("Student email must end with @aurora.edu.in");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    // Password complexity check: Uppercase, Number, Symbol
    // Relaxed for development/demo ease
    /*
    if (!/(?=.*[A-Z])/.test(password) || !/(?=.*[0-9])/.test(password) || !/(?=.*[^A-Za-z0-9])/.test(password)) {
      setError("Password must contain at least one uppercase letter, one number, and one symbol");
      return;
    }
    */

    const { error: loginError } = await login(email, password);

    if (!loginError) {
      const paths: Record<UserRole, string> = { admin: "/admin", student: "/student", mess_staff: "/mess" };
      navigate(paths[selectedRole]);
    } else {
      setError(loginError.message || "Incorrect password");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center bg-cover bg-center relative p-8 lg:p-24"
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left - Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 text-primary-foreground text-center lg:text-left"
        >
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
            <img
              src="/aurora-logo.png"
              alt="Aurora's Hostel Logo"
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-4xl font-bold font-display tracking-tight text-white">AURORA'S HOSTEL</h1>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold font-display leading-tight mb-6">
            Aurora's Hostel & Mess Management
          </h1>
          <p className="text-lg text-primary-foreground/70 leading-relaxed mb-8">
            Streamline hostel operations, manage mess services, and enhance student living experience — all in one platform.
          </p>
          <div className="flex justify-center lg:justify-start gap-10">
            {[
              { num: "500+", label: "Students" },
              { num: "120", label: "Rooms" },
              { num: "3", label: "Mess Halls" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold font-display text-accent">{s.num}</p>
                <p className="text-sm text-primary-foreground/60">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right - Login form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-background/95 backdrop-blur-sm p-8 lg:p-10 rounded-2xl shadow-2xl border border-white/10"
        >
          <h2 className="text-3xl font-bold font-display mb-2">Sign In</h2>
          <p className="text-lg text-muted-foreground mb-8">Select your role and enter credentials</p>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {roles.map(({ role, label, icon: Icon, desc }) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${selectedRole === role
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
                  }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${selectedRole === role ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-base font-semibold">{label}</p>
                <p className="text-sm text-muted-foreground mt-0.5 hidden sm:block">{desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-xl">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@aurora.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 text-lg py-5 px-4"
              />
            </div>
            <div>
              <Label htmlFor="password" title="password" className="text-xl">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 text-lg py-5 px-4"
              />
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <Button type="submit" className="w-full text-xl py-7 shadow-lg shadow-primary/20" size="lg">
              Sign In <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-8">
            Demo: Select a role and click Sign In (no credentials required)
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;