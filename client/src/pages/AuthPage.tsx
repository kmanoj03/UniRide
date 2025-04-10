import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Mail, Lock, User, PhoneCall } from "lucide-react";
import axios from "axios";
import AlertModal from "../components/AltertModal";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setName] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

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
      const res = await axios.post("/api/user/send-code", { email });
      showAlert(res.data.message, "success");
      setIsCodeSent(true);
    } catch (error) {
      showAlert(error.response?.data?.message || "Error sending code", "error");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axios.post("/api/user/verify-code", { email, code });
      showAlert(res.data.message, "success");
      setIsCodeVerified(true);
    } catch (error) {
      showAlert(error.response?.data?.message || "Invalid code", "error");
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
      }
    } catch (error) {
      showAlert(error.response?.data?.message || "Signup failed", "error");
    }
  };

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

            {/* Send Verification Code */}
            {!isLogin && !isCodeSent && (
              <div>
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2"
                >
                  Send Code
                </button>
              </div>
            )}

            {/* Verification Code */}
            {!isLogin && isCodeSent && !isCodeVerified && (
              <div>
                <input
                  type="text"
                  placeholder="Verification Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="appearance-none rounded-lg w-full px-3 py-2 border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 mt-2"
                >
                  Verify Code
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
            className={`w-full text-white rounded-lg py-2 ${
              isCodeVerified || isLogin
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!isCodeVerified && !isLogin}
          >
            {isLogin ? "Sign in" : "Sign up"}
          </button>
        </form>
        {/* Toggle Signup/Login */}
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
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
