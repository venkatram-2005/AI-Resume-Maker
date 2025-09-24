import { FaEye, FaEdit, FaTrashAlt, FaSpinner } from "react-icons/fa";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import resumeCardImg from "@/assets/resume-card.png";

const gradients = [
  "from-blue-700 via-indigo-800 to-purple-800",
  "from-cyan-700 via-blue-800 to-indigo-900",
  "from-teal-700 via-cyan-800 to-blue-900",
  "from-indigo-700 via-purple-800 to-pink-900",
  "from-blue-800 via-sky-900 to-teal-800",
];

const getRandomGradient = () => gradients[Math.floor(Math.random() * gradients.length)];

function ResumeCard({ resume, refreshData }) {
  const [loading, setLoading] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const gradient = getRandomGradient();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteThisResume(resume._id);
    } catch (error) {
      toast(error.message);
    } finally {
      setLoading(false);
      setOpenAlert(false);
      refreshData();
    }
  };

  return (
    <div
      className={`p-5 bg-gradient-to-r ${gradient} h-[380px] sm:h-auto rounded-lg flex flex-col justify-between shadow-lg transition duration-300 ease-in-out cursor-pointer hover:shadow-xl`}
    >
      {/* Title with white background */}
      <div className="flex items-center justify-center p-4 bg-white rounded-t-lg shadow-md">
        <h2
          className={`text-center font-bold text-md mx-2 bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}
        >
          {resume.title}
        </h2>
      </div>

      {/* Centered Image */}
      <div className="flex justify-center items-center flex-1 my-4">
        <img
          src={resumeCardImg}
          alt="Resume Card"
          className="max-h-48 object-contain"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around p-4 bg-white rounded-b-lg shadow-md">
        <Button
          variant="ghost"
          onClick={() => navigate(`/dashboard/view-resume/${resume._id}`)}
          className="mx-2"
        >
          <FaEye className="text-gray-600 hover:text-indigo-600 transition duration-300 ease-in-out" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate(`/dashboard/edit-resume/${resume._id}`)}
          className="mx-2"
        >
          <FaEdit className="text-gray-600 hover:text-purple-600 transition duration-300 ease-in-out" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setOpenAlert(true)}
          className="mx-2"
        >
          <FaTrashAlt className="text-gray-600 hover:text-pink-600 transition duration-300 ease-in-out" />
        </Button>
        <AlertDialog open={openAlert} onClose={() => setOpenAlert(false)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                Resume and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAlert(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={loading}>
                {loading ? <FaSpinner className="animate-spin" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ResumeCard;
