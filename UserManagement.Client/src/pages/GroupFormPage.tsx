import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createGroup, getGroup, updateGroup, getUsers } from '../api';
import type { Group, User } from '../api';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

const GroupFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | string>('');
    const [members, setMembers] = useState<{ id: number, name: string }[]>([]);
    const [formData, setFormData] = useState<Group>({
        groupName: '',
        type: 'Security',
        department: 'IT'
    });

    useEffect(() => {
        getUsers().then(setAllUsers).catch(console.error);
        if (isEdit && id) {
            getGroup(Number(id)).then(data => {
                setFormData({
                    groupName: data.groupName,
                    type: data.type,
                    department: data.department
                });
                if (data.members) {
                    setMembers(data.members.map(m => ({ id: m.id, name: `${m.firstName} ${m.lastName}` })));
                }
            }).catch(console.error);
        }
    }, [isEdit, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddUser = () => {
        if (!selectedUserId) return;
        const userToAdd = allUsers.find(u => u.id === Number(selectedUserId));
        if (userToAdd && !members.find(m => m.id === userToAdd.id)) {
            setMembers([...members, { id: userToAdd.id!, name: `${userToAdd.firstName} ${userToAdd.lastName}` }]);
            setSelectedUserId('');
        }
    };

    const handleRemoveUser = (userId: number) => {
        setMembers(members.filter(m => m.id !== userId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const groupData = {
                ...formData,
                memberIds: members.map(m => m.id)
            };

            if (isEdit && id) {
                await updateGroup(Number(id), groupData);
            } else {
                await createGroup(groupData);
            }
            navigate('/groups');
        } catch (error) {
            console.error('Error saving group:', error);
            alert('Failed to save group.');
        }
    };

    return (
        <div className="container">
            <div className="header-actions">
                <button onClick={() => navigate('/groups')} className="btn btn-outline">
                    <ArrowLeft size={16} /> Back to List
                </button>
                <h1>{isEdit ? 'Modify Group' : 'Create New Group'}</h1>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="grid-form">
                        <div className="form-group">
                            <label className="form-label">Group Name</label>
                            <input name="groupName" className="form-control" value={formData.groupName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                                <option value="Security">Security</option>
                                <option value="Distribution">Distribution</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <select name="department" className="form-control" value={formData.department} onChange={handleChange}>
                                <option value="IT">IT</option>
                                <option value="HR">HR</option>
                                <option value="Sales">Sales</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Accounting">Accounting</option>
                                <option value="Operation">Operation</option>
                                <option value="Customer Service">Customer Service</option>
                                <option value="Global">Global</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label className="form-label">Manage Members</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <select
                                className="form-control"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                            >
                                <option value="">Select a user...</option>
                                {allUsers.map(u => (
                                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
                                ))}
                            </select>
                            <button type="button" className="btn btn-primary" onClick={handleAddUser}>
                                <Plus size={18} /> Add User
                            </button>
                        </div>

                        <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '1rem', minHeight: '100px', backgroundColor: '#f8fafc' }}>
                            {members.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {members.map(m => (
                                        <div key={m.id} className="member-tag">
                                            {m.name}
                                            <span onClick={() => handleRemoveUser(m.id)} className="badge-red">
                                                <X size={12} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '1.5rem' }}>No members added yet.</div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                            <Save size={18} /> {isEdit ? 'Update Group' : 'Create Group'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GroupFormPage;
