import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MOCK_ACCOUNTS } from '../data/animeData';

const AuthContext = createContext(null);
const ACCOUNTS_KEY = 'animex_accounts';
const USER_KEY = 'animex_user';

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const getStoredAccounts = () => {
  try {
    const saved = localStorage.getItem(ACCOUNTS_KEY);
    if (!saved) return MOCK_ACCOUNTS;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : MOCK_ACCOUNTS;
  } catch {
    return MOCK_ACCOUNTS;
  }
};

const getStoredUser = () => {
  try {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const createDefaultAvatar = (seed = 'user') =>
  `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;

export const AuthProvider = ({ children }) => {
  const [accounts, setAccounts] = useState(getStoredAccounts);
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const login = (email, password) => {
    const cleanEmail = normalizeEmail(email);
    const cleanPassword = password.trim();

    const found = accounts.find(
      (account) => normalizeEmail(account.email) === cleanEmail && account.password === cleanPassword
    );

    if (!found) {
      return { success: false, error: 'Invalid credentials' };
    }

    const { password: _password, ...safeUser } = found;
    setUser(safeUser);
    return { success: true, user: safeUser };
  };

  const register = ({ username, email, password }) => {
    const cleanUsername = username.trim();
    const cleanEmail = normalizeEmail(email);
    const cleanPassword = password.trim();

    if (cleanUsername.length < 3) {
      return { success: false, error: 'Username should be at least 3 characters.' };
    }

    if (!cleanEmail.includes('@')) {
      return { success: false, error: 'Enter a valid email address.' };
    }

    if (cleanPassword.length < 6) {
      return { success: false, error: 'Password should be at least 6 characters.' };
    }

    const emailExists = accounts.some((account) => normalizeEmail(account.email) === cleanEmail);
    if (emailExists) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newAccount = {
      id: Date.now(),
      username: cleanUsername,
      email: cleanEmail,
      password: cleanPassword,
      avatar: createDefaultAvatar(cleanUsername),
      role: 'user',
      joinDate: new Date().toISOString().slice(0, 10),
      plan: 'Free',
      bio: 'New to AnimeX ✨'
    };

    setAccounts((prev) => [newAccount, ...prev]);
    const { password: _password, ...safeUser } = newAccount;
    setUser(safeUser);
    return { success: true, user: safeUser };
  };

  const logout = () => setUser(null);

  const updateUser = (updates) => {
    if (!user) return { success: false, error: 'No active user found.' };

    const nextEmail = updates.email ? normalizeEmail(updates.email) : user.email;
    const duplicate = accounts.find(
      (account) => normalizeEmail(account.email) === nextEmail && account.id !== user.id
    );

    if (duplicate) {
      return { success: false, error: 'That email is already used by another account.' };
    }

    const sanitizedUpdates = {
      ...updates,
      ...(updates.email ? { email: nextEmail } : {})
    };

    setAccounts((prev) =>
      prev.map((account) =>
        account.id === user.id ? { ...account, ...sanitizedUpdates } : account
      )
    );
    setUser((prev) => ({ ...prev, ...sanitizedUpdates }));

    return { success: true };
  };

  const switchAccount = (accountId) => {
    const found = accounts.find((account) => account.id === accountId);
    if (!found) {
      return { success: false, error: 'Account not found.' };
    }

    const { password: _password, ...safeUser } = found;
    setUser(safeUser);
    return { success: true, user: safeUser };
  };

  const value = useMemo(
    () => ({ user, login, register, logout, updateUser, switchAccount, accounts }),
    [user, accounts]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
