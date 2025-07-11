import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";

/**
 * ProtectedRoute component - Guards routes that require authentication
 * Will redirect to login if no token is present
 */
const ProtectedRoute = () => {
  const { token, fetchUser, user } = useAuthStore();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // If we have a token, validate it by fetching user data
    if (token) {
      setIsValidating(true);
      fetchUser()
        .then(() => {
          console.log("User validation successful");
          setIsValidating(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // The error will be handled by the auth store and API interceptor
          setIsValidating(false);
        });
    } else {
      setIsValidating(false);
    }
  }, [token, fetchUser]);

  // Show loading indicator while validating
  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-300">
            Validating your session...
          </p>
        </div>
      </div>
    );
  }

  // If no token is present or token validation failed, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If token is present and validated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
