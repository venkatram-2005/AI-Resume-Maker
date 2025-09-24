import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Trash2, Sparkles } from "lucide-react";
import RichTextEditor from "@/components/custom/RichTextEditor";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";
import { AIChatSession } from "@/Services/AiModel";

const formFields = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  currentlyWorking: "",
  workSummary: "",
};

function Experience({ resumeInfo, enanbledNext, enanbledPrev }) {
  const [experienceList, setExperienceList] = React.useState(
    resumeInfo?.experience || []
  );
  const [loading, setLoading] = React.useState(false); // save button loading
  const [aiLoading, setAiLoading] = React.useState({}); // track AI loading per experience index
  const [aiSuggestions, setAiSuggestions] = React.useState({});
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, experience: experienceList }));
  }, [experienceList]);

  const addExperience = () => {
    setExperienceList([...experienceList, formFields]);
  };

  const removeExperience = (index) => {
    setExperienceList(experienceList.filter((_, i) => i !== index));
  };

  const handleChange = (e, index) => {
    enanbledNext(false);
    enanbledPrev(false);
    const { name, value } = e.target;
    const list = [...experienceList];
    list[index] = { ...list[index], [name]: value };
    setExperienceList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...experienceList];
    list[index] = { ...list[index], [name]: value };
    setExperienceList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = { data: { experience: experienceList } };
    if (resume_id) {
      updateThisResume(resume_id, data)
        .then(() => toast("Resume Updated", "success"))
        .catch((error) => toast("Error updating resume", `${error.message}`))
        .finally(() => {
          enanbledNext(true);
          enanbledPrev(true);
          setLoading(false);
        });
    }
  };

  const RewriteWorkSummaryWithAI = async (summary, index) => {
    if (!summary || !summary.trim()) {
      toast("Please enter work summary to rewrite");
      return;
    }

    setAiLoading((prev) => ({ ...prev, [index]: true })); // mark specific index as loading

    const PROMPT = `Please rewrite/enhance the following work experience summary in 3 different ways, keeping it clear, concise, and professional. Return output as a JSON array with each object containing a "workSummary" field.

Original Work Summary: "${summary}"`;

    try {
      const result = await AIChatSession.sendMessage(PROMPT);
      const suggestions = JSON.parse(result.response.text());
      setAiSuggestions((prev) => ({ ...prev, [index]: suggestions }));
      toast("Work summary rewritten by AI", "success");
    } catch (error) {
      console.error(error);
      toast("Error rewriting work summary", `${error.message}`);
    } finally {
      setAiLoading((prev) => ({ ...prev, [index]: false })); // reset loading
    }
  };

  const applySuggestion = (suggestion, index) => {
    handleRichTextEditor(suggestion, "workSummary", index);
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Experience</h2>
        <p>Add Your Previous Job Experience</p>

        {experienceList?.map((experience, index) => (
          <div key={index}>
            <div className="flex justify-between my-2">
              <h3 className="font-bold text-lg">Experience {index + 1}</h3>
              <Button
                variant="outline"
                className="text-red-500"
                onClick={() => removeExperience(index)}
              >
                <Trash2 />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div>
                <label className="text-xs">Position Title</label>
                <Input
                  type="text"
                  name="title"
                  value={experience?.title}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div>
                <label className="text-xs">Company Name</label>
                <Input
                  type="text"
                  name="companyName"
                  value={experience?.companyName}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div>
                <label className="text-xs">City</label>
                <Input
                  type="text"
                  name="city"
                  value={experience?.city}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div>
                <label className="text-xs">State</label>
                <Input
                  type="text"
                  name="state"
                  value={experience?.state}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div>
                <label className="text-xs">Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  value={experience?.startDate}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div>
                <label className="text-xs">End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  value={experience?.endDate}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>

              <div className="col-span-2">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs">Work Summary</label>
                  <Button
                    variant="outline"
                    onClick={() =>
                      RewriteWorkSummaryWithAI(experience.workSummary, index)
                    }
                    type="button"
                    size="sm"
                    disabled={aiLoading[index]}
                    className="border-primary text-primary flex gap-2"
                  >
                    {aiLoading[index] ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Rewrite with AI
                      </>
                    )}
                  </Button>
                </div>
                <RichTextEditor
                  index={index}
                  value={experience.workSummary}
                  onRichTextEditorChange={(event) =>
                    handleRichTextEditor(event, "workSummary", index)
                  }
                  resumeInfo={resumeInfo}
                />
              </div>
            </div>

            {/* AI Suggestions */}
            {aiSuggestions[index]?.length > 0 && (
              <div className="my-3">
                <h4 className="font-bold">AI Suggestions</h4>
                {aiSuggestions[index].map((item, sIndex) => (
                  <div
                    key={sIndex}
                    onClick={() => applySuggestion(item.workSummary, index)}
                    className="p-3 my-2 shadow rounded-lg cursor-pointer hover:bg-gray-100 transition"
                  >
                    <p>{item.workSummary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-between py-2">
          <Button
            onClick={addExperience}
            variant="outline"
            className="text-primary"
          >
            + Add {resumeInfo?.experience?.length > 0 ? "more" : null} Experience
          </Button>
          <Button onClick={onSave}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Experience;
