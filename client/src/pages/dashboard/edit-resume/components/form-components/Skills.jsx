import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

const emptyCategory = { name: "", skills: "" };

function Skills({ resumeInfo, setEnabledNext }) {
  const [skillsList, setSkillsList] = useState(resumeInfo?.skills || [emptyCategory]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { resume_id } = useParams();

  // Sync state to redux
  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, skills: skillsList }));
  }, [skillsList]);

  const handleChange = (index, key, value) => {
    const list = [...skillsList];
    list[index] = { ...list[index], [key]: value };
    setSkillsList(list);
    setEnabledNext(false);
  };

  const addCategory = () => setSkillsList([...skillsList, emptyCategory]);
  const removeCategory = (index) => setSkillsList(skillsList.filter((_, i) => i !== index));

  const onSave = () => {
    setLoading(true);
    const data = { data: { skills: skillsList } };
    if (resume_id) {
      updateThisResume(resume_id, data)
        .then(() => toast("Resume Updated", { type: "success" }))
        .catch((error) => toast("Error updating resume", { type: "error", description: error.message }))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add your skill categories and skills (comma-separated)</p>

      {skillsList.map((category, index) => (
        <div key={index} className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
          <div>
            <label className="text-xs">Category</label>
            <Input
              type="text"
              value={category.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs">Skills</label>
            <Input
              type="text"
              placeholder="React, Node.js, Git"
              value={category.skills}
              onChange={(e) => handleChange(index, "skills", e.target.value)}
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <Button variant="outline" className="text-red-500" onClick={() => removeCategory(index)}>
              Remove
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-between">
        <Button variant="outline" className="text-primary" onClick={addCategory}>
          + Add Category
        </Button>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Skills;
