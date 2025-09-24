import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, LoaderCircle, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import SimpeRichTextEditor from "@/components/custom/SimpeRichTextEditor";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";
import { AIChatSession } from "@/Services/AiModel";

const formFields = {
  projectName: "",
  techStack: "",
  projectSummary: "",
};

function Project({ resumeInfo, setEnabledNext, setEnabledPrev }) {
  const [projectList, setProjectList] = useState(resumeInfo?.projects || []);
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState({});
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, projects: projectList }));
  }, [projectList]);

  const addProject = () => setProjectList([...projectList, formFields]);

  const removeProject = (index) =>
    setProjectList(projectList.filter((_, i) => i !== index));

  const handleChange = (e, index) => {
    setEnabledNext(false);
    setEnabledPrev(false);
    const { name, value } = e.target;
    const list = [...projectList];
    list[index] = { ...list[index], [name]: value };
    setProjectList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...projectList];
    list[index] = { ...list[index], [name]: value };
    setProjectList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = { data: { projects: projectList } };
    if (resume_id) {
      updateThisResume(resume_id, data)
        .then(() => toast("Resume Updated", "success"))
        .catch((error) => toast("Error updating resume", `${error.message}`))
        .finally(() => {
          setEnabledNext(true);
          setEnabledPrev(true);
          setLoading(false);
        });
    }
  };

  const RewriteProjectSummaryWithAI = async (summary, index) => {
    if (!summary || !summary.trim()) {
      toast("Please enter a project summary to rewrite");
      return;
    }

    setLoading(true);
    const PROMPT = `Please rewrite/enhance the following project summary in 3 different ways, keeping it clear, concise, and professional. Return output as a JSON array with each object containing a "summary" field.

Original Project Summary: "${summary}"`;

    try {
      const result = await AIChatSession.sendMessage(PROMPT);
      const suggestions = JSON.parse(result.response.text());
      setAiSuggestions((prev) => ({ ...prev, [index]: suggestions }));
      toast("Project summary rewritten by AI", "success");
    } catch (error) {
      console.error(error);
      toast("Error rewriting project summary", `${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = (suggestion, projectIndex) => {
    handleRichTextEditor(suggestion, "projectSummary", projectIndex);
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Projects</h2>
      <p>Add your projects</p>

      {projectList?.map((project, index) => (
        <div key={index}>
          <div className="flex justify-between my-2">
            <h3 className="font-bold text-lg">Project {index + 1}</h3>
            <Button
              variant="outline"
              className="text-red-500"
              onClick={() => removeProject(index)}
            >
              <Trash2 />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
            <div>
              <label className="text-xs">Project Name</label>
              <Input
                type="text"
                name="projectName"
                value={project.projectName}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div>
              <label className="text-xs">Tech Stack / Company</label>
              <Input
                type="text"
                name="techStack"
                placeholder="React, Node.js, Express, MongoDB"
                value={project.techStack}
                onChange={(e) => handleChange(e, index)}
              />
            </div>

            <div className="col-span-2">
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs">Project Summary</label>
                <Button
                  variant="outline"
                  onClick={() =>
                    RewriteProjectSummaryWithAI(project.projectSummary, index)
                  }
                  type="button"
                  size="sm"
                  className="border-primary text-primary flex gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Rewrite with AI
                    </>
                  )}
                </Button>
              </div>
              <SimpeRichTextEditor
                index={index}
                value={project.projectSummary} // controlled editor
                onRichTextEditorChange={(event) =>
                  handleRichTextEditor(event, "projectSummary", index)
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
                  onClick={() => applySuggestion(item.summary, index)}
                  className="p-3 my-2 shadow rounded-lg cursor-pointer hover:bg-gray-100 transition"
                >
                  <p>{item.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-between py-2">
        <Button
          onClick={addProject}
          variant="outline"
          className="text-primary"
        >
          + Add {resumeInfo?.projects?.length > 0 ? "more" : null} project
        </Button>
        <Button onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Project;
