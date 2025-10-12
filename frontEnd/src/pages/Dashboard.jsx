// pages/Dashboard.jsx
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import TodoList from "../components/TodoList";
import AdminTodoList from "../components/AdminTodoList";
import AdminUserList from "../components/AdminUserList";
import getNameFromEmail from "../utils/getNameFromEmail";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("my-todos");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const canvasRef = useRef(null);

  const isAdmin = user?.role === "admin";
  const displayName = user ? getNameFromEmail(user.email) : "Guest";

  // Cursor trail logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setTrail((prev) => [
        { x: e.clientX, y: e.clientY, id: Date.now() },
        ...prev.slice(0, 15),
      ]);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Particle background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        this.life = 100;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        const dx = mousePosition.x - this.x;
        const dy = mousePosition.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150) {
          this.speedX += dx * 0.01;
          this.speedY += dy * 0.01;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / 100;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const animate = () => {
      ctx.fillStyle = "rgba(10, 10, 40, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.3) {
        particles.push(new Particle(mousePosition.x, mousePosition.y));
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }

      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 relative overflow-hidden cursor-none">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Cursor visuals */}
      <div
        className="fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="w-full h-full bg-white rounded-full animate-ping absolute"></div>
        <div className="w-full h-full border-2 border-white rounded-full"></div>
      </div>

      {/* Trail */}
      {trail.map((pos, index) => (
        <div
          key={pos.id}
          className="fixed w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-40 mix-blend-screen"
          style={{
            left: pos.x - 4,
            top: pos.y - 4,
            opacity: (trail.length - index) / trail.length,
            transform: `scale(${0.5 + (index / trail.length) * 0.5})`,
            transition: "all 0.1s ease-out",
          }}
        />
      ))}

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <MagneticOrb key={i} mousePosition={mousePosition} index={i} />
        ))}
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <MagneticElement mousePosition={mousePosition} strength={0.03}>
          <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-8 mb-8 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-200 to-purple-300 mb-4 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                    DASHBOARD
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <p className="text-cyan-100 text-xl font-bold drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
                      👋 Welcome,{" "}
                      <span className="text-teal-300 font-extrabold">
                        {displayName}
                      </span>
                    </p>
                    {isAdmin && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-bold border-2 border-white/50 animate-pulse shadow-lg">
                        ⚡ ADMIN POWER
                      </span>
                    )}
                  </div>
                  <p className="text-purple-200 mt-2 text-lg font-medium">
                    📧 {user?.email}
                  </p>
                </div>

                <MagneticElement mousePosition={mousePosition} strength={0.1}>
                  <button
                    onClick={logout}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold border-2 border-white/20 shadow-2xl transition-all duration-300 hover:shadow-glow-red hover:scale-110"
                  >
                    🚪 LOGOUT
                  </button>
                </MagneticElement>
              </div>

              <div className="mt-8">
                <nav className="flex space-x-4 bg-black/40 backdrop-blur-lg rounded-2xl p-2 border border-cyan-500/20">
                  <MagneticTab
                    active={activeTab === "my-todos"}
                    onClick={() => setActiveTab("my-todos")}
                    mousePosition={mousePosition}
                    color="from-cyan-500 to-blue-500"
                  >
                    🎯 MY TODOS
                  </MagneticTab>

                  {isAdmin && (
                    <>
                      <MagneticTab
                        active={activeTab === "all-todos"}
                        onClick={() => setActiveTab("all-todos")}
                        mousePosition={mousePosition}
                        color="from-purple-500 to-pink-500"
                      >
                        🌟 ALL TODOS
                      </MagneticTab>
                      <MagneticTab
                        active={activeTab === "all-users"}
                        onClick={() => setActiveTab("all-users")}
                        mousePosition={mousePosition}
                        color="from-green-400 to-cyan-400"
                      >
                        👑 ALL USERS
                      </MagneticTab>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </MagneticElement>

        <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-8 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 text-cyan-100">
            {activeTab === "my-todos" && <TodoList />}
            {activeTab === "all-todos" && isAdmin && <AdminTodoList />}
            {activeTab === "all-users" && isAdmin && <AdminUserList />}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-indigo-300 text-sm font-medium drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
            ⚡ BUILT WITH REACT & NODE.JS • {new Date().getFullYear()} ⚡
          </p>
        </div>
      </div>

      <InteractiveFloaters mousePosition={mousePosition} />
    </div>
  );
};

/* --- Utility Components --- */

// Magnetic Orb
const MagneticOrb = ({ mousePosition, index }) => {
  const [position, setPosition] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100,
  });

  useEffect(() => {
    const dx = mousePosition.x - (window.innerWidth * position.x) / 100;
    const dy = mousePosition.y - (window.innerHeight * position.y) / 100;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 200) {
      const force = (200 - distance) / 200;
      setPosition((prev) => ({
        x: prev.x - dx * force * 0.01,
        y: prev.y - dy * force * 0.01,
      }));
    }
  }, [mousePosition]);

  return (
    <div
      className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400/30 to-purple-400/30 blur-sm animate-pulse"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        animationDelay: `${index * 0.2}s`,
      }}
    />
  );
};

// Magnetic Element
const MagneticElement = ({ children, mousePosition, strength = 0.05 }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = mousePosition.x - centerX;
    const dy = mousePosition.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 300) {
      const force = (300 - distance) / 300;
      setPosition({
        x: dx * force * strength,
        y: dy * force * strength,
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  }, [mousePosition, strength]);

  return (
    <div
      ref={ref}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.3s ease-out",
      }}
    >
      {children}
    </div>
  );
};

// Magnetic Tab
const MagneticTab = ({ active, onClick, children, mousePosition, color }) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-500 transform ${
        active
          ? `bg-gradient-to-r ${color} text-white font-extrabold shadow-2xl scale-105`
          : "text-cyan-100 hover:text-white bg-white/5 hover:bg-white/10 border border-cyan-500/20 font-semibold"
      } ${hover ? "scale-105" : "scale-100"}`}
      style={{
        transform: hover ? "scale(1.05)" : "scale(1)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </button>
  );
};

// Floating elements
const InteractiveFloaters = ({ mousePosition }) => {
  const floaters = [
    { emoji: "⚡", color: "from-yellow-400 to-orange-400" },
    { emoji: "🌟", color: "from-blue-400 to-cyan-400" },
    { emoji: "💫", color: "from-purple-400 to-pink-400" },
    { emoji: "🎯", color: "from-green-400 to-emerald-400" },
  ];

  return (
    <>
      {floaters.map((floater, index) => (
        <FloatingElement
          key={index}
          emoji={floater.emoji}
          color={floater.color}
          mousePosition={mousePosition}
          index={index}
        />
      ))}
    </>
  );
};

const FloatingElement = ({ emoji, color, mousePosition, index }) => {
  const [position, setPosition] = useState({
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
  });

  useEffect(() => {
    const dx = mousePosition.x - (window.innerWidth * position.x) / 100;
    const dy = mousePosition.y - (window.innerHeight * position.y) / 100;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 150) {
      const force = (150 - distance) / 150;
      setPosition((prev) => ({
        x: prev.x - dx * force * 0.02,
        y: prev.y - dy * force * 0.02,
      }));
    }
  }, [mousePosition]);

  return (
    <div
      className={`fixed w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center text-2xl shadow-2xl cursor-pointer z-30 transition-transform duration-300 hover:scale-125`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        animation: `float 3s ease-in-out ${index * 0.5}s infinite alternate`,
      }}
    >
      {emoji}
    </div>
  );
};

export default Dashboard;
