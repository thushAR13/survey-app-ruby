import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const SurveyResponses = ({ surveyId, apiBaseUrl }) => {
  const [responses, setResponses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch(`${apiBaseUrl}/surveys/${surveyId}/responses.json`, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch responses.");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Verify the JSON structure here
        setResponses(data);
      })
      .catch((error) => setErrorMessage(error.message));
  }, [surveyId, apiBaseUrl]);

  if (errorMessage) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-danger">{errorMessage}</p>
      </div>
    );
  }

  if (!responses.length) {
    return (
      <div className="container mt-5 text-center">
        <p>No responses found for this survey.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="col-lg-8 col-md-10 col-sm-12">
        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold">Survey Responses</h1>
        </div>
        {responses.map((question, index) => (
          <div key={question.id} className="card mb-4 shadow-sm">
            <div className="card-header" style={{ backgroundColor: "#d6d6d6", color: "#333" }}>
              <h5 className="mb-0">
                Question {index + 1}: {question.content}
              </h5>
            </div>
            <div className="card-body">
              {question.responses.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {question.responses.map((response) => (
                    <li key={response.id} className="list-group-item">
                      {response.content ? (
                        <p className="mb-0">{response.content}</p>
                      ) : response.file_url ? (
                        <a
                          href={response.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          <i className="bi bi-file-earmark-arrow-down me-2"></i>
                          View Uploaded File
                        </a>
                      ) : (
                        <p className="text-muted">No response provided.</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No responses yet for this question.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("survey-responses-root");
  if (rootElement) {
    const surveyId = rootElement.dataset.surveyId;
    const apiBaseUrl = rootElement.dataset.apiBaseUrl;
    const root = createRoot(rootElement);
    root.render(<SurveyResponses surveyId={surveyId} apiBaseUrl={apiBaseUrl} />);
  }
});

export default SurveyResponses;
