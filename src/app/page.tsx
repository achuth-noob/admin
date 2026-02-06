"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import Link from 'next/link';
import { sendOtp, login, googleLogin } from '@/lib/auth-client';

interface GoogleJwtPayload {
  email: string;
  name: string;
  picture: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1); // 1: email, 2: otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));

  const googleClientId = '867196781991-q7jvnd4muc8r8rtkq3pom96dl7trvuti.apps.googleusercontent.com';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail && storedEmail !== 'undefined') {
        setEmail(storedEmail);
      }
    }
  }, []);

  // Initialize Google Auth Script
  useEffect(() => {
    const initializeGoogleAuth = () => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          setGoogleLoaded(true);
          
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            ux_mode: 'popup',
          });
    
          const googleButton = document.createElement('button');
          googleButton.className = 'w-full flex justify-center items-center py-3 px-4 mb-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none';
          googleButton.type = 'button';
          googleButton.innerHTML = '<svg class="h-5 w-5 mr-2" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z" fill="#4285F4"/><path d="M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z" fill="#34A853"/><path d="M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z" fill="#FBBC05"/><path d="M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z" fill="#EB4335"/></svg>Continue with Google';
          
          googleButton.onclick = () => {
            setLoading(true);
            try {
              if (window.google && window.google.accounts && window.google.accounts.id) {
                window.google.accounts.id.prompt();
              } else {
                console.error('Google sign-in not available');
                setLoading(false);
              }
            } catch (error) {
              console.error('Error with Google Sign-In:', error);
              setLoading(false);
            }
          };
          
          const container = document.getElementById('google-signin-button');
          if (container) {
            container.innerHTML = '';
            container.appendChild(googleButton);
          }
        }
      };

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleAuth;
    document.body.appendChild(script);

    const style = document.createElement('style');
    style.textContent = `
      #google-signin-button {
        width: 100%;
        margin: 0 0 16px 0 !important;
      }
      
      #google-signin-button > div {
        width: 100% !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Focus first OTP input when step changes to 2
  useEffect(() => {
    if (step === 2 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  const handleGoogleCredentialResponse = async (response: any) => {
    setLoading(true);
    try {
      const idToken = response.credential;
      const decoded = jwtDecode<GoogleJwtPayload>(response.credential);
      await localStorage.setItem("userEmail", decoded.email);

      const authResponse = await googleLogin({
        clientId: googleClientId,
        credential: idToken,
        select_by: ""
      });
      
      if (authResponse.kind === 'success') {
        router.push('/dashboard');
      } else {
        // setError(authResponse.message || 'Google authentication failed');
         setError('Google authentication failed');
      }
    } catch (error) {
      console.error('Google authentication error:', error);
      setError('An error occurred during Google authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || email.trim() === '') {
      setError('Please enter an email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await sendOtp({ email });
      
      if (response && response.kind === 'error') {
        // setError(response.message || 'Failed to send OTP. Please try again.');
        setError('Failed to send OTP. Please try again.');
      } else {
        setStep(2);
        if (typeof window !== 'undefined') {
          localStorage.setItem('userEmail', email);
        }
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await login({ email, otp: otpValue });
      
      if (response && response.kind === 'error') {
         // setError(response.message || 'Invalid OTP. Please try again.');
         setError('Invalid OTP. Please try again.');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16">
        <div className="mb-8">
          <div 
            className="text-2xl font-bold cursor-pointer"
            style={{
              background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            oneinfer
          </div>
        </div>

        <div className="w-full max-w-lg text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {step === 1 ? 'Admin Console Login' : 'Enter OTP'}
          </h1>
          <p className="text-lg text-gray-600">
            {step === 1 ? 'Sign in to continue' : `We sent a code to ${email}`}
          </p>
        </div>

        <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-100">
          {step === 1 ? (
            <>
              <div className="px-6 pt-4">
                <div id="google-signin-button" className="w-full"></div>
                
                {!googleLoaded && (
                  <button
                    type="button"
                    onClick={() => alert("Google Sign-In is currently loading. Please try again in a moment.")}
                    className="mb-4 w-full flex justify-center items-center py-3 px-4 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300"
                    disabled={loading}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z" fill="#4285F4"/>
                      <path d="M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z" fill="#34A853"/>
                      <path d="M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z" fill="#FBBC05"/>
                      <path d="M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z" fill="#EB4335"/>
                    </svg>
                    Continue with Google
                  </button>
                )}
              </div>

              <div className="px-6 py-4">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-4">
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={handleEmailChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                      required
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-600">{error}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>

                <p className="mt-4 text-xs text-center text-gray-500">
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/signup" className="text-indigo-600 hover:text-indigo-500">
                    Sign up
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <div className="px-6 py-8">
              <form onSubmit={handleOtpSubmit}>
                <div className="mb-6">
                  <div className="flex justify-center space-x-2 mb-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        disabled={loading}
                      />
                    ))}
                  </div>
                  
                  {error && (
                    <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || otp.some(digit => !digit)}
                >
                  {loading ? 'Verifying...' : 'Sign In'}
                </button>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    ← Back to email
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
