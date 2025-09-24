import React, { useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { AIChatSession } from "@/Services/AiModel";
import { toast } from "sonner";

const PROMPT = `Create a JSON object with the following fields:
"projectName": A string representing the project
"techStack": A string representing the project tech stack
"projectSummary": An array of strings, each representing a bullet point in html format describing relevant experience for the given project title and tech stack
projectName-"{projectName}"
techStack-"{techStack}"`;

function SimpeRichTextEditor({ index, value: propValue, onRichTextEditorChange, resumeInfo }) {
  const [value, setValue] = useState(propValue || "");
  const [loading, setLoading] = useState(false);

  // Sync parent prop changes to local state
  useEffect(() => {
    if (propValue !== value) {
      setValue(propValue || "");
    }
  }, [propValue]);

  // Notify parent whenever value changes
  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value]);

  const GenerateSummaryFromAI = async () => {
    const project = resumeInfo?.projects[index];
    if (!project?.projectName || !project?.techStack) {
      toast("Add Project Name and Tech Stack to generate summary");
      return;
    }
    setLoading(true);

    const prompt = PROMPT.replace("{projectName}", project.projectName).replace(
      "{techStack}",
      project.techStack
    );

    try {
      const result = await AIChatSession.sendMessage(prompt);
      const resp = JSON.parse(result.response.text());
      setValue(resp.projectSummary?.join("") || "");
    } catch (err) {
      console.error(err);
      toast("Error generating AI summary", `${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default SimpeRichTextEditor;
