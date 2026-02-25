import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { GraduationCap, ShieldCheck, UtensilsCrossed, ArrowRight } from "lucide-react";
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (selectedRole === "student" && !email.endsWith("@aurora.edu.in")) {
            setError("Student email must end with @aurora.edu.in");
            setIsLoading(false);
            return;
        }

        if (!password) {
            setError("Please enter your password");
            setIsLoading(false);
            return;
        }

        try {
            // The AuthContext login function signature is: (email, password) -> Promise<{ error }>
            // It does NOT take the role as an argument.
            const { error: loginError } = await login(email, password);

            if (loginError) {
                setError(loginError.message);
                setIsLoading(false);
            } else {
                // Login successful. 
                // The App component watches auth state and will redirect automatically.
                // We leave isLoading=true to prevent valid re-submission during redirect.
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left - Hero */}
            <div
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12 bg-cover bg-center"
                style={{ backgroundImage: "url('/hero-bg.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/60" />
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-primary-foreground max-w-lg"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <img
                            src="/aurora-logo.png"
                            alt="Aurora Hostel Logo"
                            className="w-16 h-16 object-contain"
                        />
                        <h1 className="text-4xl font-bold font-display tracking-tight text-white">AURORA HOSTEL</h1>
                    </div>
                    <span className="text-2xl font-bold font-display">AURORA HOSTEL</span>

                    <h1 className="text-5xl font-bold font-display leading-tight mb-6">
                        Aurora Hostel & Mess Management
                    </h1>
                    <p className="text-lg text-primary-foreground/70 leading-relaxed">
                        Streamline hostel operations, manage mess services, and enhance student living experience — all in one platform.
                    </p>
                    <div className="mt-10 grid grid-cols-3 gap-6">
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
            </div >

            {/* Right - Login form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <img
                            src="/aurora-logo.png"
                            alt="Aurora Hostel Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <span className="text-xl font-bold font-display">AURORA HOSTEL</span>
                    </div>

                    <h2 className="text-3xl font-bold font-display mb-2">Sign In</h2>
                    <p className="text-muted-foreground mb-8">Select your role and enter credentials</p>

                    {/* Role selector */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {roles.map(({ role, label, icon: Icon, desc }) => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                type="button"
                                className={`p-4 rounded-xl border-2 transition-all text-left ${selectedRole === role
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-muted-foreground/30"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mb-2 ${selectedRole === role ? "text-primary" : "text-muted-foreground"}`} />
                                <p className="text-sm font-semibold">{label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{desc}</p>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="student@aurora.edu.in"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1.5"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1.5"
                                disabled={isLoading}
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign In"} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </form>

                    <p className="text-xs text-muted-foreground text-center mt-6">
                        Demo: Select a role and click Sign In (no credentials required)
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
