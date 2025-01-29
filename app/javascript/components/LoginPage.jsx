import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import OtpVerificationModal from "./OtpVerificationModal";

const LoginPage = ({ loginUrl, signupUrl, verifyOtpUrl }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const url = isLogin ? loginUrl : signupUrl;
    const payload = {
      user: { email, password, ...(isLogin ? {} : { password_confirmation: confirmPassword }) },
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log("Response:", data);
  
      if (response.ok) {
        setErrorMessage("");
        setSuccessMessage(data.message || "OTP sent to your email. Please verify.");
        setShowOtpModal(true); // Open the OTP verification modal
      } else if (response.status === 401) {
        // Handle unauthorized responses
        setErrorMessage("");
        setSuccessMessage(data.message || "Account not verified. OTP sent to your email.");
        setShowOtpModal(true); // Open the OTP modal for inactive accounts
      } else {
        // Handle other error cases
        setSuccessMessage("");
        setErrorMessage(data.errors?.join(", ") || "An error occurred.");
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleOtpVerified = () => {
    setShowOtpModal(false);
    setSuccessMessage("Verification successful! Redirecting...");
    setTimeout(() => {
      window.location.href = "/surveys"; // Redirect after OTP verification
    }, 1500);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h1 className="text-center mb-4">{isLogin ? "Login" : "Sign Up"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="form-control"
            />
          </div>
          {!isLogin && (
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="form-control"
              />
            </div>
          )}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <button type="submit" className="btn btn-primary w-100">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-3">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className="btn btn-link p-0"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <OtpVerificationModal
          email={email}
          verifyOtpUrl={verifyOtpUrl}
          onClose={() => setShowOtpModal(false)}
          onVerified={handleOtpVerified}
        />
      )}
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("login-root");
  if (rootElement) {
    console.log("Mounting LoginPage...");
    const loginUrl = rootElement.dataset.loginUrl;
    const signupUrl = rootElement.dataset.signupUrl;
    const verifyOtpUrl = rootElement.dataset.verifyOtpUrl;
    const root = createRoot(rootElement);
    root.render(<LoginPage loginUrl={loginUrl} signupUrl={signupUrl} verifyOtpUrl={verifyOtpUrl} />);
  } else {
    console.error("Login root element not found!");
  }
});

export default LoginPage;
