import React, { useState } from "react";

const AddQuestionModal = ({ isOpen, surveyId, apiBaseUrl, onClose, onAdd }) => {
  const [content, setContent] = useState("");
  const [questionType, setQuestionType] = useState("Multiple Choice");

  const handleSave = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("question[content]", content);
    formData.append("question[question_type]", questionType);
    formData.append("question[survey_id]", surveyId);

    fetch(`${apiBaseUrl}/questions`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add question.");
        }
        return response.json();
      })
      .then((data) => {
        onAdd(data);
        onClose();
      })
      .catch((error) => alert("Failed to add the question."));
  };

  if (!isOpen) return null;

  return (
    <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Question</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSave}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Question Content</label>
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Question Type</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="form-select"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Short Answer">Short Answer</option>
                  <option value="True/False">True/False</option>
                  <option value="Fill in the Blanks">Fill in the Blanks</option>
                  <option value="File Upload">File Upload</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;
