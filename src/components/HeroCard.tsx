import React from 'react';
import { Button, Card } from '../design-system';
import { useAuth, mapFirebaseError } from '../contexts/AuthContext';
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

  return (
    <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'url(/landing_page_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
      <div className="absolute inset-0 bg-black/30"></div>
      <div style={{position: 'fixed', inset: 0, zIndex: 50}}>
        <div
          role="dialog"
          aria-label="Login dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: 'min(90vw, 680px)',
            height: 'min(90vh, 520px)',
            transform: 'translate(-50%, -50%)',
            backgroundImage: 'url(/landing_page_window.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            pointerEvents: 'auto'
          }}
        >
          {/* Login Content positioned within the window. Reduce base font-size by ~3px via inline style adjustment on container text */}
          <div style={{position: 'absolute', top: 'calc(50% + 44px)', left: 'calc(50% + 4px)', width: 'min(84%, 420px)', transform: 'translate(-50%, -50%)', fontSize: '13px'}} className="flex flex-col space-y-3 px-4" tabIndex={-1}>
            
            {/* Login Form */}
            <div className="w-full space-y-3">
              {/* Username Field */}
              <div className="flex flex-col items-center">
                <div className="flex items-center" style={{gap: '5px', width: '100%', justifyContent: 'center'}}>
                  <label htmlFor="email" className="sr-only">Email</label>
                    <div style={{display: 'flex', alignItems: 'center', gap: '5px', width: 'min(360px, 84%)', flexDirection: 'column'}}>
                      <input
                        type="email"
                        id="email"
                        aria-label="email"
                        className="px-3 py-2 border border-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-white"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{width: '100%', borderRadius: '12px', boxSizing: 'border-box', fontSize: '15px'}}
                      />
                      <input
                        type="password"
                        id="password"
                        aria-label="password"
                        className="mt-2 px-3 py-2 border border-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-white"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{width: '100%', borderRadius: '12px', boxSizing: 'border-box', fontSize: '15px'}}
                      />

                      {emailError ? (
                        <div style={{color: '#ff4d4f', fontSize: 12, width: '100%', textAlign: 'left', marginTop: 6}}>{emailError}</div>
                      ) : null}
                      {passwordError ? (
                        <div style={{color: '#ff4d4f', fontSize: 12, width: '100%', textAlign: 'left', marginTop: 6}}>{passwordError}</div>
                      ) : null}
                    </div>
                </div>

                <div style={{width: 'min(360px, 84%)', marginTop: '2px'}}>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="keep-signed-in"
                      aria-label="keep me signed in"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-500" style={{fontSize: '11px'}}>Keep me signed in</span>
                  </label>
                </div>
              </div>

              {/* Login Buttons + Reset link */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <div style={{width: 'min(360px, 84%)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                    <div style={{position: 'relative', width: '100%'}}>
                      <Button
                      type="button"
                      onClick={async () => {
                        setEmailError('');
                        setPasswordError('');
                        setFormError('');
                        setResetMessage('');

                        const emailValid = /\S+@\S+\.\S+/.test(email);
                        if (!emailValid) {
                          setEmailError('Please enter a valid email address');
                        }
                        if (password.length < 6) {
                          setPasswordError('Password must be at least 6 characters');
                        }
                        if (!emailValid || password.length < 6) return;

                        setIsLoggingIn(true);
                        try {
                          await signInWithEmail(email, password);
                          // Analytics: success
                          logAnalyticsEvent('auth_email_signin', { method: 'email', success: true, email: email ? 'redacted' : '' }).catch(() => {});
                        } catch (err: any) {
                          console.error(err);
                          const msg = mapFirebaseError(err);
                          setFormError(msg);
                          logAnalyticsEvent('auth_email_signin', { method: 'email', success: false, error: msg }).catch(() => {});
                        } finally {
                          setIsLoggingIn(false);
                        }
                      }}
                      disabled={isLoggingIn || isGoogleLoading}
                      className="font-medium py-2 px-4 text-sm transition-colors focus:ring-2 focus:ring-offset-1"
                      style={{marginTop: '12px', width: '100%', borderRadius: '12px', boxSizing: 'border-box', backgroundColor: '#06b6d4', color: '#ffffff'}}
                    >
                      {isLoggingIn ? 'Signing in...' : 'Log In'}
                    </Button>

                      {isLoggingIn ? (
                        <div style={{position: 'absolute', top: 8, right: 12}}><Spinner size={18} /></div>
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
                        } catch (err: any) {
                          console.error(err);
                          const msg = (err && err.message) ? err.message : 'Failed to send reset email';
                          setFormError(msg);
                        } finally {
                          setIsResetting(false);
                        }
                      }}
                      className="text-blue-900 hover:text-blue-800 no-underline"
                      style={{marginTop: 2, fontSize: '11px'}}
                    >
                      {isResetting ? 'Sending...' : 'Reset password'}
                    </a>
                    {resetMessage ? (
                      <div style={{color: '#10b981', fontSize: 12, width: '100%', textAlign: 'left', marginTop: 6}}>{resetMessage}</div>
                    ) : null}

                    {/* Icon buttons placed 5px below Reset and 8px from Next button edges */}
                    <div style={{marginTop: 5, width: '100%', position: 'relative', height: 72}}>
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
                          } catch (err: any) {
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
                        style={{
                          position: 'absolute',
                          left: 50,
                          bottom: 0,
                          width: 60,
                          height: 60,
                          padding: 4,
                          border: 'none',
                          background: 'transparent',
                          cursor: isGoogleLoading ? 'wait' : 'pointer',
                          opacity: isGoogleLoading ? 0.7 : 1
                        }}
                      >
                        <img src="/720255.png" alt="Google logo" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                        {isGoogleLoading ? <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Spinner size={18} /></div> : null}
                      </button>

                      {/* Microsoft icon (right) */}
                      <button
                        type="button"
                        title="Microsoft login (coming soon)"
                        onClick={(e) => { e.preventDefault(); alert('Microsoft login is not activated yet.'); }}
                        aria-label="Sign in with Microsoft"
                        style={{
                          position: 'absolute',
                          right: 50,
                          bottom: 0,
                          width: 60,
                          height: 60,
                          padding: 4,
                          border: 'none',
                          background: 'transparent',
                          cursor: 'not-allowed',
                          opacity: 0.85
                        }}
                      >
                        <img src="/791067.png" alt="Microsoft logo" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                      </button>
                    </div>
                    {formError ? (
                      <div style={{color: '#ff4d4f', fontSize: 12, width: '100%', textAlign: 'left', marginTop: 20}}>{formError}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* end centered content */}
            </div>

          {/* Footer will be rendered at the bottom of the window PNG. Layout: privacy left, cookie center, terms right */}
          <div style={{position: 'absolute', bottom: 18, left: 0, right: 0}} className="pointer-events-auto">
            <div className="w-full px-6 flex items-center text-gray-500" style={{fontSize: '11px'}}>
              <div className="flex-1 text-left" style={{paddingLeft: 3}}>
                <a href="#" className="text-blue-900 hover:text-blue-800 no-underline">Privacy Policy</a>
              </div>
              <div className="flex-1 text-center">
                <a href="#" className="text-blue-900 hover:text-blue-800 no-underline">Cookie Notice</a>
              </div>
              <div className="flex-1 text-right" style={{paddingRight: 3}}>
                <a href="#" className="text-blue-900 hover:text-blue-800 no-underline">Terms of Use</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
