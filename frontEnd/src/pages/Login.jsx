import { useState, useContext, useEffect } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Track mouse for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setTrail((prev) => [
        { x: e.clientX, y: e.clientY, id: Date.now() },
        ...prev.slice(0, 10),
      ]);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await API.post("/auth/login", form);
      const decoded = jwtDecode(res.data.token);
      login(decoded, res.data.token);

      setMessage("✅ Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError("❌ Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 relative overflow-hidden cursor-none">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full animate-pulse-slow delay-1000"></div>

        {/* Moving gradient that follows cursor */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, #00ff88 0%, #0088ff 50%, #8800ff 100%)`,
            transition: "background 0.1s ease-out",
          }}
        ></div>

        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-float-fast"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`,
            }}
          />
        ))}
      </div>

      {/* Custom Cursor */}
      <div
        className="fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
        }}
      >
        <div className="w-full h-full bg-white rounded-full animate-ping absolute"></div>
        <div className="w-full h-full border-2 border-white rounded-full"></div>
      </div>

      {/* Cursor Trail */}
      {trail.map((pos, index) => (
        <div
          key={pos.id}
          className="fixed w-2 h-2 bg-green-400 rounded-full pointer-events-none z-40 mix-blend-screen"
          style={{
            left: pos.x - 4,
            top: pos.y - 4,
            opacity: (trail.length - index) / trail.length,
            transform: `scale(${0.5 + (index / trail.length) * 0.5})`,
          }}
        />
      ))}

      <div className="min-h-screen flex items-center justify-center relative z-10">
        {/* Login Form Card */}
        <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl w-full max-w-md mx-4 relative overflow-hidden">
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-50 animate-border-pulse"></div>
          <div className="absolute inset-[2px] rounded-3xl bg-black/80 backdrop-blur-xl"></div>

          <div className="relative z-10">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300 mb-2 text-center">
              WELCOME BACK
            </h2>
            <p className="text-gray-300 text-center mb-8">
              Sign in to your account
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="📧 Enter your email"
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="🔒 Enter your password"
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 rounded-xl font-bold border-2 border-white/20 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-glow active:scale-95"
                >
                  🔑 SIGN IN
                </button>
              </div>
            </form>

            {/* Messages */}
            {message && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm">
                <p className="text-green-300 text-center font-semibold">
                  {message}
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
                <p className="text-red-300 text-center font-semibold">
                  {error}
                </p>
              </div>
            )}

            {/* Signup Link */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-gray-400 text-center">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-green-300 hover:text-green-200 font-semibold hover:underline transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed bottom-8 left-8 flex flex-col gap-4 z-20">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-2xl shadow-2xl animate-bounce cursor-pointer hover:scale-110 transition-transform">
          🔑
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-2xl shadow-2xl animate-bounce delay-200 cursor-pointer hover:scale-110 transition-transform">
          🚀
        </div>
      </div>
    </div>
  );
};

export default Login;
