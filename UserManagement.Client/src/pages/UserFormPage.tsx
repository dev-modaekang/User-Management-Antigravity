import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, getUser, getUsers, updateUser } from '../api';
import type { User } from '../api';
import { ArrowLeft, Save } from 'lucide-react';

const UserFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [formData, setFormData] = useState<User>({
        firstName: '',
        lastName: '',
        userStatus: 'Active',
        accountType: 'User',
        account: '',
        domain: 'company.com',
        upn: '',
        email: '',
        password: '',
        jobTitle: '',
        company: 'MyCompany',
        description: '',
        managerName: '',
        department: 'IT',
    });

    useEffect(() => {
        getUsers().then(setAllUsers).catch(console.error);
        if (isEdit && id) {
            getUser(Number(id)).then(setFormData).catch(console.error);
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

            if (isEdit && id) {
                await updateUser(Number(id), formData);
            } else {
                await createUser(formData);
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
                <form onSubmit={handleSubmit} className="grid-form">
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

                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
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
