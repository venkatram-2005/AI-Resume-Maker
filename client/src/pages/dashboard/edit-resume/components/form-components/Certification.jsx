import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";

const formFields = {
  certificateName: "",
  issuedBy: "",
};

function Certification({ resumeInfo, setEnabledNext, setEnabledPrev }) {
  const [certificationList, setCertificationList] = useState(
    resumeInfo?.certifications || []
  );
  const [loading, setLoading] = useState(false);
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, certifications: certificationList }));
  }, [certificationList]);

  const addCertification = () => {
    setCertificationList([...certificationList, formFields]);
  };

  const removeCertification = (index) => {
    const list = [...certificationList];
    const newList = list.filter((item, i) => i !== index);
    setCertificationList(newList);
  };

  const handleChange = (e, index) => {
    setEnabledNext(false);
    setEnabledPrev(false);
    const { name, value } = e.target;
    const list = [...certificationList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setCertificationList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        certifications: certificationList,
      },
    };
    if (resume_id) {
      console.log("Started Updating Certification");
      updateThisResume(resume_id, data)
        .then((data) => {
          toast("Resume Updated", { type: "success" });
        })
        .catch((error) => {
          toast("Error updating resume", { type: "error", description: error.message });
        })
        .finally(() => {
          setEnabledNext(true);
          setEnabledPrev(true);
          setLoading(false);
        });
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Certifications</h2>
      <p>Add your certifications</p>
      <div>
        {certificationList?.map((cert, index) => (
          <div key={index}>
            <div className="flex justify-between my-2">
              <h3 className="font-bold text-lg">Certification {index + 1}</h3>
              <Button
                variant="outline"
                className="text-red-500"
                onClick={() => removeCertification(index)}
              >
                <Trash2 />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div>
                <label className="text-xs">Certificate Name</label>
                <Input
                  type="text"
                  name="certificateName"
                  value={cert?.certificateName}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div>
                <label className="text-xs">Issued By</label>
                <Input
                  type="text"
                  name="issuedBy"
                  value={cert?.issuedBy}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between py-2">
        <Button
          onClick={addCertification}
          variant="outline"
          className="text-primary"
        >
          + Add {resumeInfo?.certifications?.length > 0 ? "more" : null} certification
        </Button>
        <Button onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Certification;
