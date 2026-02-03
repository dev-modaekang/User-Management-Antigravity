import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../api';
import type { User } from '../api';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Search, User as UserIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const MainPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    // Admin: All access.
    // Technician: View, Edit, Delete, Create (Requested update).
    // User: Blocked at App level, but read-only here as safeguard.
    const canCreate = currentUser?.role === 'Admin' || currentUser?.role === 'Technician';
    const canManage = currentUser?.role === 'Admin' || currentUser?.role === 'Technician';

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
        let results = users;
        if (search) {
            const lower = search.toLowerCase();
            results = users.filter(u =>
                u.firstName.toLowerCase().includes(lower) ||
                u.lastName.toLowerCase().includes(lower) ||
                u.email.toLowerCase().includes(lower)
            );
        }
        setFilteredUsers(results);
        setCurrentPage(1); // Reset to first page on search
    }, [search, users]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleDelete = async () => {
        if (!canManage) return;
        if (selectedId) {
            if (window.confirm('Are you sure you want to delete this user?')) {
                await deleteUser(selectedId);
                loadUsers();
                setSelectedId(null);
            }
        }
    };

    const handleRowClick = (id: number) => {
        if (canManage) {
            setSelectedId(id);
        }
    };

    const handleRowDoubleClick = (id: number) => {
        if (canManage) {
            navigate(`/modify/${id}`);
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
                    {canCreate && (
                        <button className="btn btn-primary" onClick={() => navigate('/add')}>
                            <Plus size={18} /> Add User
                        </button>
                    )}
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
                        {paginatedUsers.length > 0 ? paginatedUsers.map(user => (
                            <tr
                                key={user.id}
                                className={selectedId === user.id ? 'selected' : ''}
                                onClick={() => handleRowClick(user.id!)}
                                onDoubleClick={() => handleRowDoubleClick(user.id!)}
                                style={{ cursor: canManage ? 'pointer' : 'default' }}
                            >
                                <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserIcon size={16} /> {user.firstName} {user.lastName}</div></td>
                                <td>{user.email}</td>
                                <td><span style={{
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    background: user.role === 'Admin' ? '#fef2f2' : user.role === 'Technician' ? '#fff7ed' : '#f0fdf4',
                                    color: user.role === 'Admin' ? '#b91c1c' : user.role === 'Technician' ? '#c2410c' : '#15803d'
                                }}>{user.role}</span></td>
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

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="btn btn-outline btn-sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        >
                            <ChevronLeft size={16} /> Prev
                        </button>
                        <span className="page-info">
                            Page <strong>{currentPage}</strong> of {totalPages}
                        </span>
                        <button
                            className="btn btn-outline btn-sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {selectedId && canManage && (
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
