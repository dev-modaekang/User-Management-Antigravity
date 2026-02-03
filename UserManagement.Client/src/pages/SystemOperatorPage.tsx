import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../api';
import type { User } from '../api';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const SystemOperatorPage: React.FC = () => {
    const [operators, setOperators] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadOperators();
    }, []);

    const loadOperators = async () => {
        try {
            const data = await getUsers();
            // Filter only Admins and Technicians
            const systemUsers = data.filter(u => u.role === 'Admin' || u.role === 'Technician');
            setOperators(systemUsers);
        } catch (error) {
            console.error('Failed to load operators:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="header-actions">
                <h1>System Operators</h1>
                <p style={{ color: '#64748b' }}>Manage administrators and technicians who have access to this system.</p>
            </div>

            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Account</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {operators.map(op => (
                                <tr key={op.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                backgroundColor: op.role === 'Admin' ? '#fee2e2' : '#ffedd5',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: op.role === 'Admin' ? '#dc2626' : '#ea580c'
                                            }}>
                                                {op.role === 'Admin' ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{op.firstName} {op.lastName}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{op.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{op.account}</td>
                                    <td>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: op.role === 'Admin' ? '#fef2f2' : '#fff7ed',
                                            color: op.role === 'Admin' ? '#b91c1c' : '#c2410c'
                                        }}>{op.role}</span>
                                    </td>
                                    <td>{op.userStatus}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => navigate(`/system-operators/modify/${op.id}`)}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SystemOperatorPage;
