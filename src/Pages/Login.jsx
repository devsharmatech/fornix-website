import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin, clearError, selectAuthLoading, selectAuthError, selectIsAuthenticated } from "../redux/slices/authSlice";
import { showNotification } from "../redux/slices/uiSlice";
// import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const loading = useSelector(selectAuthLoading);
  const apiError = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation logic
  const validate = () => {
    const newErrors = {};

    if (!formData.identifier) {
      newErrors.identifier = "Identifier is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier)
    ) {
      newErrors.identifier = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        dispatch(clearError());

        // Dispatch Redux action
        await dispatch(loginUser(formData)).unwrap();

        // Show success notification
        dispatch(showNotification({
          type: 'success',
          message: 'Login successful!',
        }));

        // Navigate to dashboard
        navigate("/dashboard");
      } catch (err) {
        // Error is handled by Redux slice
        dispatch(showNotification({
          type: 'error',
          message: err || 'Login failed',
        }));
      }
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      dispatch(clearError());

      // Dispatch Google login action
      await dispatch(googleLogin(credentialResponse.credential)).unwrap();

      // Show success notification
      dispatch(showNotification({
        type: 'success',
        message: 'Google login successful!',
      }));

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      dispatch(showNotification({
        type: 'error',
        message: err || 'Google login failed',
      }));
    }
  };

  // Handle Google login error
  const handleGoogleError = () => {
    dispatch(showNotification({
      type: 'error',
      message: 'Google login failed. Please try again.',
    }));
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 sm:px-6 pt-24 sm:pt-32 pb-20">
      <div className="bg-white shadow-lg rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-sm sm:max-w-md min-h-[400px] ">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Login to continue learning with Fornix
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${errors.identifier
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-orange-500"
                }`}
              placeholder="you@example.com"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">
                {errors.identifier}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border p-3 pr-12 rounded-lg focus:outline-none focus:ring-2 ${errors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-orange-500"
                  }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}

            <div className="flex justify-end mt-2">
              <Link to="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* API Error */}
          {apiError && (
            <p className="text-red-600 text-sm text-center">{apiError}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        {/* <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div> */}

        {/* Google Sign-In */}
        {/* <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />

        </div> */}

        {/* Footer */}
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

