import React from "react";

function SkillsPreview({ resumeInfo }) {
  if (!resumeInfo?.skills?.length) return null;

  return (
    <div className="my-6">
        <div>
          <h2 className="text-center font-bold text-sm mb-2" style={{ color: resumeInfo?.themeColor }}>
            Skills
          </h2>
          <hr className="border-[1.5px] my-2" style={{ borderColor: resumeInfo?.themeColor }} />
        </div>

      <div className="space-y-3 mt-4">
        {resumeInfo.skills.map((category, index) => (
          <div key={index} className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-black">{category.name}:</span>
            <span className="text-xs text-black">
              {category.skills?.split(",").map((skill, i) => (
                <span key={i}>
                  {skill.trim()}
                  {i < category.skills.split(",").length - 1 ? ", " : ""}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsPreview;
