import { Link } from "react-router-dom";
import useAuth from "../utils/useAuth.jsx";

function Navbar() {
  const user = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-md">
      <div className="flex items-center justify-between">

        <Link to="/" className="text-xl font-bold tracking-wide">
          MiniCRM
        </Link>

        <div className="space-x-6 hidden md:flex">
          <Link to="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/customers" className="hover:text-gray-300">
            Customers
          </Link>
          <Link to="/segments" className="hover:text-gray-300">
            Segments
          </Link>
          <Link to="/campaigns" className="hover:text-gray-300">
            Campaigns
          </Link>
          <Link to="/ai" className="hover:text-gray-300">
            AI Tools
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border"
              />
              <span>{user.name}</span>
              <a
                href="https://crm-backend-gsa9.onrender.com/auth/logout"
                className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500 text-sm"
              >
                Logout
              </a>
            </>
          ) : (
            <a
              href="https://crm-backend-gsa9.onrender.com/auth/google"
              className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 text-sm"
            >
              Login with Google
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
