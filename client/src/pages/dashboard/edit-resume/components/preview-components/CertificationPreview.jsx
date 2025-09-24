import React from "react";

function CertificationPreview({ resumeInfo }) {
  if (!resumeInfo?.certifications?.length) return null;

  return (
    <div className="my-6">
      {resumeInfo?.certifications?.length > 0 && (
        <div>
          <h2 className="text-center font-bold text-sm mb-2" style={{ color: resumeInfo?.themeColor }}>
            Certifications
          </h2>
          <hr style={{ borderColor: resumeInfo?.themeColor }} />
        </div>
      )}

      <ul className="list-disc pl-5 mt-3 text-xs text-black">
        {resumeInfo.certifications.map((cert, index) => (
          <li key={index} className="my-2">
            <span className="font-bold">{cert?.certificateName}</span> - {cert?.issuedBy}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CertificationPreview;
