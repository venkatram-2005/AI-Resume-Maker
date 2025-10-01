import React, { useEffect, useState } from "react";
import jobsphere from "/jobsphere.png";
import { Button } from "../ui/button";
import { Link, useNavigate  } from "react-router-dom";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";
import { useDispatch } from "react-redux";

function Header({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      if (response.statusCode == 200) {
        dispatch(addUserData(""));
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex justify-between px-6 md:px-10 py-5 shadow-md items-center">
      <img 
        src={jobsphere} 
        onClick={() => window.open("https://job-sphere-evolved.vercel.app/", "_top")}
        alt="JobSphere Logo" 
        className="w-35 h-9 cursor-pointer" 
      />

      

      {/* Auth Buttons */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <Button
              variant="outline"
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full sm:mr-3"
              onClick={() => {
                navigate("/dashboard");
              }}
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
          <Link to="/auth/sign-in">
            <Button>Get Started</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
