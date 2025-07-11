import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { authAPI } from "@/api";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState(isRegister ? "" : "demo");
  const [password, setPassword] = useState(isRegister ? "" : "password");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { login, error, loading } = useAuthStore();
  const navigate = useNavigate();

  // Update form fields when mode changes
  useEffect(() => {
    if (isRegister) {
      setUsername("");
      setPassword("");
    } else {
      setUsername("demo");
      setPassword("password");
    }
  }, [isRegister]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (isRegister) {
      try {
        // Call the register API
        await authAPI.register({
          username,
          email,
          password,
        });
        // If registration succeeds, log the user in
        const loginSuccess = await login(username, password);
        if (loginSuccess) {
          navigate("/");
        }
      } catch (error: any) {
        console.error("Registration error:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.detail
        ) {
          setErrorMessage(`Registration failed: ${error.response.data.detail}`);
        } else {
          setErrorMessage("Registration failed. Please try again.");
        }
      }
      return;
    }

    try {
      const loginSuccess = await login(username, password);
      if (loginSuccess) {
        navigate("/");
      } else {
        // The error will be set in the auth store
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-400 text-high-contrast">
            Cloudilic
          </h1>
          <p className="text-gray-300">AI Agent Dashboard</p>
          {!isRegister && (
            <p className="text-gray-400 mt-2">
              Demo credentials: username: <strong>demo</strong>, password:{" "}
              <strong>password</strong>
            </p>
          )}
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded border border-red-700">
            {errorMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-200"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-primary-500 focus:border-primary-400"
            />
          </div>

          {isRegister && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={isRegister}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-primary-500 focus:border-primary-400"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-primary-500 focus:border-primary-400"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? "Loading..." : isRegister ? "Register" : "Login"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-primary-400 hover:text-primary-300"
          >
            {isRegister
              ? "Already have an account? Login"
              : "Need an account? Register"}
          </button>
        </div>

        {!isRegister && (
          <div className="mt-8 text-center text-xs text-gray-400">
            <p>Demo Credentials:</p>
            <p className="text-high-contrast">Username: demo</p>
            <p className="text-high-contrast">Password: password</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
