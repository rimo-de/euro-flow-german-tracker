
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, loading } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast({
          title: "Success!",
          description: "Account created successfully. Please check your email to verify your account.",
        });
      } else {
        await signIn(email, password);
        // Navigation will be handled by the AuthContext/App component
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error?.message || "An error occurred during authentication",
      });
    }
  };

  const handleDemoAccount = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsSignUp(false); // Ensure we're in sign-in mode
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-fade-in">
        Finance Tracker
      </h1>

      {/* Main Auth Form */}
      <div className="auth-card animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input pl-10"
                required
                disabled={loading}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-button hover-scale"
            disabled={loading}
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="auth-link hover-scale"
              disabled={loading}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
      
      {/* Demo Accounts Section */}
      <div className="auth-card animate-fade-in mt-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Demo Accounts for Testing
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Click "Use" to auto-fill credentials for quick testing
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div className="flex-1">
              <p className="font-medium text-gray-800">Admin Account</p>
              <p className="text-sm text-gray-600">admin@digital4pulse.edu</p>
              <p className="text-xs text-gray-500">Password: password123</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoAccount("admin@digital4pulse.edu", "password123")}
              className="hover-scale"
              disabled={loading}
            >
              Use
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div className="flex-1">
              <p className="font-medium text-gray-800">User Account</p>
              <p className="text-sm text-gray-600">user@digital4pulse.edu</p>
              <p className="text-xs text-gray-500">Password: password123</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoAccount("user@digital4pulse.edu", "password123")}
              className="hover-scale"
              disabled={loading}
            >
              Use
            </Button>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        © 2025 Finance Tracker. All rights reserved.
      </footer>
    </div>
  );
};

export default Auth;
