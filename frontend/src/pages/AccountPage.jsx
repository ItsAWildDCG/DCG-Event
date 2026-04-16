import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function AccountPage() {
  const { user, updateAccount, changePassword } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [profileStatus, setProfileStatus] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setProfile({ name: user?.name || '', email: user?.email || '' });
  }, [user]);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileStatus('');
    setProfileError('');
    setSavingProfile(true);

    try {
      await updateAccount(profile.name, profile.email);
      setProfileStatus('Account updated.');
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordStatus('');
    setPasswordError('');
    setSavingPassword(true);

    try {
      await changePassword(passwords.currentPassword, passwords.newPassword);
      setPasswordStatus('Password updated.');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <section className="stacked-panel">
      <div className="hero-card card">
        <p className="kicker">Account Settings</p>
        <h1>Manage profile and password</h1>
      </div>

      <div className="grid two-up">
        <div className="card form-card">
          <h2>Profile</h2>
          <form className="form-grid" onSubmit={handleProfileSubmit}>
            <label>
              Name
              <input
                value={profile.name}
                onChange={(e) => setProfile((s) => ({ ...s, name: e.target.value }))}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((s) => ({ ...s, email: e.target.value }))}
                required
              />
            </label>
            {profileStatus ? <p className="success">{profileStatus}</p> : null}
            {profileError ? <p className="error">{profileError}</p> : null}
            <button className="solid-btn" disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        <div className="card form-card">
          <h2>Password</h2>
          <form className="form-grid" onSubmit={handlePasswordSubmit}>
            <label>
              Current Password
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords((s) => ({ ...s, currentPassword: e.target.value }))}
                required
              />
            </label>
            <label>
              New Password
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords((s) => ({ ...s, newPassword: e.target.value }))}
                required
                minLength={6}
              />
            </label>
            {passwordStatus ? <p className="success">{passwordStatus}</p> : null}
            {passwordError ? <p className="error">{passwordError}</p> : null}
            <button className="solid-btn" disabled={savingPassword}>
              {savingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
