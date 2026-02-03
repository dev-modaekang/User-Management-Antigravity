import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssets, deleteAsset } from '../api';
import type { Asset } from '../api';
import { Plus, Search, Trash2, Edit3, Monitor, Box, Smartphone, Server, Printer, HardDrive, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const AssetListPage: React.FC = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        loadAssets();
    }, []);

    const loadAssets = async () => {
        try {
            const data = await getAssets();
            setAssets(data);
        } catch (error) {
            console.error('Failed to load assets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, searchField]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await deleteAsset(id);
                loadAssets();
            } catch (error) {
                console.error('Failed to delete asset:', error);
                alert('Failed to delete asset.');
            }
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'PC/LAPTOP': return <Monitor size={18} />;
            case 'Monitor/TV': return <Monitor size={18} />;
            case 'Phone/Table': return <Smartphone size={18} />;
            case 'Server/Storage': return <Server size={18} />;
            case 'Printer': return <Printer size={18} />;
            case 'Switch/Network': return <HardDrive size={18} />;
            default: return <Box size={18} />;
        }
    };

    const filteredAssets = assets.filter(asset => {
        const lowerSearch = searchTerm.toLowerCase();
        if (!lowerSearch) return true;

        const matches = {
            product: asset.product?.toLowerCase().includes(lowerSearch),
            serialNumber: asset.serialNumber?.toLowerCase().includes(lowerSearch),
            category: asset.category?.toLowerCase().includes(lowerSearch),
            location: asset.location?.toLowerCase().includes(lowerSearch),
            company: asset.company?.toLowerCase().includes(lowerSearch),
            assignedTo: (asset.assignedToUser && `${asset.assignedToUser.firstName} ${asset.assignedToUser.lastName}`.toLowerCase().includes(lowerSearch))
        };

        if (searchField === 'ALL') {
            return Object.values(matches).some(m => m);
        }

        return matches[searchField as keyof typeof matches];
    });

    const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
    const paginatedAssets = filteredAssets.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="container">
            <div className="header-actions">
                <h1>IT Assets</h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                        className="form-control"
                        style={{ width: '130px' }}
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                    >
                        <option value="ALL">ALL</option>
                        <option value="category">Category</option>
                        <option value="product">Product</option>
                        <option value="serialNumber">S/N</option>
                        <option value="location">Location</option>
                        <option value="company">Company</option>
                        <option value="assignedTo">Assigned To</option>
                    </select>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            className="form-control"
                            style={{ paddingLeft: '2.5rem', width: '250px' }}
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/assets/add')}>
                        <Plus size={18} /> Add Asset
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading assets...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Product</th>
                                <th>Serial Number</th>
                                <th>Status</th>
                                <th>Assigned To</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedAssets.length > 0 ? (
                                paginatedAssets.map(asset => (
                                    <tr key={asset.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getCategoryIcon(asset.category)}
                                                <span>{asset.category}</span>
                                            </div>
                                        </td>
                                        <td><strong>{asset.product}</strong></td>
                                        <td><code>{asset.serialNumber}</code></td>
                                        <td>
                                            <span className={`badge ${asset.status === 'In Use' ? 'badge-green' : 'badge-orange'}`}>
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td>
                                            {asset.assignedToUser
                                                ? `${asset.assignedToUser.firstName} ${asset.assignedToUser.lastName}`
                                                : <span style={{ color: '#94a3b8' }}>Unassigned</span>
                                            }
                                        </td>
                                        <td>{asset.location}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn btn-outline btn-sm" onClick={() => navigate(`/assets/modify/${asset.id}`)}>
                                                    <Edit3 size={14} />
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(asset.id!)}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                        No assets found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

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
        </div>
    );
};

export default AssetListPage;
