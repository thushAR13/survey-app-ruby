import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const SurveyForm = ({ createSurveyUrl }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  // Add a new question
  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { content: "", questionType: "Multiple Choice", options: [], file: null },
    ]);
  };

  // Update a question field (e.g., content, questionType, or file)
  const updateQuestion = (index, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, i) =>
        i === index
          ? {
              ...question,
              [field]: value,
              ...(field === "questionType" && value !== "Multiple Choice"
                ? { options: [] } // Clear options if not Multiple Choice
                : {}),
            }
          : question
      )
    );
  };

  // Remove a question
  const removeQuestion = (index) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, i) => i !== index)
    );
  };

  // Add an option to a Multiple Choice question
  const addOption = (questionIndex) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, i) =>
        i === questionIndex
          ? { ...question, options: [...question.options, { content: "" }] }
          : question
      )
    );
  };

  // Update an option's content
  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              options: question.options.map((option, j) =>
                j === optionIndex ? { ...option, content: value } : option
              ),
            }
          : question
      )
    );
  };

  // Remove an option
  const removeOption = (questionIndex, optionIndex) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              options: question.options.filter((_, j) => j !== optionIndex),
            }
          : question
      )
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("survey[title]", title);
    formData.append("survey[description]", description);

    questions.forEach((q, qIndex) => {
      formData.append(`survey[questions_attributes][${qIndex}][content]`, q.content);
      formData.append(`survey[questions_attributes][${qIndex}][question_type]`, q.questionType);

      if (q.questionType === "Multiple Choice") {
        q.options.forEach((opt, optIndex) => {
          formData.append(
            `survey[questions_attributes][${qIndex}][options_attributes][${optIndex}][content]`,
            opt.content
          );
        });
      }

      if (q.questionType === "File Upload" && q.file) {
        formData.append(
          `survey[questions_attributes][${qIndex}][file]`,
          q.file
        );
      }
    });

    fetch(createSurveyUrl, {
      method: "POST",
      headers: {
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Survey created successfully!");
          setTitle("");
          setDescription("");
          setQuestions([]);
        } else {
          alert("Error creating survey.");
        }
      })
      .catch((error) => {
        console.error("Error submitting survey:", error);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-12">
          <form onSubmit={handleSubmit} className="card shadow p-4">
            <h1 className="mb-4 text-center">Create a New Survey</h1>
            <div className="mb-3">
              <label htmlFor="survey-title" className="form-label">
                Survey Title
              </label>
              <input
                id="survey-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Survey Title"
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="survey-description" className="form-label">
                Survey Description
              </label>
              <textarea
                id="survey-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Survey Description"
                className="form-control"
              />
            </div>

            <h2 className="mb-3">Questions</h2>
            {questions.length > 0 ? (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Type</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={question.content}
                          onChange={(e) =>
                            updateQuestion(index, "content", e.target.value)
                          }
                          placeholder={`Question ${index + 1}`}
                          required
                          className="form-control"
                        />
                        {question.questionType === "Multiple Choice" && (
                          <div className="mt-2">
                            <h6>Options:</h6>
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className="d-flex align-items-center mb-2"
                              >
                                <input
                                  type="text"
                                  value={option.content}
                                  onChange={(e) =>
                                    updateOption(index, optIndex, e.target.value)
                                  }
                                  placeholder={`Option ${optIndex + 1}`}
                                  required
                                  className="form-control me-2"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeOption(index, optIndex)
                                  }
                                  className="btn btn-danger btn-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addOption(index)}
                              className="btn btn-secondary btn-sm"
                            >
                              Add Option
                            </button>
                          </div>
                        )}
                        {question.questionType === "File Upload" && (
                          <div className="mt-2">
                            <label htmlFor={`file-${index}`} className="form-label">
                              Upload File:
                            </label>
                            <input
                              type="file"
                              id={`file-${index}`}
                              onChange={(e) =>
                                updateQuestion(index, "file", e.target.files[0])
                              }
                              className="form-control"
                            />
                          </div>
                        )}
                      </td>
                      <td>
                        <select
                          value={question.questionType}
                          onChange={(e) =>
                            updateQuestion(index, "questionType", e.target.value)
                          }
                          className="form-select"
                        >
                          <option value="Multiple Choice">
                            Multiple Choice
                          </option>
                          <option value="Short Answer">Short Answer</option>
                          <option value="True/False">True/False</option>
                          <option value="Fill in the Blanks">
                            Fill in the Blanks
                          </option>
                          <option value="File Upload">File Upload</option>
                        </select>
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="btn btn-danger btn-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-muted">No questions added yet.</p>
            )}
            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                onClick={addQuestion}
                className="btn btn-secondary"
              >
                Add Question
              </button>
              <button type="submit" className="btn btn-primary">
                Create Survey
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;

// Mount the component
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("survey-form-root");
  if (rootElement) {
    const createSurveyUrl = rootElement.dataset.createSurveyUrl;
    const root = createRoot(rootElement);
    root.render(<SurveyForm createSurveyUrl={createSurveyUrl} />);
  }
});
