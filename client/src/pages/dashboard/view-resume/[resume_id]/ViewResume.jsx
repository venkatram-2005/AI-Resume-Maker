import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getResumeData } from "@/Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { RWebShare } from "react-web-share";
import { toast } from "sonner";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = React.useState({});
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchResumeInfo();
  }, []);

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

      // fallback if clipboard fails
      const tempInput = document.createElement("input");
      tempInput.value = shareUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      toast("Link copied using fallback!");
    }
  };


  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div id="noPrint">
          <div className="my-10 mx-10 md:mx-20 lg:mx-36">
            <h2 className="text-center text-2xl font-medium">
              Congrats! Your Resume is ready. You are now one step closer to your dream job!
            </h2>
            <p className="text-center text-gray-400">
              Now you are ready to download your resume and you can share unique
              resume url with your friends and family
            </p>
            <div className="flex justify-between px-44 my-10">
              <Button onClick={HandleDownload}>Download</Button>

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
          className="bg-white rounded-lg p-8 print-area"
          style={{ width: "210mm", height: "297mm" }}
        >
          <div className="print">
            <ResumePreview />
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewResume;
