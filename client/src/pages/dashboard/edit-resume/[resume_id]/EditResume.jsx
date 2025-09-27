import React, { useEffect, useState } from "react";
import ResumeForm from "../components/ResumeForm";
import PreviewPage from "../components/PreviewPage";
import { useParams } from "react-router-dom";
import { getResumeData } from "@/Services/resumeAPI";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";

export function EditResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    getResumeData(resume_id).then((data) => {
      dispatch(addResumeData(data.data));
    });

    // detect screen size
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    handleResize(); // check initially
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [resume_id, dispatch]);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-center px-6">
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Desktop Recommended
          </h2>
          <p className="text-gray-600 text-sm">
            For the best experience while editing your resume, please use a
            desktop or a larger screen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-6 md:p-10 gap-6 md:gap-10">
      <ResumeForm />
      <PreviewPage />
    </div>
  );
}

export default EditResume;
