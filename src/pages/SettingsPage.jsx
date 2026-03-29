import React, { useRef, useState } from 'react';
import { ChevronRight, LogOut, Check, Camera } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

const TABS = ['Profile', 'Account', 'Appearance', 'Notifications', 'Privacy'];

export default function SettingsPage() {
  const { user, accounts, logout, updateUser, switchAccount } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Profile');
  const [settings, setSettings] = useState({
    quality: '1080p',
    language: 'English',
    autoPlay: true,
    skipIntro: false,
    subtitles: true,
    notifications: true,
    emailNotif: false,
  });
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  const set = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));
  const pd = (key, value) => setProfileData(prev => ({ ...prev, [key]: value }));

  const handleSwitch = (acc) => {
    const result = switchAccount(acc.id);
    if (result.success) {
      setProfileData({
        username: acc.username,
        email: acc.email,
        bio: acc.bio || ''
      });
      addToast(`Switched to ${acc.username}`, 'success');
    }
  };

  const handleSave = () => {
    const result = updateUser(profileData);
    if (result.success) addToast('Profile updated successfully', 'success');
    else addToast(result.error || 'Could not update profile', 'info');
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
                <button className="su-cam-btn" onClick={handleAvatarPick}><Camera size={14}/></button>
              </div>
              <div>
                <p className="su-name">{user?.username}</p>
                <p className="su-email">{user?.email}</p>
                <span className={`badge ${user?.plan === 'Premium' ? 'badge-orange' : 'badge-blue'}`} style={{marginTop:4}}>{user?.plan}</span>
              </div>
            </div>

            <nav className="settings-nav">
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`settings-nav-item ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span>{tab}</span>
                  <ChevronRight size={14} />
                </button>
              ))}
            </nav>

            <button className="settings-logout-btn" onClick={() => { logout(); navigate('/login'); }}>
              <LogOut size={15}/> Sign Out
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
                      <button type="button" className="btn btn-ghost" style={{marginTop:10,fontSize:'0.82rem',padding:'7px 16px'}} onClick={handleAvatarPick}>Change Avatar</button>
                      <p className="avatar-hint">Pick any image from your device. AnimeX will remember it for this user.</p>
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden-file-input" onChange={handleAvatarChange} />
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Username</label>
                      <input className="input" value={profileData.username} onChange={e=>pd('username',e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="input" type="email" value={profileData.email} onChange={e=>pd('email',e.target.value)} />
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Bio</label>
                      <textarea className="input settings-textarea" value={profileData.bio} onChange={e=>pd('bio',e.target.value)} placeholder="Tell us about yourself..." />
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                </div>
              </section>
            )}

            {activeTab === 'Account' && (
              <section className="settings-section">
                <h2 className="settings-section-title">Account Switching</h2>
                <div className="settings-card glass">
                  <p className="settings-desc">Switch between available accounts. Newly created users will also appear here.</p>
                  <div className="account-list">
                    {accounts.map(acc => (
                      <div key={acc.id} className={`account-item ${acc.id === user?.id ? 'current' : ''}`}>
                        <img src={acc.avatar} alt={acc.username} className="acc-avatar" />
                        <div className="acc-info">
                          <p className="acc-name">{acc.username}</p>
                          <p className="acc-email">{acc.email}</p>
                          <span className={`badge ${acc.plan === 'Premium' ? 'badge-orange' : 'badge-blue'}`}>{acc.plan}</span>
                        </div>
                        {acc.id === user?.id ? (
                          <span className="acc-current"><Check size={14}/> Active</span>
                        ) : (
                          <button className="btn btn-ghost acc-switch-btn" onClick={() => handleSwitch(acc)}>Switch</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="settings-card glass" style={{marginTop:20}}>
                  <h3 className="settings-sub-title">Subscription</h3>
                  <div className="plan-card">
                    <div>
                      <p className="plan-name">{user?.plan} Plan</p>
                      <p className="plan-features">{user?.plan === 'Premium' ? '4K · No Ads · Offline · All Content' : 'HD · Ads · Limited Content'}</p>
                    </div>
                    {user?.plan === 'Free' && <button className="btn btn-primary">Upgrade</button>}
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'Appearance' && (
              <section className="settings-section">
                <h2 className="settings-section-title">Appearance & Playback</h2>
                <div className="settings-card glass">
                  <SettingRow label="Default Quality" desc="Video quality for streaming">
                    <select className="input settings-select" value={settings.quality} onChange={e=>set('quality',e.target.value)}>
                      {['360p','480p','720p','1080p','4K'].map(q=><option key={q}>{q}</option>)}
                    </select>
                  </SettingRow>
                  <SettingRow label="Language" desc="Interface language">
                    <select className="input settings-select" value={settings.language} onChange={e=>set('language',e.target.value)}>
                      {['English','Japanese','Spanish','French','German'].map(l=><option key={l}>{l}</option>)}
                    </select>
                  </SettingRow>
                  <SettingRow label="Auto-Play Next Episode" desc="Automatically play the next episode">
                    <Toggle checked={settings.autoPlay} onChange={v=>set('autoPlay',v)} />
                  </SettingRow>
                  <SettingRow label="Skip Intro" desc="Automatically skip OP/ED sequences">
                    <Toggle checked={settings.skipIntro} onChange={v=>set('skipIntro',v)} />
                  </SettingRow>
                  <SettingRow label="Show Subtitles" desc="Display subtitles by default">
                    <Toggle checked={settings.subtitles} onChange={v=>set('subtitles',v)} />
                  </SettingRow>
                </div>
              </section>
            )}

            {activeTab === 'Notifications' && (
              <section className="settings-section">
                <h2 className="settings-section-title">Notifications</h2>
                <div className="settings-card glass">
                  <SettingRow label="Push Notifications" desc="Get notified about new episodes">
                    <Toggle checked={settings.notifications} onChange={v=>set('notifications',v)} />
                  </SettingRow>
                  <SettingRow label="Email Notifications" desc="Weekly digest and new releases">
                    <Toggle checked={settings.emailNotif} onChange={v=>set('emailNotif',v)} />
                  </SettingRow>
                  <SettingRow label="Watchlist Updates" desc="New episodes for watchlisted anime">
                    <Toggle checked={true} onChange={()=>{}} />
                  </SettingRow>
                  <SettingRow label="Trending Alerts" desc="When your favorite is trending">
                    <Toggle checked={false} onChange={()=>{}} />
                  </SettingRow>
                </div>
              </section>
            )}

            {activeTab === 'Privacy' && (
              <section className="settings-section">
                <h2 className="settings-section-title">Privacy & Security</h2>
                <div className="settings-card glass">
                  <SettingRow label="Public Profile" desc="Let others see your watchlist">
                    <Toggle checked={false} onChange={()=>{}} />
                  </SettingRow>
                  <SettingRow label="Activity Status" desc="Show when you're online">
                    <Toggle checked={true} onChange={()=>{}} />
                  </SettingRow>
                  <SettingRow label="Save Watch History" desc="Track what you've watched">
                    <Toggle checked={true} onChange={()=>{}} />
                  </SettingRow>
                </div>
                <div className="settings-card glass" style={{marginTop:20}}>
                  <h3 className="settings-sub-title" style={{color:'var(--accent)'}}>Danger Zone</h3>
                  <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:14}}>
                    <button className="btn btn-ghost" style={{color:'var(--accent)',borderColor:'var(--border-accent)',justifyContent:'flex-start'}}>Clear Watch History</button>
                    <button className="btn btn-ghost" style={{color:'var(--accent)',borderColor:'var(--border-accent)',justifyContent:'flex-start'}}>Delete All Downloads</button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="setting-row">
      <div>
        <p className="setting-label">{label}</p>
        {desc && <p className="setting-desc">{desc}</p>}
      </div>
      <div className="setting-control">{children}</div>
    </div>
  );
}
