'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: enter email, 2: enter OTP & new passwords, 3: success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStep(2);
        setMessage('OTP sent if email exists. Please check your email.');
        setMessageType('success');
      } else {
        setMessage(data.error || 'Failed to send OTP');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setMessage('Failed to send OTP. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      setMessageType('error');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStep(3);
        setMessage('Password reset successful. You can now log in.');
        setMessageType('success');
      } else {
        setMessage(data.error || 'Failed to reset password');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setMessage('Failed to reset password. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link
            href="/login"
            className="flex items-center text-cyan-600 hover:text-cyan-500 mb-8"
          >
            <FaArrowLeft className="mr-2" />
            Back to Login
          </Link>

          <div className="text-center">
            {step === 3 ? (
              <>
                <FaLock className="mx-auto h-12 w-12 text-cyan-500" />
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Password Reset Successful
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  You can now <Link href="/login" className="text-cyan-600 hover:text-cyan-500 font-semibold">sign in</Link> with your new password.
                </p>
              </>
            ) : (
              <>
                <FaEnvelope className="mx-auto h-12 w-12 text-cyan-500" />
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  {step === 1 ? 'Forgot your password?' : 'Enter the OTP and reset your password'}
                </h2>
                {step === 1 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Enter your email address and we'll send you an OTP to reset your password.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <form className="space-y-6" onSubmit={sendOtp}>
              {message && (
                <div
                  className={`p-4 rounded-md ${
                    messageType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  {message}
                </div>
              )}

              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <form className="space-y-6" onSubmit={verifyOtpAndResetPassword}>
              {message && (
                <div
                  className={`p-4 rounded-md ${
                    messageType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  {message}
                </div>
              )}

              <div>
                <label htmlFor="otp" className="sr-only">
                  OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  // pattern="\\d{6}"
                  maxLength={6}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <div className="relative">
                <label htmlFor="newPassword" className="sr-only">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNew ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm pr-10"
                  placeholder="New Password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowNew(s => !s)} className="absolute right-3 top-2 text-gray-600">
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm pr-10"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-3 top-2 text-gray-600">
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
