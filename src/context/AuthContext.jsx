import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MOCK_ACCOUNTS } from '../data/animeData';
import { readJSON, removeKey, userScopedKey, writeJSON } from '../utils/storage';

const AuthContext = createContext(null);
const ACCOUNTS_KEY = 'animex_accounts';
const USER_KEY = 'animex_user';

const normalizeEmail = (email = '') => email.trim().toLowerCase();
const createDefaultAvatar = (seed = 'user') =>
  `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;

const getStoredAccounts = () => {
  const stored = readJSON(ACCOUNTS_KEY, null);
  return Array.isArray(stored) && stored.length ? stored : MOCK_ACCOUNTS;
};

const getStoredUser = () => readJSON(USER_KEY, null);

export const AuthProvider = ({ children }) => {
  const [accounts, setAccounts] = useState(getStoredAccounts);
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    writeJSON(ACCOUNTS_KEY, accounts);
  }, [accounts]);

  useEffect(() => {
    if (user) writeJSON(USER_KEY, user);
    else removeKey(USER_KEY);
  }, [user]);

  const login = (email, password) => {
    const cleanEmail = normalizeEmail(email);
    const cleanPassword = password.trim();

    const found = accounts.find(
      (account) => normalizeEmail(account.email) === cleanEmail && account.password === cleanPassword
    );

    if (!found) return { success: false, error: 'Invalid credentials' };

    const { password: _password, ...safeUser } = found;
    setUser(safeUser);
    return { success: true, user: safeUser };
  };

  const register = ({ username, email, password }) => {
    const cleanUsername = username.trim();
    const cleanEmail = normalizeEmail(email);
    const cleanPassword = password.trim();

    if (cleanUsername.length < 3) return { success: false, error: 'Username should be at least 3 characters.' };
    if (!cleanEmail.includes('@')) return { success: false, error: 'Enter a valid email address.' };
    if (cleanPassword.length < 6) return { success: false, error: 'Password should be at least 6 characters.' };
    if (accounts.some((account) => normalizeEmail(account.email) === cleanEmail)) {
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

    if (duplicate) return { success: false, error: 'That email is already used by another account.' };

    if (updates.username && updates.username.trim().length < 3) {
      return { success: false, error: 'Username should be at least 3 characters.' };
    }

    const sanitizedUpdates = {
      ...updates,
      ...(updates.username ? { username: updates.username.trim() } : {}),
      ...(updates.email ? { email: nextEmail } : {})
    };

    setAccounts((prev) => prev.map((account) => (account.id === user.id ? { ...account, ...sanitizedUpdates } : account)));
    setUser((prev) => ({ ...prev, ...sanitizedUpdates }));
    return { success: true };
  };

  const changePassword = ({ currentPassword, newPassword, confirmPassword }) => {
    if (!user) return { success: false, error: 'No active user found.' };
    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: 'Fill in all password fields.' };
    }
    if (newPassword.length < 6) return { success: false, error: 'New password should be at least 6 characters.' };
    if (newPassword !== confirmPassword) return { success: false, error: 'New passwords do not match.' };

    const currentAccount = accounts.find((account) => account.id === user.id);
    if (!currentAccount || currentAccount.password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    setAccounts((prev) => prev.map((account) => (account.id === user.id ? { ...account, password: newPassword } : account)));
    return { success: true };
  };

  const deleteAccount = (password) => {
    if (!user) return { success: false, error: 'No active user found.' };

    const currentAccount = accounts.find((account) => account.id === user.id);
    if (!currentAccount || currentAccount.password !== password) {
      return { success: false, error: 'Password is incorrect.' };
    }

    ['watchlist', 'history', 'downloads', 'recent_searches', 'preferences'].forEach((suffix) =>
      removeKey(userScopedKey(user.id, suffix))
    );

    setAccounts((prev) => prev.filter((account) => account.id !== user.id));
    setUser(null);
    return { success: true };
  };

  const switchAccount = (accountId) => {
    const found = accounts.find((account) => account.id === accountId);
    if (!found) return { success: false, error: 'Account not found.' };
    const { password: _password, ...safeUser } = found;
    setUser(safeUser);
    return { success: true, user: safeUser };
  };

  const exportAccountData = () => {
    if (!user) return null;
    return {
      profile: user,
      watchlist: readJSON(userScopedKey(user.id, 'watchlist'), []),
      history: readJSON(userScopedKey(user.id, 'history'), []),
      downloads: readJSON(userScopedKey(user.id, 'downloads'), []),
      recentSearches: readJSON(userScopedKey(user.id, 'recent_searches'), []),
      preferences: readJSON(userScopedKey(user.id, 'preferences'), {})
    };
  };

  const value = useMemo(
    () => ({
      user,
      accounts,
      login,
      register,
      logout,
      updateUser,
      changePassword,
      deleteAccount,
      switchAccount,
      exportAccountData
    }),
    [user, accounts]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
