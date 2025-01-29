import React from "react";

const ViewQuestionModal = ({ isOpen, question, onClose }) => {
  if (!isOpen || !question) return null;

  return (
    <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">View Question</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <h6>Question: {question.content}</h6>
            <p>Type: {question.question_type}</p>
            {question.question_type === "Multiple Choice" && (
              <div>
                <h6>Options</h6>
                <ul>
                  {(question.options || []).map((option, index) => (
                    <li key={index}>{option.content}</li>
                  ))}
                </ul>
              </div>
            )}
            {question.question_type === "File Upload" && question.file_url && (
              <div className="mt-3">
                <h6>Uploaded File</h6>
                <a
                  href={question.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                </a>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQuestionModal;
