import React, { useMemo, useRef, useState } from 'react';
import { ChevronRight, LogOut, Check, Camera, Download, Trash2, Lock, BarChart3 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { useAnime } from '../context/AnimeContext';
import { useToast } from '../components/common/Toast';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

const TABS = ['Profile', 'Account', 'Appearance', 'Notifications', 'Privacy'];

export default function SettingsPage() {
  const { user, accounts, logout, updateUser, switchAccount, changePassword, deleteAccount, exportAccountData } = useAuth();
  const { addToast } = useToast();
  const { preferences, updatePreferences, resetAllUserData, stats } = useAnime();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Profile');
  const [profileData, setProfileData] = useState({ username: user?.username || '', email: user?.email || '', bio: user?.bio || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [deletePassword, setDeletePassword] = useState('');

  const themeChoices = useMemo(() => ([
    { value: 'midnight', label: 'Midnight Red' },
    { value: 'ocean', label: 'Ocean Blue' },
    { value: 'violet', label: 'Neon Violet' }
  ]), []);

  const setProfileField = (key, value) => setProfileData((prev) => ({ ...prev, [key]: value }));
  const setPasswordField = (key, value) => setPasswordData((prev) => ({ ...prev, [key]: value }));

  const handleSwitch = (acc) => {
    const result = switchAccount(acc.id);
    if (result.success) {
      setProfileData({ username: acc.username, email: acc.email, bio: acc.bio || '' });
      addToast(`Switched to ${acc.username}`, 'success');
    }
  };

  const handleSave = () => {
    const result = updateUser(profileData);
    if (result.success) addToast('Profile updated successfully', 'success');
    else addToast(result.error || 'Could not update profile', 'info');
  };

  const handleChangePassword = () => {
    const result = changePassword(passwordData);
    if (result.success) {
      addToast('Password changed successfully', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else addToast(result.error || 'Could not change password', 'info');
  };

  const handleExportData = () => {
    const data = exportAccountData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `animex-${user?.username || 'account'}-data.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    addToast('Account data exported', 'success');
  };

  const handleDeleteAccount = () => {
    const result = deleteAccount(deletePassword);
    if (result.success) {
      addToast('Account deleted', 'success');
      navigate('/login');
    } else addToast(result.error || 'Could not delete account', 'info');
  };

  const handleAvatarPick = () => fileInputRef.current?.click();

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Please choose an image file.', 'info');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = updateUser({ avatar: reader.result });
      if (result.success) addToast('Profile picture updated', 'success');
      else addToast(result.error || 'Could not update avatar', 'info');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <Layout title="Settings">
      <div className="settings-page">
        <div className="settings-layout">
          <div className="settings-sidebar glass">
            <div className="settings-user-card">
              <div className="su-avatar-wrap">
                <img src={user?.avatar} alt={user?.username} className="su-avatar" />
                <button className="su-cam-btn" onClick={handleAvatarPick}><Camera size={14} /></button>
              </div>
              <div>
                <p className="su-name">{user?.username}</p>
                <p className="su-email">{user?.email}</p>
                <span className={`badge ${user?.plan === 'Premium' ? 'badge-orange' : 'badge-blue'}`} style={{ marginTop: 4 }}>{user?.plan}</span>
              </div>
            </div>

            <nav className="settings-nav">
              {TABS.map((tab) => (
                <button key={tab} className={`settings-nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  <span>{tab}</span>
                  <ChevronRight size={14} />
                </button>
              ))}
            </nav>

            <button className="settings-logout-btn" onClick={() => { logout(); navigate('/login'); }}>
              <LogOut size={15} /> Sign Out
            </button>
          </div>

          <div className="settings-content">
            {activeTab === 'Profile' && (
              <section className="settings-section">
                <h2 className="settings-section-title">Profile</h2>
                <div className="settings-card glass">
                  <div className="profile-avatar-section">
                    <img src={user?.avatar} alt="" className="profile-big-avatar" />
                    <div>
                      <p className="pal-name">{user?.username}</p>
                      <p className="pal-sub">Member since {user?.joinDate}</p>
                      <button type="button" className="btn btn-ghost" style={{ marginTop: 10, fontSize: '0.82rem', padding: '7px 16px' }} onClick={handleAvatarPick}>Change Avatar</button>
                      <p className="avatar-hint">Pick any image from your device. AnimeX will remember it for this user.</p>
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden-file-input" onChange={handleAvatarChange} />
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Username</label>
                      <input className="input" value={profileData.username} onChange={(e) => setProfileField('username', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="input" type="email" value={profileData.email} onChange={(e) => setProfileField('email', e.target.value)} />
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Bio</label>
                      <textarea className="input settings-textarea" value={profileData.bio} onChange={(e) => setProfileField('bio', e.target.value)} placeholder="Tell us about yourself..." />
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                </div>

                <div className="settings-card glass" style={{ marginTop: 20 }}>
                  <h3 className="settings-sub-title"><BarChart3 size={16} /> Personal Stats</h3>
                  <div className="form-grid">
                    <StatBox label="Watchlist" value={stats.watchlistCount} />
                    <StatBox label="Hours Watched" value={`${stats.hoursWatched}h`} />
                    <StatBox label="Completed" value={stats.completedCount} />
                    <StatBox label="Downloads" value={stats.downloadsCount} />
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'Account' && (
              <section className="settings-section">
                <h2 className="settings-section-title">Account & Security</h2>
                <div className="settings-card glass">
                  <p className="settings-desc">Switch between available accounts. Newly created users also appear here.</p>
                  <div className="account-list">
                    {accounts.map((acc) => (
                      <div key={acc.id} className={`account-item ${acc.id === user?.id ? 'current' : ''}`}>
                        <img src={acc.avatar} alt={acc.username} className="acc-avatar" />
                        <div className="acc-info">
                          <p className="acc-name">{acc.username}</p>
                          <p className="acc-email">{acc.email}</p>
                          <span className={`badge ${acc.plan === 'Premium' ? 'badge-orange' : 'badge-blue'}`}>{acc.plan}</span>
                        </div>
                        {acc.id === user?.id ? <span className="acc-current"><Check size={14} /> Active</span> : <button className="btn btn-ghost acc-switch-btn" onClick={() => handleSwitch(acc)}>Switch</button>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="settings-card glass" style={{ marginTop: 20 }}>
                  <h3 className="settings-sub-title"><Lock size={16} /> Change Password</h3>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Current Password</label><input className="input" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordField('currentPassword', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">New Password</label><input className="input" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordField('newPassword', e.target.value)} /></div>
                    <div className="form-group full-width"><label className="form-label">Confirm New Password</label><input className="input" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordField('confirmPassword', e.target.value)} /></div>
                  </div>
                  <button className="btn btn-primary" onClick={handleChangePassword}>Update Password</button>
                </div>
              </section>
            )}

            {activeTab === 'Appearance' && (
              <section className="settings-section">
                <h2 className="settings-section-title">Appearance & Playback</h2>
                <div className="settings-card glass">
                  <SettingRow label="App Theme" desc="Change the neon theme of the platform">
                    <select className="input settings-select" value={preferences.theme} onChange={(e) => updatePreferences({ theme: e.target.value })}>
                      {themeChoices.map((theme) => <option key={theme.value} value={theme.value}>{theme.label}</option>)}
                    </select>
                  </SettingRow>
                  <SettingRow label="Default Quality" desc="Video quality for streaming">
                    <select className="input settings-select" value={preferences.quality} onChange={(e) => updatePreferences({ quality: e.target.value })}>
                      {['360p', '480p', '720p', '1080p', '4K'].map((q) => <option key={q}>{q}</option>)}
                    </select>
                  </SettingRow>
                  <SettingRow label="Language" desc="Interface language">
                    <select className="input settings-select" value={preferences.language} onChange={(e) => updatePreferences({ language: e.target.value })}>
                      {['English', 'Japanese', 'Spanish', 'French', 'German'].map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </SettingRow>
                  <SettingRow label="Auto-Play Next Episode" desc="Automatically play the next episode"><Toggle checked={preferences.autoPlay} onChange={(v) => updatePreferences({ autoPlay: v })} /></SettingRow>
                  <SettingRow label="Skip Intro" desc="Automatically skip OP/ED sequences"><Toggle checked={preferences.skipIntro} onChange={(v) => updatePreferences({ skipIntro: v })} /></SettingRow>
                  <SettingRow label="Show Subtitles" desc="Display subtitles by default"><Toggle checked={preferences.subtitles} onChange={(v) => updatePreferences({ subtitles: v })} /></SettingRow>
                </div>
              </section>
            )}

            {activeTab === 'Notifications' && (
              <section className="settings-section">
                <h2 className="settings-section-title">Notifications</h2>
                <div className="settings-card glass">
                  <SettingRow label="Push Notifications" desc="Get in-app alerts for downloads and updates"><Toggle checked={preferences.notifications} onChange={(v) => updatePreferences({ notifications: v })} /></SettingRow>
                  <SettingRow label="Email Notifications" desc="Receive episode alerts by email"><Toggle checked={preferences.emailNotif} onChange={(v) => updatePreferences({ emailNotif: v })} /></SettingRow>
                </div>
              </section>
            )}

            {activeTab === 'Privacy' && (
              <section className="settings-section">
                <h2 className="settings-section-title">Privacy & Data</h2>
                <div className="settings-card glass">
                  <div className="plan-card">
                    <div>
                      <p className="plan-name">Export account data</p>
                      <p className="plan-features">Download your profile, preferences, watchlist, history, and downloads as JSON.</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleExportData}><Download size={15} /> Export</button>
                  </div>
                  <div className="plan-card" style={{ marginTop: 14 }}>
                    <div>
                      <p className="plan-name">Reset app data</p>
                      <p className="plan-features">Clear this account's watchlist, history, downloads, and search history.</p>
                    </div>
                    <button className="btn btn-ghost" onClick={() => { resetAllUserData(); addToast('All local data cleared for this account', 'success'); }}><Trash2 size={15} /> Reset</button>
                  </div>
                </div>

                <div className="settings-card glass" style={{ marginTop: 20, borderColor: 'rgba(230,57,70,0.3)' }}>
                  <h3 className="settings-sub-title" style={{ color: 'var(--accent)' }}>Delete Account</h3>
                  <p className="settings-desc">This permanently removes this account and its locally saved data from AnimeX on this device.</p>
                  <div className="form-group" style={{ marginTop: 12 }}>
                    <label className="form-label">Confirm with password</label>
                    <input className="input" type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="Enter current password" />
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={handleDeleteAccount}>Delete Account</button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="setting-row">
      <div>
        <p className="setting-label">{label}</p>
        <p className="setting-desc">{desc}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="glass" style={{ padding: 18, borderRadius: 14 }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
      <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
    </div>
  );
}
