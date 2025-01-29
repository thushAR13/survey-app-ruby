import React from "react";

const QuestionTable = ({ questions, onView, onEdit, onAdd, onDelete, apiBaseUrl }) => {
  const handleDelete = (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    fetch(`${apiBaseUrl}/questions/${questionId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete question.");
        }
        onDelete(questions.filter((q) => q.id !== questionId));
      })
      .catch((error) => alert("Failed to delete the question."));
  };

  return (
    <div>
      <h2 className="mt-4 d-flex justify-content-between align-items-center">
        Questions
        <button onClick={onAdd} className="btn btn-primary btn-sm">
          Add Question
        </button>
      </h2>
      {questions.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Type</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr key={question.id}>
                  <td>{index + 1}</td>
                  <td>{question.content}</td>
                  <td>{question.question_type}</td>
                  <td className="text-center">
                    <button
                      onClick={() => onView(question)}
                      className="btn btn-info btn-sm me-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(question)}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-muted mt-3">
          No questions available for this survey.
        </p>
      )}
    </div>
  );
};

export default QuestionTable;
