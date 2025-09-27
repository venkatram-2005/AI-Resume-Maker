import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getResumeData } from "@/Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { RWebShare } from "react-web-share";
import { toast } from "sonner";

function ViewResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchResumeInfo();

    // detect screen size
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // run on load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [resume_id]);

  const fetchResumeInfo = async () => {
    const response = await getResumeData(resume_id);
    dispatch(addResumeData(response.data));
  };

  const HandleDownload = () => {
    window.print();
  };

  // Helper: check if app is inside iframe
  const inIframe = window.self !== window.top;

  // Fallback share handler
  const handleCopyLink = async () => {
    const shareUrl = `${import.meta.env.VITE_BASE_URL}/dashboard/view-resume/${resume_id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast("Link copied to clipboard!");
    } catch (err) {
      console.error("Clipboard copy failed:", err);

      // fallback
      const tempInput = document.createElement("input");
      tempInput.value = shareUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      toast("Link copied using fallback!");
    }
  };

  // 🚨 If on mobile, block and show notice
  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-center px-6">
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Desktop Recommended
          </h2>
          <p className="text-gray-600 text-sm">
            For the best experience while viewing your resume, please use a
            desktop or a larger screen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div id="noPrint">
        <div className="my-10 mx-6 md:mx-20 lg:mx-36">
          <h2 className="text-center text-2xl font-medium">
            Congrats! Your Resume is ready. You are now one step closer to your dream job!
          </h2>
          <p className="text-center text-gray-400">
            Now you are ready to download your resume and share your unique resume link
            with friends and family.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-between my-10">
            <Button onClick={HandleDownload}>Download</Button>
            <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>

            {inIframe ? (
              <Button onClick={handleCopyLink}>Copy Link</Button>
            ) : (
              <RWebShare
                data={{
                  text: "Hello This is My resume",
                  url: `${import.meta.env.VITE_BASE_URL}/dashboard/view-resume/${resume_id}`,
                  title: "Flamingos",
                }}
                onClick={() => toast("Resume Shared Successfully")}
              >
                <Button>Share</Button>
              </RWebShare>
            )}
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-lg p-6 md:p-8 print-area"
        style={{ width: "210mm", height: "297mm" }}
      >
        <div className="print">
          <ResumePreview />
        </div>
      </div>
    </div>
  );
}

export default ViewResume;
