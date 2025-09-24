import React, { useEffect } from "react";
import logo from "/logo.svg";
import jobsphere from "/jobsphere.png";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";

function Header({user}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user){
      console.log("Printing From Header User Found");
    }
    else{
      console.log("Printing From Header User Not Found");
    }
  }, []);

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
    <div
      id="printHeader"
      className="flex justify-between px-10 py-5 shadow-md items-center"
    >
      <img src={jobsphere} alt="logo" className="w-35 h-9 cursor-pointer"  />
      {user ? (
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full sm:mr-3'
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Dashboard
          </Button>
          <Button 
            onClick={handleLogout}
            className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full sm:mr-3 hover:bg-red-600 hover:text-white'
            >Logout</Button>
        </div>
      ) : (
        <Link to="/auth/sign-in">
          <Button>Get Started</Button>
        </Link>
      )}
    </div>
  );
}

export default Header;
