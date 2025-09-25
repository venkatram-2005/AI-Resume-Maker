import React from 'react'

function SummeryPreview({resumeInfo}) {
  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor }}
      >
        Summary
      </h2>
      <hr style={{ borderColor: resumeInfo?.themeColor }} />

      <p className='text-xs mt-3'>
        {resumeInfo?.summary}
      </p>
    </div>
  )
}

export default SummeryPreview