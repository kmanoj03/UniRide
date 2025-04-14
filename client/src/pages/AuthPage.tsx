import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Mail,
  Lock,
  User,
  PhoneCall,
  ArrowLeft,
  Edit2,
} from "lucide-react";
import axios from "axios";
import AlertModal from "../components/AltertModal";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setName] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "info"
  );

  const showAlert = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!email.endsWith("@vitstudent.ac.in")) {
      showAlert("Only VIT student emails are allowed.", "error");
      return;
    }

    try {
      const endpoint = isForgotPassword
        ? "/api/user/forgot-password"
        : "/api/user/send-code";

      const res = await axios.post(endpoint, { email });
      showAlert(res.data.message, "success");
      setIsCodeSent(true);
      setIsEditingEmail(false);
      setCode("");
    } catch (error: any) {
      showAlert(error.response?.data?.message || "Error sending code", "error");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const endpoint = isForgotPassword
        ? "/api/user/verify-reset-code"
        : "/api/user/verify-code";

      const res = await axios.post(endpoint, { email, code });
      showAlert(res.data.message, "success");
      setIsCodeVerified(true);
    } catch (error) {
      showAlert(error.response?.data?.message || "Invalid code", "error");
    }
  };

  const handleEditEmail = () => {
    setIsEditingEmail(true);

    setIsCodeSent(false);

    setIsCodeVerified(false);

    setCode("");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showAlert("Passwords do not match", "error");

      return;
    }

    try {
      const res = await axios.post("/api/user/reset-password", {
        email,

        code,

        newPassword,
      });

      showAlert("Password reset successful!", "success");

      setTimeout(() => {
        setIsForgotPassword(false);
        setIsLogin(true);
        setEmail("");
        setCode("");
        setNewPassword("");
        setConfirmPassword("");
        setIsCodeSent(false);
        setIsCodeVerified(false);
      }, 2000);
    } catch (error: any) {
      showAlert(
        error.response?.data?.message || "Password reset failed",
        "error"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.endsWith("@vitstudent.ac.in")) {
      showAlert("Only VIT student emails are allowed.", "error");
      return;
    }

    if (!isLogin && !isCodeVerified) {
      showAlert("Please verify the code first.", "error");
      return;
    }

    const api = isLogin ? "/api/user/login" : "/api/user/signup";

    const data = isLogin
      ? { email, password }
      : { fullName, email, password, phone };

    try {
      const res = await axios.post(api, data);
      if (res.data.status === 200) {
        localStorage.setItem("email", email);
        navigate("/dashboard");
        showAlert(res.data.message, "success");
      } else {
        showAlert(res.data.message, "error");
        setPass("");
      }
    } catch (error: any) {
      showAlert(error.response?.data?.message || "Signup failed", "error");
      setPass("");
    }
  };

  const handleBack = () => {
    setIsForgotPassword(false);

    setIsLogin(true);

    // Reset states

    setEmail("");

    setCode("");

    setNewPassword("");

    setConfirmPassword("");

    setIsCodeSent(false);

    setIsCodeVerified(false);
  };

  const renderEmailSection = () => {
    if (!isCodeSent || isEditingEmail) {
      return (
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>

          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

            <input
              id="email"
              type="email"
              required
              className="appearance-none rounded-lg w-full pl-10 px-3 py-2 border border-gray-300"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleSendCode}
            disabled={isLoading}
            className={`w-full ${
              isLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            } text-white rounded-lg py-2 mt-2 transition-colors`}
          >
            {isLoading
              ? "Sending..."
              : isEditingEmail
              ? "Resend Code"
              : "Send Code"}
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
        <span className="text-gray-700">{email}</span>

        <button
          type="button"
          onClick={handleEditEmail}
          className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <Edit2 className="h-4 w-4" />
          Change
        </button>
      </div>
    );
  };

  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center relative">
            <button
              onClick={handleBack}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            <div className="flex justify-center">
              <Car className="h-12 w-12 text-indigo-600" />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Reset Password
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="rounded-md shadow-sm space-y-4">
              {/* Email */}
              {renderEmailSection()}

              {/* Verification Code */}

              {isCodeSent && !isCodeVerified && !isEditingEmail && (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter 6-digit verification code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="appearance-none rounded-lg w-full px-3 py-2 border border-gray-300"
                      maxLength={6}
                      pattern="\d{6}"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isLoading}
                    className={`w-full ${
                      isLoading
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white rounded-lg py-2 transition-colors`}
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </button>
                </div>
              )}

              {/* New Password Fields */}

              {isCodeVerified && (
                <>
                  <div>
                    <label htmlFor="newPassword" className="sr-only">
                      New Password
                    </label>

                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                      <input
                        id="newPassword"
                        type="password"
                        required
                        className="appearance-none rounded-lg w-full pl-10 px-3 py-2 border border-gray-300"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="sr-only">
                      Confirm Password
                    </label>

                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                      <input
                        id="confirmPassword"
                        type="password"
                        required
                        className="appearance-none rounded-lg w-full pl-10 px-3 py-2 border border-gray-300"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2"
                  >
                    Reset Password
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <Car className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign In To Your Account" : "Create Your Account"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Full Name */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    required
                    className="appearance-none rounded-lg w-full pl-10 px-3 py-2 border border-gray-300"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
            {/* Phone */}
            {!isLogin && (
              <div>
                <label htmlFor="phone" className="sr-only">
                  Phone
                </label>
                <div className="relative">
                  <PhoneCall className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="phone"
                    type="number"
                    required
                    className="appearance-none rounded-lg w-full pl-10 px-3 py-2 border border-gray-300"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            )}
            {/* Email */}
            {/* Email Section for Signup */}
            {!isLogin && renderEmailSection()}

            {/* Regular Email Input for Login */}
            {isLogin && (
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                  <input
                    id="email"
                    type="email"
                    required
                    className="appearance-none rounded-lg w-full pl-10 px-3 py-2 border border-gray-300"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            )}
            {/* Verification Code */}
            {!isLogin && isCodeSent && !isCodeVerified && !isEditingEmail && (
              <div>
                <input
                  type="text"
                  placeholder="Enter 6-digit verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="appearance-none rounded-lg w-full px-3 py-2 border border-gray-300"
                  maxLength={6}
                  pattern="\d{6}"
                />

                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isLoading}
                  className={`w-full ${
                    isLoading
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white rounded-lg py-2 mt-2 transition-colors`}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </button>
              </div>
            )}
            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg w-full pl-10 px-3 py-2 border border-gray-300"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={(!isCodeVerified && !isLogin) || isLoading}
            className={`w-full text-white rounded-lg py-2 transition-colors ${
              isCodeVerified || isLogin
                ? isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isLoading
              ? isLogin
                ? "Signing in..."
                : "Signing up..."
              : isLogin
              ? "Sign in"
              : "Sign up"}
          </button>
        </form>

        {/* Forgot Password Link */}
        {isLogin && (
          <div className="text-center">
            <button
              onClick={() => setIsForgotPassword(true)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </button>
          </div>
        )}

        {/* Toggle Signup/Login */}
        <div className="text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail("");
              // setPassword("");
              setIsCodeSent(false);
              setIsCodeVerified(false);
              setIsEditingEmail(false);
              setCode("");
            }}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>

        <AlertModal
          message={alertMessage}
          type={alertType}
          isOpen={alertOpen}
          onClose={() => setAlertOpen(false)}
        />
      </div>
    </div>
  );
}

export default AuthPage;
