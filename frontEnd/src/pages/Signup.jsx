import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  // 💡 This holds any success or error messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      // Optionally, auto-login after signup

      // ✅ show success message before navigating
      setMessage("Signup successful! Redirecting...");
      const loginRes = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      login(loginRes.data.user, loginRes.data.token);
      // small delay so user sees the message
      setTimeout(() => navigate("/dashboard"), 1500);
      
    } catch (err) {
      console.error(err.response?.data || err.message);
      // ❌ show error message from backend or default
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded"
          onChange={handleChange}
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Sign Up
        </button>
        {/* 💬 Message feedback area */}
        {message && (
          <p className="text-green-600 text-center mt-4 font-semibold">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 text-center mt-4 font-semibold">{error}</p>
        )}
      </form>
    </div>
  );
};

export default Signup;
