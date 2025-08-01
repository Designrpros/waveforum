// src/app/login/page.tsx
"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation'; // 1. Import the router

// Import Firebase authentication
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../lib/firebase';

// --- Styled Components (no changes here) ---
const Container = styled.div`
  max-width: 500px;
  margin: 4rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.25rem;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primaryBlue};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryBlue}33;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-radius: 9999px;
  background: ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.body};
  padding: 0.75rem 2rem;
  font-weight: 600;
  font-size: 1.1rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    border-color: ${({ theme }) => theme.text};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ToggleLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.subtleText};
  font-size: 0.9rem;
  margin-top: 1rem;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545; /* Red */
  font-size: 0.9rem;
  margin-top: 1rem;
`;

const SuccessMessage = styled.p`
  color: #28a745; /* Green */
  font-size: 0.9rem;
  margin-top: 1rem;
`;

const LoginPage: NextPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter(); // 2. Initialize the router
  const auth = getAuth(app);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      if (isLoginMode) {
        // Sign In
        await signInWithEmailAndPassword(auth, email, password);
        // 3. Redirect on successful login
        router.push('/dashboard'); 
      } else {
        // Register
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess('Registration successful! You can now log in.');
        setIsLoginMode(true);
      }
    } catch (firebaseError: any) {
      console.error('Auth Error:', firebaseError);
      let errorMessage = 'An unexpected error occurred.';
      // Using a simpler error message for better UX
      if (firebaseError.code.includes('auth/')) {
         errorMessage = 'Invalid email or password. Please try again.';
      }
      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      }
       if (firebaseError.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      setError(errorMessage);
    }
  };

  return (
    <>
      <Head>
        <title>{isLoginMode ? 'Login' : 'Register'} - WaveForum Artist Portal</title>
        <meta name="description" content={`WaveForum artist ${isLoginMode ? 'login' : 'registration'} page.`} />
      </Head>
      <Container>
        <Title>{isLoginMode ? 'Login to WaveForum' : 'Register for WaveForum'}</Title>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isLoginMode ? "current-password" : "new-password"}
            />
          </div>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <Button type="submit">
            {isLoginMode ? 'Login' : 'Register'}
          </Button>
        </Form>
        <ToggleLink onClick={() => setIsLoginMode(!isLoginMode)}>
          {isLoginMode ? 'Need an account? Register here.' : 'Already have an account? Login here.'}
        </ToggleLink>
      </Container>
    </>
  );
};

export default LoginPage;