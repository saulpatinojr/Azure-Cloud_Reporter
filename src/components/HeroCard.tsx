import React from 'react';
import '../styles/hero.css';
import { Button } from '../design-system';
import { useAuth } from '../contexts/AuthContext';
import { mapFirebaseError } from '../contexts/authUtils';
import { logAnalyticsEvent } from '../lib/firebase-native';
import Spinner from './Spinner';

export default function HeroCard() {
  const { signInWithGoogle, signInWithEmail, resetPassword } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [formError, setFormError] = React.useState('');
  const [resetMessage, setResetMessage] = React.useState('');
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setFormError('');
    setResetMessage('');
    const emailValid = /\S+@\S+\.\S+/.test(email);
    if (!emailValid) setEmailError('Please enter a valid email address');
    if (password.length < 6) setPasswordError('Password must be at least 6 characters');
    if (!emailValid || password.length < 6) return;
    setIsLoggingIn(true);
    try {
      await signInWithEmail(email, password);
      logAnalyticsEvent('auth_email_signin', { method: 'email', success: true, email: email ? 'redacted' : '' }).catch(() => {});
    } catch (err) {
      console.error(err);
      const msg = mapFirebaseError(err);
      setFormError(msg);
      logAnalyticsEvent('auth_email_signin', { method: 'email', success: false, error: msg }).catch(() => {});
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden hero-bg">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="fixed inset-0 z-50">
        <div role="dialog" aria-label="Login dialog" aria-modal="true" className="hero-window">
          {/* Login Content positioned within the window. Reduce base font-size by ~3px via inline style adjustment on container text */}
          <div className="hero-content flex flex-col space-y-3 px-4" tabIndex={-1}>
            
            {/* Login Form */}
            <div className="w-full space-y-3">
              {/* Credential Form */}
              <form className="flex flex-col items-center" onSubmit={handleSubmit} autoComplete="on" aria-label="Sign in form" noValidate>
                <div className="hero-input-wrapper">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <div className="hero-inputs">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      inputMode="email"
                      autoComplete="email"
                      aria-label="Email address"
                      className="rounded-xl px-3 py-2 border border-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-white"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      id="password"
                      name="current-password"
                      autoComplete="current-password"
                      aria-label="Password"
                      className="rounded-xl mt-2 px-3 py-2 border border-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-white"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    {emailError ? <div className="hero-error" role="alert">{emailError}</div> : null}
                    {passwordError ? <div className="hero-error" role="alert">{passwordError}</div> : null}
                  </div>
                </div>

                <div className="hero-keep-signed">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="keep-signed-in"
                      name="remember"
                      aria-label="Keep me signed in"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-500 text-[11px]">Keep me signed in</span>
                  </label>
                </div>
              </form>

              {/* Login Buttons + Reset link */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <div className="hero-login-block">
                    <div className="hero-login-relative">
                      <Button
                        type="submit"
                        disabled={isLoggingIn || isGoogleLoading}
                        className="mt-3 w-full rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 font-medium py-2 px-4 text-sm transition-colors focus:ring-2 focus:ring-offset-1"
                        aria-label="Log in"
                      >
                        {isLoggingIn ? 'Signing in...' : 'Log In'}
                      </Button>

                      {isLoggingIn ? (
                        <div className="hero-spinner"><Spinner size={18} /></div>
                      ) : null}
                    </div>


                    <a
                      href="#"
                      onClick={async (e) => {
                        e.preventDefault();
                        setEmailError('');
                        setPasswordError('');
                        setFormError('');
                        setResetMessage('');
                        if (!/\S+@\S+\.\S+/.test(email)) {
                          setEmailError('Enter a valid email to reset password');
                          return;
                        }
                        setIsResetting(true);
                        try {
                          await resetPassword(email);
                          setResetMessage('Password reset email sent. Check your inbox.');
                        } catch (err) {
                          console.error(err);
                          const msg = (err as Error)?.message || 'Failed to send reset email';
                          setFormError(msg);
                        } finally {
                          setIsResetting(false);
                        }
                      }}
                      className="text-blue-900 hover:text-blue-800 no-underline hero-reset"
                    >
                      {isResetting ? 'Sending...' : 'Reset password'}
                    </a>
                    {resetMessage ? (
                      <div className="hero-reset-success">{resetMessage}</div>
                    ) : null}

                    {/* Icon buttons placed 5px below Reset and 8px from Next button edges */}
                    <div className="hero-icons">
                      {/* Google icon (left) */}
                      <button
                        type="button"
                        title="Sign in with Google"
                        onClick={async (e) => {
                          e.preventDefault();
                          if (isGoogleLoading) return;
                          setFormError('');
                          setIsGoogleLoading(true);
                          try {
                            await signInWithGoogle();
                            logAnalyticsEvent('auth_google_signin', { method: 'google', success: true }).catch(() => {});
                          } catch (err) {
                            console.error(err);
                            const msg = mapFirebaseError(err);
                            // If provider not enabled or domain not authorized, give specific guidance.
                            if (msg && msg.toLowerCase().includes('popup') || msg.toLowerCase().includes('network')) {
                              setFormError(msg + ' If this persists, ensure Google provider is enabled in Firebase Auth and localhost is in Authorized domains.');
                            } else {
                              setFormError(msg);
                            }
                            logAnalyticsEvent('auth_google_signin', { method: 'google', success: false, error: msg }).catch(() => {});
                          } finally {
                            setIsGoogleLoading(false);
                          }
                        }}
                        aria-label="Sign in with Google"
                        disabled={isGoogleLoading}
                        className={`hero-icon-btn hero-icon-google ${isGoogleLoading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
                      >
                        <img src="/720255.png" alt="Google logo" className="w-full h-full object-contain" />
                        {isGoogleLoading ? <div className="absolute inset-0 flex items-center justify-center"><Spinner size={18} /></div> : null}
                      </button>

                      {/* Microsoft icon (right) */}
                      <button
                        type="button"
                        title="Microsoft login (coming soon)"
                        onClick={(e) => { e.preventDefault(); alert('Microsoft login is not activated yet.'); }}
                        aria-label="Sign in with Microsoft"
                        className="hero-icon-btn hero-icon-microsoft cursor-not-allowed opacity-85"
                      >
                        <img src="/791067.png" alt="Microsoft logo" className="w-full h-full object-contain" />
                      </button>
                    </div>
                    {formError ? (
                      <div className="hero-form-error" role="alert">{formError}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* end centered content */}
            </div>

          {/* Footer */}
          <div className="hero-footer pointer-events-auto">
            <div className="w-full px-6 flex items-center text-gray-500 hero-footer-inner">
              <div className="flex-1 text-left hero-footer-left">
                <a href="#" className="text-blue-900 hover:text-blue-800 no-underline">Privacy Policy</a>
              </div>
              <div className="flex-1 text-center">
                <a href="#" className="text-blue-900 hover:text-blue-800 no-underline">Cookie Notice</a>
              </div>
              <div className="flex-1 text-right hero-footer-right">
                <a href="#" className="text-blue-900 hover:text-blue-800 no-underline">Terms of Use</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
