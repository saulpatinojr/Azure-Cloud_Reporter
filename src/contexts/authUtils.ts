// Utility helpers extracted from AuthContext to satisfy fast-refresh rule.
// Map Firebase errors to user-friendly messages.
interface FirebaseLikeError { code?: string; message?: string }
export function mapFirebaseError(err: unknown): string {
  if (!err) return 'An unknown error occurred';
  const { code, message } = (err as FirebaseLikeError);
  const lookup = code || message || '';
  if (typeof lookup === 'string') {
    if (lookup.includes('auth/user-not-found')) return 'No account found for this email.';
    if (lookup.includes('auth/wrong-password')) return 'Incorrect password. Please try again.';
    if (lookup.includes('auth/invalid-email')) return 'The email address is not valid.';
    if (lookup.includes('auth/user-disabled')) return 'This account has been disabled. Contact support.';
    if (lookup.includes('auth/too-many-requests')) return 'Too many attempts. Please wait and try again later.';
    if (lookup.includes('auth/popup-closed-by-user')) return 'Sign-in popup was closed. Please try again.';
    if (lookup.includes('auth/requires-recent-login')) return 'Please sign in again to perform this action.';
    if (lookup.includes('api-key-not-valid') || lookup.includes('auth/network-request-failed')) return 'Network or configuration issue. Check your connection and API keys.';
  }
  return message || String(err);
}
