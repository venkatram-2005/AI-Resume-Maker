import React, { useState } from "react";
import { Sparkles, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AIChatSession } from "@/Services/AiModel";
import { updateThisResume } from "@/Services/resumeAPI";

function Summary({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const { resume_id } = useParams();

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(resumeInfo?.summary || "");
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([]);

  const handleInputChange = (e) => {
    enanbledNext(false);
    enanbledPrev(false);
    const value = e.target.value;
    dispatch(addResumeData({ ...resumeInfo, [e.target.name]: value }));
    setSummary(value);
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!summary.trim()) {
      toast("Please enter a summary before saving");
      return;
    }

    setLoading(true);
    try {
      const data = { data: { summary } };
      if (resume_id) {
        await updateThisResume(resume_id, data);
        toast("Resume Updated", "success");
      }
    } catch (error) {
      console.error(error);
      toast("Error updating resume", `${error.message}`);
    } finally {
      enanbledNext(true);
      enanbledPrev(true);
      setLoading(false);
    }
  };

  const setSummery = (newSummary) => {
    dispatch(addResumeData({ ...resumeInfo, summary: newSummary }));
    setSummary(newSummary);
  };

  const RewriteSummaryWithAI = async () => {
    if (!summary.trim()) {
      toast("Please enter a summary to rewrite");
      return;
    }

    setLoading(true);
    const PROMPT = `Please rewrite the following career objective in 3 different ways, making each version clear, concise, and engaging. Return output as a JSON array with each object containing a "summary" field.

Original Objective: "${summary}"`;

    try {
      const result = await AIChatSession.sendMessage(PROMPT);
      const rewrittenList = JSON.parse(result.response.text());
      setAiGenerateSummeryList(rewrittenList);
      toast("Summary rewritten by AI", "success");
    } catch (error) {
      console.error(error);
      toast("Error rewriting summary", `${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add or rewrite objective for your resume</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Objective</label>
            <Button
              variant="outline"
              onClick={RewriteSummaryWithAI}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
            >
              <Sparkles className="h-4 w-4" /> Rewrite with AI
            </Button>
          </div>

          <Textarea
            name="summary"
            className="mt-5"
            required
            value={summary}
            onChange={handleInputChange}
          />

          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummeryList?.length > 0 && (
        <div className="my-5">
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aiGeneratedSummeryList.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                enanbledNext(false);
                enanbledPrev(false);
                setSummery(item?.summary);
              }}
              className="p-5 shadow-lg my-4 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <p>{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summary;
