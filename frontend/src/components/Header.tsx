import { useEffect, useState } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
// import your auth context or hook here
// import { useAuth } from "@/context/AuthContext";

export default function Navbar({ className }: { className?: string }) {
  const [scrolledEnough, setScrolledEnough] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          `${backendUrl}/api/data/me`,
          { withCredentials: true },
        );
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      if (scrollY > lastScrollY) {
        //direction down
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
      setScrolledEnough(scrollY > 10);
    };
    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, []);
  return (
    <nav
      className={cn(
        `fixed top-0 w-full z-50 p-4 text-white transition-all duration-500 ${
          scrolledEnough ? "bg-slate-800/50" : "bg-slate-900"
        } ${
          scrollDirection === "down"
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`,
        className,
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to={"/"} className="text-xl font-bold">
          TypeRight
        </Link>
        <div className="space-x-6">
          <Link className="hover:underline" to="/about">
            About Us
          </Link>
          {isAuthenticated ? (
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
