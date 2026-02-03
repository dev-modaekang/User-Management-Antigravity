import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../api';
import type { User } from '../api';
import { Plus, Trash2, Search, User as UserIcon } from 'lucide-react';

const MainPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    };

    useEffect(() => {
        if (!search) {
            setFilteredUsers(users);
        } else {
            const lower = search.toLowerCase();
            setFilteredUsers(users.filter(u =>
                u.firstName.toLowerCase().includes(lower) ||
                u.lastName.toLowerCase().includes(lower) ||
                u.email.toLowerCase().includes(lower)
            ));
        }
    }, [search, users]);

    const handleDelete = async () => {
        if (selectedId) {
            if (confirm('Are you sure you want to delete this user?')) {
                await deleteUser(selectedId);
                loadUsers();
                setSelectedId(null);
            }
        }
    };

    return (
        <div className="container">
            <div className="header-actions">
                <h1>User Management</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            className="form-control search-bar"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/add')}>
                        <Plus size={18} /> Add User
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Department</th>
                            <th>Manager</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? filteredUsers.map(user => (
                            <tr
                                key={user.id}
                                className={selectedId === user.id ? 'selected' : ''}
                                onClick={() => setSelectedId(user.id!)}
                                onDoubleClick={() => navigate(`/modify/${user.id}`)}
                            >
                                <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserIcon size={16} /> {user.firstName} {user.lastName}</div></td>
                                <td>{user.email}</td>
                                <td><span style={{
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    background: user.accountType === 'User' ? '#eff6ff' : '#f0fdf4',
                                    color: user.accountType === 'User' ? '#1d4ed8' : '#15803d'
                                }}>{user.accountType}</span></td>
                                <td><span style={{ color: user.userStatus === 'Active' ? '#16a34a' : '#94a3b8' }}>● {user.userStatus}</span></td>
                                <td>{user.department}</td>
                                <td>{user.managerName || '-'}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedId && (
                <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', animation: 'fadeIn 0.3s' }}>
                    <button className="btn btn-danger" onClick={handleDelete} style={{ padding: '0.75rem 1.5rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}>
                        <Trash2 size={18} /> Delete Selected User
                    </button>
                </div>
            )}
        </div>
    );
};

export default MainPage;
