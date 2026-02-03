import React from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AccessDeniedPage: React.FC = () => {
    const { logout } = useAuth();

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                padding: '3rem',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                maxWidth: '500px'
            }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem auto'
                }}>
                    <ShieldAlert size={40} />
                </div>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 600 }}>Access Denied</h1>
                <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '2rem' }}>
                    You do not have permission to access this application. <br />
                    Please contact the <strong>IT TEAM</strong> if you believe this is an error.
                </p>
                <div style={{ borderTop: '1px solid rgba(255,5,255,0.1)', paddingTop: '1.5rem' }}>
                    <button
                        onClick={logout}
                        className="btn"
                        style={{
                            background: 'white', color: '#0f172a', padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            border: 'none', cursor: 'pointer'
                        }}
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessDeniedPage;
