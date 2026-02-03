import React, { useEffect, useState } from 'react';
import { getDepartments } from '../api';
import type { Department } from '../api';
import { Building2, Search } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const DepartmentListPage: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const data = await getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Failed to load departments:', error);
        }
    };

    const filtered = departments.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.description && d.description.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="container">
            <div className="header-actions">
                <h1>Departments</h1>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        className="form-control"
                        style={{ paddingLeft: '2.5rem', width: '300px' }}
                        placeholder="Search departments..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    />
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table>
                    <thead>
                        <tr>
                            <th>Department Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length > 0 ? paginated.map(dept => (
                            <tr key={dept.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Building2 size={16} color="var(--primary-color)" />
                                        {dept.name}
                                    </div>
                                </td>
                                <td>{dept.description}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={2} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No departments found.</td>
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
        </div>
    );
};

export default DepartmentListPage;
