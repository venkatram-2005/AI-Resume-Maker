import React, { useEffect, useState } from "react";
import logo from "/logo.svg";
import jobsphere from "/jobsphere.png";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function Header({ user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("Printing From Header User Found");
    } else {
      console.log("Printing From Header User Not Found");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.statusCode === 200) {
        dispatch(addUserData(""));
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const baseUrl = "https://job-sphere-evolved.vercel.app";

  const navLinks = [
    { label: "Explore Jobs", href: "/" },
    { label: "Create Resume", href: "/resume/create-resume" },
    { label: "Resume Analyzer", href: "/resume/analyzer" },
    { label: "Past Experiences", href: "/resume/experiences" },
  ];

  return (
    <div className="flex justify-between px-6 md:px-10 py-5 shadow-md items-center">
      <img src={jobsphere} alt="logo" className="w-35 h-9 cursor-pointer" />

      {/* Desktop Menu */}
      <div className="hidden md:flex justify-center">
        <ul className="list-none flex gap-6">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                to={link.href}
                className="text-black hover:text-gray-500 transition duration-300"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-black focus:outline-none"
        >
          {mobileMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-md md:hidden z-50">
          <ul className="flex flex-col gap-4 p-4">
            {navLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="text-black hover:text-gray-500 transition duration-300 block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Auth Buttons */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <Button
              variant="outline"
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full sm:mr-3"
              onClick={() => (window.location.href = `${baseUrl}/dashboard`)}
            >
              Dashboard
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full sm:mr-3 hover:bg-red-600 hover:text-white"
            >
              Logout
            </Button>
          </>
        ) : (
          <a href={`${baseUrl}/auth/sign-in`}>
            <Button>Get Started</Button>
          </a>
        )}
      </div>
    </div>
  );
}

export default Header;
