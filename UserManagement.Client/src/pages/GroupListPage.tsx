import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroups, deleteGroup } from '../api';
import type { Group } from '../api';
import { Plus, Trash2, Search, UsersRound } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const GroupListPage: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            const data = await getGroups();
            setGroups(data);
        } catch (error) {
            console.error('Failed to load groups:', error);
        }
    };

    const handleDelete = async () => {
        if (selectedId) {
            if (window.confirm('Are you sure you want to delete this group?')) {
                await deleteGroup(selectedId);
                loadGroups();
                setSelectedId(null);
            }
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const filteredGroups = groups.filter(g =>
        g.groupName.toLowerCase().includes(search.toLowerCase()) ||
        g.department.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
    const paginatedGroups = filteredGroups.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="container">
            <div className="header-actions">
                <h1>Group Management</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            className="form-control search-bar"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="Search groups..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/groups/add')}>
                        <Plus size={18} /> Add Group
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table>
                    <thead>
                        <tr>
                            <th>Group Name</th>
                            <th>Type</th>
                            <th>Department</th>
                            <th>Members</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedGroups.length > 0 ? paginatedGroups.map(group => (
                            <tr
                                key={group.id}
                                className={selectedId === group.id ? 'selected' : ''}
                                onClick={() => setSelectedId(group.id!)}
                                onDoubleClick={() => navigate(`/groups/modify/${group.id}`)}
                            >
                                <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UsersRound size={16} /> {group.groupName}</div></td>
                                <td>
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        background: group.type === 'Security' ? '#eff6ff' : '#f0fdf4',
                                        color: group.type === 'Security' ? '#1d4ed8' : '#15803d'
                                    }}>{group.type}</span>
                                </td>
                                <td>{group.department}</td>
                                <td>{group.memberCount} users</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No groups found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="pagination">
                    <button
                        className="btn btn-outline btn-sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Prev
                    </button>
                    <span className="page-info">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                        className="btn btn-outline btn-sm"
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>

            {selectedId && (
                <div style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
                    <button className="btn btn-danger" onClick={handleDelete}>
                        <Trash2 size={18} /> Delete Selected Group
                    </button>
                </div>
            )}
        </div>
    );
};

export default GroupListPage;
