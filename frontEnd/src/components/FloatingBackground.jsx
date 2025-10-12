// components/FloatingBackground.jsx
import { useEffect, useState } from "react";

const FloatingBackground = () => {
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    // Create random floating shapes
    const newShapes = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      color: `rgba(${Math.random() * 100 + 155}, ${
        Math.random() * 100 + 155
      }, ${Math.random() * 100 + 155}, 0.1)`,
    }));
    setShapes(newShapes);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            backgroundColor: shape.color,
            animation: `float ${shape.duration}s ease-in-out ${shape.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingBackground;
