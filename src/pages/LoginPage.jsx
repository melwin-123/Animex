import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, accounts } = useAuth();
  const navigate = useNavigate();

  const quickAccounts = useMemo(() => accounts.slice(0, 4), [accounts]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = login(loginData.email, loginData.password);
    if (result.success) {
      navigate('/');
      return;
    }
    setError(result.error || 'Invalid email or password.');
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = register(signupData);
    if (result.success) {
      navigate('/');
      return;
    }
    setError(result.error || 'Could not create the account.');
    setLoading(false);
  };

  const quickLogin = (acc) => {
    setMode('login');
    setError('');
    setLoginData({ email: acc.email, password: '' });
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-orb orb1" />
        <div className="login-bg-orb orb2" />
        <div className="login-bg-orb orb3" />
        <div className="login-grid" />
      </div>

      <div className="login-card glass login-card-lg">
        <div className="login-logo">
          <span className="ll-anime">ANIME</span><span className="ll-x">X</span>
        </div>
        <p className="login-tagline">Create your profile, log in anytime, and keep your AnimeX account remembered.</p>

        <div className="auth-switcher">
          <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>
            Login
          </button>
          <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); setError(''); }}>
            Create Account
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@animex.com"
                value={loginData.email}
                onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="pw-wrap">
                <input
                  className="input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button className="btn btn-primary login-submit-btn" type="submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="input"
                type="text"
                placeholder="Your anime nickname"
                value={signupData.username}
                onChange={(e) => setSignupData((prev) => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@animex.com"
                value={signupData.email}
                onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="pw-wrap">
                <input
                  className="input"
                  type={showSignupPw ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={signupData.password}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
                <button type="button" className="pw-toggle" onClick={() => setShowSignupPw(!showSignupPw)}>
                  {showSignupPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="pw-wrap">
                <input
                  className="input"
                  type={showConfirmPw ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
                <button type="button" className="pw-toggle" onClick={() => setShowConfirmPw(!showConfirmPw)}>
                  {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button className="btn btn-primary login-submit-btn" type="submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : <><UserPlus size={16} /> Create Account</>}
            </button>
          </form>
        )}

        <div className="login-divider"><span>Quick Access</span></div>

        <div className="quick-accounts">
          {quickAccounts.map((acc) => (
            <button key={acc.id} type="button" className="qa-item" onClick={() => quickLogin(acc)}>
              <img src={acc.avatar} alt={acc.username} />
              <div className="qa-info">
                <span className="qa-name">{acc.username}</span>
                <span className={`qa-plan ${acc.plan === 'Premium' ? 'premium' : ''}`}>
                  {acc.plan === 'Premium' ? '★ ' : ''}{acc.plan}
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="login-hint">Quick access fills the email. Enter that account password and sign in.</p>
      </div>

      <div className="login-ticker">
        {['Attack on Titan','Demon Slayer','Jujutsu Kaisen','One Piece','Chainsaw Man','FMA Brotherhood','Spy x Family','Hunter x Hunter','Vinland Saga','Frieren','Bleach TYBW','Mushoku Tensei'].map((t, i) => (
          <span key={i} className="ticker-item">{t}</span>
        ))}
      </div>
    </div>
  );
}
