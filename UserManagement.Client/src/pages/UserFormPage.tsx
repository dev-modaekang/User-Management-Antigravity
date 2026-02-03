import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createUser, getUser, getUsers, updateUser, getGroups } from '../api';
import type { User, Group } from '../api';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

const UserFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const isEdit = !!id;

    // Check for query params (e.g. ?type=System)
    const queryParams = new URLSearchParams(location.search);
    const initialType = queryParams.get('type'); // 'System' or null

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [allGroups, setAllGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | string>('');
    const [userGroups, setUserGroups] = useState<{ id: number; name: string }[]>([]);

    const [formData, setFormData] = useState<User>({
        firstName: '',
        lastName: '',
        userStatus: 'Active',
        accountType: initialType === 'System' ? 'System' : 'User',
        account: '',
        domain: initialType === 'System' ? 'system.local' : 'company.com',
        upn: '',
        email: '',
        password: '',
        jobTitle: initialType === 'System' ? 'Administrator' : '',
        company: 'MK CORE',
        description: '',
        managerName: '',
        department: 'IT',
        role: initialType === 'System' ? 'Technician' : 'User'
    });

    useEffect(() => {
        getUsers().then(setAllUsers).catch(console.error);
        getGroups().then(setAllGroups).catch(console.error);

        if (isEdit && id) {
            getUser(Number(id)).then(data => {
                setFormData(data);
                if (data.groups) {
                    setUserGroups(data.groups.map(g => ({ id: g.id, name: g.groupName })));
                }
            }).catch(console.error);
        }
    }, [isEdit, id]);

    // Auto-generate fields
    useEffect(() => {
        const account = `${formData.firstName}.${formData.lastName}`.toLowerCase();
        const upn = `${account}@${formData.domain}`;
        const email = upn;

        setFormData(prev => ({
            ...prev,
            account: formData.firstName && formData.lastName ? account : '',
            upn: formData.firstName && formData.lastName ? upn : '',
            email: formData.firstName && formData.lastName ? email : '',
        }));
    }, [formData.firstName, formData.lastName, formData.domain]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddGroup = () => {
        if (!selectedGroupId) return;
        const groupToAdd = allGroups.find(g => g.id === Number(selectedGroupId));
        if (groupToAdd && !userGroups.find(g => g.id === groupToAdd.id)) {
            setUserGroups([...userGroups, { id: groupToAdd.id!, name: groupToAdd.groupName }]);
            setSelectedGroupId('');
        }
    };

    const handleRemoveGroup = (groupId: number) => {
        setUserGroups(userGroups.filter(g => g.id !== groupId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Validate Password
            const pwd = formData.password;
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
            const hasUpper = /[A-Z]/.test(pwd);
            if (pwd.length < 16 || !hasSpecial || !hasUpper) {
                alert('Password must be at least 16 characters long and include at least one special character and one uppercase letter.');
                return;
            }

            const payload = {
                ...formData,
                groupIds: userGroups.map(g => g.id)
            };

            if (isEdit && id) {
                await updateUser(Number(id), payload);
            } else {
                await createUser(payload);
            }
            navigate('/');
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Failed to save user.');
        }
    };

    return (
        <div className="container">
            <div className="header-actions">
                <button onClick={() => navigate('/')} className="btn btn-outline">
                    <ArrowLeft size={16} /> Back to List
                </button>
                <h1>{isEdit ? 'Modify User' : 'Add New User'}</h1>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="grid-form">
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Account (Auto)</label>
                            <input name="account" className="form-control" value={formData.account} readOnly />
                        </div>

                        <div className="form-group">
                            <label className="form-label">User Status</label>
                            <select name="userStatus" className="form-control" value={formData.userStatus} onChange={handleChange}>
                                <option value="Active">Active</option>
                                <option value="Disable">Disable</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Account Type</label>
                            <select name="accountType" className="form-control" value={formData.accountType} onChange={handleChange}>
                                <option value="User">User</option>
                                <option value="Service">Service</option>
                                <option value="Consultant">Consultant</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Domain</label>
                            <select name="domain" className="form-control" value={formData.domain} onChange={handleChange}>
                                <option value="company.com">company.com</option>
                                <option value="test.com">test.com</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">UPN (Auto)</label>
                            <input name="upn" className="form-control" value={formData.upn} readOnly />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email (Auto)</label>
                            <input name="email" className="form-control" value={formData.email} readOnly />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password (16+ chars, 1 special, 1 upper)</label>
                            <input name="password" type="password" className="form-control" value={formData.password} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Job Title</label>
                            <input name="jobTitle" className="form-control" value={formData.jobTitle} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Company</label>
                            <select name="company" className="form-control" value={formData.company} onChange={handleChange}>
                                <option value="MyCompany">MyCompany</option>
                                <option value="PartnerCorp">PartnerCorp</option>
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

                        <div className="form-group">
                            <label className="form-label">Manager Name</label>
                            <select name="managerName" className="form-control" value={formData.managerName || ''} onChange={handleChange}>
                                <option value="">None</option>
                                {allUsers.filter(u => u.id !== Number(id)).map(u => (
                                    <option key={u.id} value={`${u.firstName} ${u.lastName}`}>{u.firstName} {u.lastName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <input name="description" className="form-control" value={formData.description || ''} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">System Role</label>
                            <select name="role" className="form-control" value={formData.role || 'User'} onChange={handleChange}>
                                <option value="User">User (Read Only)</option>
                                <option value="Technician">Technician</option>
                                <option value="Admin">Administrator</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label className="form-label">Group Memberships</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <select
                                className="form-control"
                                value={selectedGroupId}
                                onChange={(e) => setSelectedGroupId(e.target.value)}
                            >
                                <option value="">Select a group...</option>
                                {allGroups.map(g => (
                                    <option key={g.id} value={g.id}>{g.groupName} ({g.type})</option>
                                ))}
                            </select>
                            <button type="button" className="btn btn-primary" onClick={handleAddGroup}>
                                <Plus size={18} /> Add Group
                            </button>
                        </div>

                        <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '1rem', minHeight: '80px', backgroundColor: '#f8fafc' }}>
                            {userGroups.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {userGroups.map(g => (
                                        <div key={g.id} className="member-tag">
                                            {g.name}
                                            <span onClick={() => handleRemoveGroup(g.id)} className="badge-red">
                                                <X size={12} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '1rem' }}>Not a member of any groups.</div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                            <Save size={18} /> {isEdit ? 'Update User' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormPage;
