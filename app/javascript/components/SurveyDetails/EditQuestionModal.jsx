import React, { useState, useEffect } from "react";

const EditQuestionModal = ({ isOpen, question, surveyId, apiBaseUrl, onClose, onSave }) => {
  // State for managing form inputs
  const [content, setContent] = useState(question?.content || "");
  const [questionType, setQuestionType] = useState(question?.question_type || "Multiple Choice");
  const [options, setOptions] = useState(question?.options || []);
  const [file, setFile] = useState(null);

  // Initialize state when the `question` prop changes
  useEffect(() => {
    if (question) {
      setContent(question.content || "");
      setQuestionType(question.question_type || "Multiple Choice");
      setOptions(
        question.options?.map((option) => ({
          ...option,
          id: option.id || Date.now(), // Preserve existing IDs or generate new ones
        })) || []
      );
    }
  }, [question]);

  // Add a new option
  const addOption = () => {
    const newOption = {
      id: Date.now(), // Temporary unique ID for new options
      content: "",
      _destroy: false,
    };
    setOptions([...options, newOption]);
  };

  // Update an option's content
  const updateOption = (id, value) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, content: value, _destroy: false } : option
      )
    );
  };

  // Mark an option for deletion
  const removeOption = (id) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, _destroy: true } : option
      )
    );
  };

  // Handle form submission
  const handleSave = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("question[content]", content);
    formData.append("question[question_type]", questionType);
    formData.append("question[survey_id]", surveyId);

    if (questionType === "Multiple Choice") {
      options.forEach((option, index) => {
        if (option.id) {
          formData.append(`question[options_attributes][${index}][id]`, option.id);
        }
        formData.append(`question[options_attributes][${index}][content]`, option.content);
        if (option._destroy) {
          formData.append(`question[options_attributes][${index}][_destroy]`, "1");
        }
      });
    }

    // Send the PATCH request to update the question
    fetch(`${apiBaseUrl}/questions/${question.id}`, {
      method: "PATCH",
      headers: {
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update question.");
        }
        return response.json();
      })
      .then((updatedQuestion) => {
        onSave(updatedQuestion); // Notify parent component of the update
        onClose(); // Close the modal
      })
      .catch((error) => {
        console.error("Error updating question:", error);
        alert("Failed to update question. Please try again.");
      });
  };

  // If the modal is not open or there's no question, don't render anything
  if (!isOpen || !question) return null;

  return (
    <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Question</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSave}>
            <div className="modal-body">
              {/* Question Content */}
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

              {/* Question Type */}
              <div className="mb-3">
                <label className="form-label">Question Type</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="form-select"
                  disabled
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Short Answer">Short Answer</option>
                  <option value="True/False">True/False</option>
                  <option value="Fill in the Blanks">Fill in the Blanks</option>
                  <option value="File Upload">File Upload</option>
                </select>
              </div>

              {/* Options for Multiple Choice Questions */}
              {questionType === "Multiple Choice" && (
                <div>
                  <h6>Options</h6>
                  {options
                    .filter((option) => !option._destroy) // Exclude options marked for removal
                    .map((option) => (
                      <div key={option.id} className="d-flex align-items-center mb-2">
                        <input
                          type="text"
                          value={option.content}
                          onChange={(e) => updateOption(option.id, e.target.value)}
                          placeholder={`Option ${option.id}`}
                          className="form-control me-2"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(option.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  <button
                    type="button"
                    onClick={addOption}
                    className="btn btn-secondary btn-sm"
                  >
                    Add Option
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditQuestionModal;