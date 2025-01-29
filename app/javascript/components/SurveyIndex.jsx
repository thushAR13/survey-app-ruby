import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const SurveyIndex = ({ apiBaseUrl }) => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    fetch("/surveys.json", {
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch surveys.");
        }
        return response.json();
      })
      .then((data) => setSurveys(data))
      .catch((error) => console.error("Error fetching surveys:", error));
  }, []);

  const handleDelete = (surveyId, e) => {
    e.stopPropagation(); // Prevent event bubbling
    e.preventDefault(); // Prevent default button behavior

    if (!window.confirm("Are you sure you want to delete this survey?")) {
      return;
    }

    fetch(`/surveys/${surveyId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete survey.");
        }
        alert("Survey was successfully deleted!");
        window.location.reload(); // Refresh the page
      })
      .catch((error) => {
        console.error("Error deleting survey:", error);
        alert("Failed to delete the survey. Please try again.");
      });
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Your Surveys</h1>
        <button
          onClick={() => {
            window.location.href = "/surveys/new";
          }}
          className="btn btn-primary"
        >
          Create New Survey
        </button>
      </div>
      {surveys.length > 0 ? (
        <div className="row">
          {surveys.map((survey) => (
            <div key={survey.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div className="card h-100 shadow">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{survey.title}</h5>
                  <p className="card-text text-muted">{survey.description}</p>
                  <div className="mt-auto d-flex justify-content-between">
                    <button
                      onClick={() => {
                        window.location.href = `/surveys/${survey.id}`;
                      }}
                      className="btn btn-success"
                    >
                      View Survey
                    </button>
                    <button
                      type="button" // Prevent default submit behavior
                      onClick={(e) => handleDelete(survey.id, e)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        window.location.href = `/surveys/${survey.id}/responses`;
                      }}
                      className="btn btn-info"
                    >
                      View Responses
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">
          No surveys available. Click "Create New Survey" to get started!
        </p>
      )}
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("survey-index-root");
  if (rootElement) {
    const apiBaseUrl = rootElement.dataset.apiBaseUrl;
    const root = createRoot(rootElement);
    root.render(<SurveyIndex apiBaseUrl={apiBaseUrl} />);
  }
});

export default SurveyIndex;
