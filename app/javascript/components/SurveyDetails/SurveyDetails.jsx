import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import QuestionTable from "./QuestionTable";
import EditQuestionModal from "./EditQuestionModal";
import ViewQuestionModal from "./ViewQuestionModal";
import AddQuestionModal from "./AddQuestionModal";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";

const SurveyDetails = ({ surveyId, apiBaseUrl }) => {
  const [survey, setSurvey] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [viewModal, setViewModal] = useState({ isOpen: false, question: null });
  const [editModal, setEditModal] = useState({ isOpen: false, question: null });
  const [addModal, setAddModal] = useState({ isOpen: false });

  useEffect(() => {
    fetch(`${apiBaseUrl}/surveys/${surveyId}.json`, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch survey details.");
        }
        return response.json();
      })
      .then((data) => setSurvey(data))
      .catch((error) => setErrorMessage(error.message));
  }, [surveyId, apiBaseUrl]);

  const openViewModal = (question) => setViewModal({ isOpen: true, question });
  const closeViewModal = () => setViewModal({ isOpen: false, question: null });

  const openEditModal = (question) =>
    setEditModal({ isOpen: true, question: { ...question, file: null } });
  const closeEditModal = () => setEditModal({ isOpen: false, question: null });

  const openAddModal = () => setAddModal({ isOpen: true });
  const closeAddModal = () => setAddModal({ isOpen: false });

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
        <p>Loading survey details...</p>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/surveys/public/${survey.public_link}`;
  const shareDescription = "Take this survey!";
  const shareTitle = "Take this survey now!";
  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h1 className="text-center mb-4">{survey.title}</h1>
        <p className="text-muted">{survey.description}</p>

        {/* Share Survey Section */}
        <div className="mt-3 d-flex align-items-center">
          {/* Email Share */}
          <button
            onClick={() => window.open(`mailto:?subject=Take this survey&body=${shareUrl}`)}
            className="btn btn-outline-secondary me-2"
          >
            Share via Email
          </button>

          {/* Facebook Share */}
          <FacebookShareButton url={shareUrl} quote={`${shareTitle} ${shareUrl}`} hashtag="#Survey">
            <button className="btn btn-outline-info me-2">Facebook</button>
          </FacebookShareButton>

          {/* Twitter Share */}
          <TwitterShareButton url={shareUrl} title={shareTitle} hashtags={["Survey", "Feedback"]}>
            <button className="btn btn-outline-primary me-2">Twitter</button>
          </TwitterShareButton>

          {/* LinkedIn Share */}
          <LinkedinShareButton url={shareUrl} title={shareTitle} summary={shareDescription} source={shareUrl}>
            <button className="btn btn-outline-dark me-2">LinkedIn</button>
          </LinkedinShareButton>

          {/* WhatsApp Share */}
          <WhatsappShareButton url={shareUrl} title={`${shareTitle} ${shareUrl}`}>
            <button className="btn btn-outline-success">WhatsApp</button>
          </WhatsappShareButton>
        </div>;
        {/* Questions Table */}
        <QuestionTable
          questions={survey.questions}
          onView={openViewModal}
          onEdit={openEditModal}
          onAdd={openAddModal}
          onDelete={(updatedQuestions) =>
            setSurvey((prev) => ({ ...prev, questions: updatedQuestions }))
          }
          apiBaseUrl={apiBaseUrl}
        />
      </div>

      <ViewQuestionModal
        isOpen={viewModal.isOpen}
        question={viewModal.question}
        onClose={closeViewModal}
      />

      <EditQuestionModal
        isOpen={editModal.isOpen}
        question={editModal.question}
        surveyId={surveyId}
        apiBaseUrl={apiBaseUrl}
        onClose={closeEditModal}
        onSave={(updatedQuestion) =>
          setSurvey((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
              q.id === updatedQuestion.id ? updatedQuestion : q
            ),
          }))
        }
      />

      <AddQuestionModal
        isOpen={addModal.isOpen}
        surveyId={surveyId}
        apiBaseUrl={apiBaseUrl}
        onClose={closeAddModal}
        onAdd={(newQuestion) =>
          setSurvey((prev) => ({
            ...prev,
            questions: [...prev.questions, newQuestion],
          }))
        }
      />
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("survey-details-root");
  if (rootElement) {
    const surveyId = rootElement.dataset.surveyId;
    const apiBaseUrl = rootElement.dataset.apiBaseUrl;
    const root = createRoot(rootElement);
    root.render(<SurveyDetails surveyId={surveyId} apiBaseUrl={apiBaseUrl} />);
  }
});

export default SurveyDetails;
