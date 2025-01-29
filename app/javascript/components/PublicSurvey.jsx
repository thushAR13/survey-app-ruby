import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const PublicSurvey = ({ publicLink, apiBaseUrl }) => {
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [files, setFiles] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch(`${apiBaseUrl}/surveys/public/${publicLink}.json`, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load the survey.");
        }
        return response.json();
      })
      .then((data) => setSurvey(data))
      .catch((error) => setErrorMessage(error.message));
  }, [publicLink, apiBaseUrl]);

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleFileChange = (questionId, file) => {
    setFiles((prev) => ({
      ...prev,
      [questionId]: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    formData.append("survey_id", survey.id);
  
    survey.questions.forEach((question) => {
      if (question.question_type === "File Upload" && files[question.id]) {
        formData.append(`responses[][question_id]`, question.id);
        formData.append(`responses[][file]`, files[question.id]);
      } else {
        formData.append(`responses[][question_id]`, question.id);
        formData.append(`responses[][answer]`, responses[question.id] || "");
      }
    });
  
    fetch(`${apiBaseUrl}/responses`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit responses.");
        }
        return response.json();
      })
      .then(() => {
        alert("Thank you for completing the survey!");
        setResponses({});
        setFiles({});
      })
      .catch((error) => {
        console.error("Error submitting responses:", error);
        alert("Failed to submit responses. Please try again.");
      });
  };

  if (errorMessage) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-danger">{errorMessage}</p>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="container mt-5 text-center">
        <p>Loading survey...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h1 className="text-center mb-4">{survey.title}</h1>
        <p className="text-muted">{survey.description}</p>

        <form onSubmit={handleSubmit}>
          {survey.questions.map((question) => (
            <div key={question.id} className="mb-4">
              <h5>{question.content}</h5>

              {question.question_type === "Multiple Choice" &&
                question.options.map((option) => (
                  <div key={option.id} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${question.id}`}
                      id={`option-${option.id}`}
                      value={option.content}
                      onChange={(e) =>
                        handleResponseChange(question.id, e.target.value)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`option-${option.id}`}
                    >
                      {option.content}
                    </label>
                  </div>
                ))}

              {question.question_type === "Short Answer" && (
                <textarea
                  className="form-control"
                  placeholder="Your answer"
                  value={responses[question.id] || ""}
                  onChange={(e) =>
                    handleResponseChange(question.id, e.target.value)
                  }
                />
              )}

              {question.question_type === "True/False" && (
                <div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${question.id}`}
                      id={`true-${question.id}`}
                      value="True"
                      onChange={(e) =>
                        handleResponseChange(question.id, e.target.value)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`true-${question.id}`}
                    >
                      True
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${question.id}`}
                      id={`false-${question.id}`}
                      value="False"
                      onChange={(e) =>
                        handleResponseChange(question.id, e.target.value)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`false-${question.id}`}
                    >
                      False
                    </label>
                  </div>
                </div>
              )}

              {question.question_type === "Fill in the Blanks" && (
                <input
                  type="text"
                  className="form-control"
                  placeholder="Fill in the blank"
                  value={responses[question.id] || ""}
                  onChange={(e) =>
                    handleResponseChange(question.id, e.target.value)
                  }
                />
              )}

              {question.question_type === "File Upload" && (
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    handleFileChange(question.id, e.target.files[0])
                  }
                />
              )}
            </div>
          ))}

          <button type="submit" className="btn btn-primary">
            Submit Survey
          </button>
        </form>
      </div>
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("public-survey-root");
  if (rootElement) {
    const publicLink = rootElement.dataset.publicLink;
    const apiBaseUrl = rootElement.dataset.apiBaseUrl;
    const root = createRoot(rootElement);
    root.render(<PublicSurvey publicLink={publicLink} apiBaseUrl={apiBaseUrl} />);
  }
});

export default PublicSurvey;
