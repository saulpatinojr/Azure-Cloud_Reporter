import { emailSignIn, passwordReset, performSignOut } from '../auth/authLogic';

// Mock Firebase auth functions to avoid real network calls
jest.mock('../lib/firebase', () => ({
  getAuthSafe: jest.fn(() => ({}))
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  signOut: jest.fn()
}));

const mockSignInWithEmailAndPassword = require('firebase/auth').signInWithEmailAndPassword;
const mockSendPasswordResetEmail = require('firebase/auth').sendPasswordResetEmail;
const mockSignOut = require('firebase/auth').signOut;

describe('Auth Flow Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // Suppress error logs in tests
  });

  describe('emailSignIn', () => {
    it('calls signInWithEmailAndPassword with correct parameters', async () => {
      mockSignInWithEmailAndPassword.mockResolvedValueOnce({ user: { email: 'test@example.com' } });
      
      await emailSignIn('test@example.com', 'password123');
      
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        {}, // mocked auth instance
        'test@example.com',
        'password123'
      );
    });

    it('throws error when signInWithEmailAndPassword fails', async () => {
      const error = new Error('Invalid credentials');
      mockSignInWithEmailAndPassword.mockRejectedValueOnce(error);
      
      await expect(emailSignIn('test@example.com', 'wrongpass')).rejects.toThrow('Invalid credentials');
      expect(console.error).toHaveBeenCalledWith('Error signing in with email:', error);
    });
  });

  describe('passwordReset', () => {
    it('calls sendPasswordResetEmail with correct parameters', async () => {
      mockSendPasswordResetEmail.mockResolvedValueOnce(undefined);
      
      await passwordReset('test@example.com');
      
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(
        {}, // mocked auth instance
        'test@example.com'
      );
    });

    it('throws error when sendPasswordResetEmail fails', async () => {
      const error = new Error('User not found');
      mockSendPasswordResetEmail.mockRejectedValueOnce(error);
      
      await expect(passwordReset('nonexistent@example.com')).rejects.toThrow('User not found');
      expect(console.error).toHaveBeenCalledWith('Error sending password reset email:', error);
    });
  });

  describe('performSignOut', () => {
    it('calls signOut successfully', async () => {
      mockSignOut.mockResolvedValueOnce(undefined);
      
      await performSignOut();
      
      expect(mockSignOut).toHaveBeenCalledWith({});
    });

    it('throws error when signOut fails', async () => {
      const error = new Error('Sign out failed');
      mockSignOut.mockRejectedValueOnce(error);
      
      await expect(performSignOut()).rejects.toThrow('Sign out failed');
      expect(console.error).toHaveBeenCalledWith('Error signing out:', error);
    });
  });
});