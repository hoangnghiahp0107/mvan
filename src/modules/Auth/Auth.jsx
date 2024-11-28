import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaTimesCircle } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import Swal from 'sweetalert2';
import { signUp, signIn } from '../../apis/callApi.js'; 

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const newErrors = { ...errors };

    if (name === "email" && value) {
      if (!validateEmail(value)) {
        newErrors.email = "Invalid email format";
      } else {
        delete newErrors.email;
      }
    }

    if (name === "password") {
      const strength = calculatePasswordStrength(value);
      if (strength < 3) {
        newErrors.password = "Password is too weak";
      } else {
        delete newErrors.password;
      }

      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        let response;
        
        if (isLogin) {
            response = await signIn({
                email: formData.email,
                password: formData.password,
            });
        } else {
            response = await signUp({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
        }

        setLoading(false);
        
        if (response && response.message) {
            Swal.fire({
                icon: 'success',
                title: isLogin ? 'Logged in successfully!' : 'Account created successfully!',
                text: response.message || (isLogin ? 'Welcome back!' : `Welcome, ${response.user.name}!`),
            });

            // Reset form after success
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.message || 'Something went wrong, please try again.',
            });
        }
    } catch (error) {
        setLoading(false);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Something went wrong, please try again later.',
        });
    }
};
  

  const strengthColor = (strength) => {
    switch (strength) {
      case 0: return "bg-red-500";
      case 1: return "bg-red-400";
      case 2: return "bg-yellow-500";
      case 3: return "bg-green-400";
      case 4: return "bg-green-500";
      default: return "bg-gray-200";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-600">
            {isLogin ? "Sign in to continue" : "Sign up for a new account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                User name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                placeholder="Enter your username"
                required
                aria-label="name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none`}
              placeholder="Enter your email"
              required
              aria-label="Email Address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                <FaTimesCircle className="inline mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none`}
                placeholder="Enter your password"
                required
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2 space-y-1">
                <div className="flex space-x-1">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-full rounded ${strengthColor(calculatePasswordStrength(formData.password) > index ? calculatePasswordStrength(formData.password) : 0)}`}
                    />
                  ))}
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600" role="alert">
                    <FaTimesCircle className="inline mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>
            )}
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none`}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  <FaTimesCircle className="inline mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className={`w-full py-3 px-6 text-white font-bold rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-600'} hover:bg-blue-700 focus:ring-2 focus:ring-blue-500`}
            >
              {loading ? <BiLoaderAlt className="animate-spin mr-2" /> : isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
