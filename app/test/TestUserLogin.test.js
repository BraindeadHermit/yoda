TestUserLogin.test.js
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { loginUser } from '../auth/user-login';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Pulisce i mock prima di ogni test
beforeEach(() => {
  vi.clearAllMocks();
});

// Mock di Firebase Auth
vi.mock('firebase/auth', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    getAuth: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
  };
});

describe('loginUser', () => {
  test('dovrebbe effettuare il login con credenziali valide', async () => {
    // 1) Prepara i mock
    const fakeAuth = { /* fake auth object */ };
    const fakeUserCredential = {
      uid: 'user123',
      email: 'test@example.com',
    };

    getAuth.mockReturnValue(fakeAuth);
    signInWithEmailAndPassword.mockResolvedValue(fakeUserCredential);

    // 2) Invoca la funzione
    const result = await loginUser('test@example.com', 'password123');

    // 3) Asserzioni
    expect(result).toEqual({
      success: true,
      userId: fakeUserCredential.uid,
      email: fakeUserCredential.email,
    });

    expect(getAuth).toHaveBeenCalledTimes(1);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(fakeAuth, 'test@example.com', 'password123');
  });

  test('dovrebbe gestire un errore di login', async () => {
    // 1) Prepara i mock per simulare un errore
    const fakeAuth = { /* fake auth object */ };
    const errorMessage = 'Credenziali non valide';

    getAuth.mockReturnValue(fakeAuth);
    signInWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

    // 2) Invoca la funzione
    const result = await loginUser('test@example.com', 'wrongpassword');

    // 3) Asserzioni
    expect(result).toEqual({
      success: false,
      error: errorMessage,
    });

    expect(getAuth).toHaveBeenCalledTimes(1);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(fakeAuth, 'test@example.com', 'wrongpassword');
  });

  test('dovrebbe gestire un errore imprevisto', async () => {
    // 1) Prepara i mock per simulare un errore generico
    const fakeAuth = { /* fake auth object */ };
    getAuth.mockReturnValue(fakeAuth);
    signInWithEmailAndPassword.mockImplementation(() => {
      throw new Error('Errore generico');
    });

    // 2) Invoca la funzione
    const result = await loginUser('test@example.com', 'password123');

    // 3) Asserzioni
    expect(result).toEqual({
      success: false,
      error: 'Errore generico',
    });

    expect(getAuth).toHaveBeenCalledTimes(1);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(fakeAuth, 'test@example.com', 'password123');
  });
});