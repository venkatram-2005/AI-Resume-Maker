import React from "react";

function AchievementPreview({ resumeInfo }) {
  if (!resumeInfo?.achievements?.length) return null;

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor }}
      >
        Achievements
      </h2>
      <hr style={{ borderColor: resumeInfo?.themeColor }} />

      <ul className="list-disc pl-5 mt-3 text-sm" style={{ color: resumeInfo?.themeColor }}>
        {resumeInfo.achievements.map((ach, index) => (
          <li key={index} className="my-1 font-normal text-black text-xs">
            {ach?.achievement}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AchievementPreview;
