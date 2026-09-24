import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { workerAuth } from "../../../lib/api";
import logo from "../../../assets/GoodToBuy Logo.png";

export default function FieldLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await workerAuth.login(email, password);
      localStorage.setItem("worker_token", response.token);
      localStorage.setItem("worker_user", JSON.stringify(response.worker));
      navigate("/field");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#004274] via-[#003366] to-[#001a33] p-4">
      <Card className="w-full max-w-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-white">
          <CardHeader className="space-y-4 pt-8 pb-4 text-center px-6">
            <div className="flex justify-center">
              <img src={logo} alt="GoodToBuy Logo" className="h-14 w-auto object-contain" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-[#004274]">Field Worker Login</CardTitle>
              <CardDescription className="text-gray-500 text-sm">
                Sign in to submit property leads
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-8 pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-[#004274]">Email</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="worker@goodtobuy.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-lg"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-[#004274]">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 rounded-lg"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#00AEEF] to-[#0096d1] hover:from-[#0096d1] hover:to-[#007bb8] text-white font-semibold rounded-lg shadow-lg shadow-[#00AEEF]/30 mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
