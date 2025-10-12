import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Add this for logout redirect

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext); // Pull user & logout
  const navigate = useNavigate(); // For redirect after logout

  console.log(user); // Keep for debugging — remove in production

  if (!user) {
    // Optional: Redirect if user is null (though ProtectedRoute should handle this)
    return null; // Or show a loading spinner
  }

  const handleLogout = () => {
    logout(); // Clears state & localStorage
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-600">Dashboard</h1>
        <p className="text-gray-700 text-lg">
          Welcome,{" "}
          <span className="font-semibold">{user.email || "Guest"}</span> 👋
        </p>
        <p className="text-gray-500 mt-2">
          Your role: {user.role || "unknown"}
        </p>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
