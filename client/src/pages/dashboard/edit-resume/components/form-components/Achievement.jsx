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
  achievement: "",
};

function Achievement({ resumeInfo, setEnabledNext, setEnabledPrev }) {
  const [achievementList, setAchievementList] = useState(resumeInfo?.achievements || []);
  const [loading, setLoading] = useState(false);
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, achievements: achievementList }));
  }, [achievementList]);

  const addAchievement = () => {
    setAchievementList([...achievementList, formFields]);
  };

  const removeAchievement = (index) => {
    const list = [...achievementList];
    const newList = list.filter((item, i) => i !== index);
    setAchievementList(newList);
  };

  const handleChange = (e, index) => {
    setEnabledNext(false);
    setEnabledPrev(false);
    const { value } = e.target;
    const list = [...achievementList];
    list[index] = { achievement: value };
    setAchievementList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        achievements: achievementList,
      },
    };
    if (resume_id) {
      console.log("Started Updating Achievements");
      updateThisResume(resume_id, data)
        .then(() => {
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
      <h2 className="font-bold text-lg">Achievements</h2>
      <p>Add your achievements</p>
      <div>
        {achievementList?.map((ach, index) => (
          <div key={index}>
            <div className="flex justify-between my-2">
              <h3 className="font-bold text-lg">Achievement {index + 1}</h3>
              <Button
                variant="outline"
                className="text-red-500"
                onClick={() => removeAchievement(index)}
              >
                <Trash2 />
              </Button>
            </div>
            <div className="border p-3 my-5 rounded-lg">
              <Input
                type="text"
                placeholder="Describe your achievement"
                value={ach?.achievement}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between py-2">
        <Button
          onClick={addAchievement}
          variant="outline"
          className="text-primary"
        >
          + Add {resumeInfo?.achievements?.length > 0 ? "more" : null} achievement
        </Button>
        <Button onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Achievement;
