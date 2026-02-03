import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAssets, getAsset, createAsset, updateAsset, getUsers, getDepartments } from '../api';
import type { Asset, User, Department } from '../api';
import { ArrowLeft, Save, Info, Cpu, HardDrive, Zap } from 'lucide-react';

const AssetFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [allAssets, setAllAssets] = useState<Asset[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [allDepartments, setAllDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);

    const [showSuggestions, setShowSuggestions] = useState({
        product: false,
        vendor: false,
        manufacturer: false
    });

    const [formData, setFormData] = useState<Asset>({
        category: 'PC/LAPTOP',
        product: '',
        location: 'HQ',
        company: 'NC',
        serialNumber: '',
        status: 'Spare',
        departmentId: undefined,
        assignedToUserId: undefined,
        deploymentDate: undefined,
        vendor: '',
        manufacturer: '',
        purchaseDate: undefined,
        orderNo: '',
        price: '',
        orderStatus: 'Ordered',
        warrantyEndDate: undefined,
        cpu: '',
        ram: '',
        hdd: ''
    });

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getAssets(),
            getUsers(),
            getDepartments()
        ]).then(([assetsData, usersData, deptsData]) => {
            setAllAssets(assetsData);
            setAllUsers(usersData);
            setAllDepartments(deptsData);

            if (isEdit && id) {
                return getAsset(Number(id));
            }
        }).then(assetData => {
            if (assetData) {
                // Ensure dates are formatted for input[type="date"]
                const formatDate = (dateString?: string) => dateString ? dateString.split('T')[0] : '';
                setFormData({
                    ...assetData,
                    deploymentDate: formatDate(assetData.deploymentDate),
                    purchaseDate: formatDate(assetData.purchaseDate),
                    warrantyEndDate: formatDate(assetData.warrantyEndDate)
                });
            }
        }).catch(error => {
            console.error('Error loading data:', error);
        }).finally(() => {
            setLoading(false);
        });
    }, [isEdit, id]);

    // Simple autocomplete helper
    const getSuggestions = (field: keyof Asset, query: string) => {
        if (!query || query.length < 1) return [];
        const uniqueValues = Array.from(new Set(
            allAssets
                .map(a => a[field] as string)
                .filter(val => val && val.toLowerCase().includes(query.toLowerCase()))
        ));
        return uniqueValues.slice(0, 5);
    };

    const productSuggestions = useMemo(() => getSuggestions('product', formData.product), [formData.product, allAssets]);
    const vendorSuggestions = useMemo(() => getSuggestions('vendor', formData.vendor || ''), [formData.vendor, allAssets]);
    const manufacturerSuggestions = useMemo(() => getSuggestions('manufacturer', formData.manufacturer || ''), [formData.manufacturer, allAssets]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === "" ? undefined : (name.includes('Id') ? Number(value) : value)
        }));

        if (['product', 'vendor', 'manufacturer'].includes(name)) {
            setShowSuggestions(prev => ({ ...prev, [name]: true }));
        }
    };

    const handleSuggestionClick = (field: keyof Asset, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setShowSuggestions(prev => ({ ...prev, [field]: false }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit && id) {
                await updateAsset(Number(id), formData);
            } else {
                await createAsset(formData);
            }
            navigate('/assets');
        } catch (error) {
            console.error('Error saving asset:', error);
            alert('Failed to save asset.');
        }
    };

    const categories = ['Accessories', 'Docking Station', 'Headset', 'Monitor/TV', 'PC/LAPTOP', 'Phone/Table', 'Printer', 'Server/Storage', 'Switch/Network', 'UPS', 'Others'];
    const locations = ['HQ', 'Canada', 'USA', 'France'];
    const companies = ['NC', 'KP', 'RD'];
    const statuses = ['In Use', 'Spare'];
    const orderStatuses = ['Ordered', 'Delivered'];

    if (loading) return <div className="container"><div className="card">Loading...</div></div>;

    return (
        <div className="container">
            <div className="header-actions">
                <button onClick={() => navigate('/assets')} className="btn btn-outline">
                    <ArrowLeft size={16} /> Back to Assets
                </button>
                <h1>{isEdit ? 'Modify Asset' : 'Add New Asset'}</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Left Column: Required Information */}
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                            <Info size={20} />
                            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Core Information</h2>
                        </div>

                        <div className="grid-form" style={{ gridTemplateColumns: '1fr' }}>
                            <div className="form-group">
                                <label className="form-label">Category *</label>
                                <select name="category" className="form-control" value={formData.category} onChange={handleChange} required>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="form-group" style={{ position: 'relative' }}>
                                <label className="form-label">Product *</label>
                                <input name="product" className="form-control" value={formData.product} onChange={handleChange} onFocus={() => setShowSuggestions(prev => ({ ...prev, product: true }))} placeholder="e.g. MacBook Pro 16" required autoComplete="off" />
                                {showSuggestions.product && productSuggestions.length > 0 && (
                                    <div className="autocomplete-dropdown">
                                        {productSuggestions.map(s => (
                                            <div key={s} className="autocomplete-item" onClick={() => handleSuggestionClick('product', s)}>{s}</div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Serial Number *</label>
                                <input name="serialNumber" className="form-control" value={formData.serialNumber} onChange={handleChange} placeholder="Unique hardware ID" required />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Location *</label>
                                    <select name="location" className="form-control" value={formData.location} onChange={handleChange} required>
                                        {locations.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company *</label>
                                    <select name="company" className="form-control" value={formData.company} onChange={handleChange} required>
                                        {companies.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Status *</label>
                                    <select name="status" className="form-control" value={formData.status} onChange={handleChange} required>
                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Deployment Date</label>
                                    <input type="date" name="deploymentDate" className="form-control" value={formData.deploymentDate || ''} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Assigned To</label>
                                <select name="assignedToUserId" className="form-control" value={formData.assignedToUserId || ''} onChange={handleChange}>
                                    <option value="">Unassigned</option>
                                    {allUsers.map(u => (
                                        <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.account})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select name="departmentId" className="form-control" value={formData.departmentId || ''} onChange={handleChange}>
                                    <option value="">None</option>
                                    {allDepartments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Optional Information & Specs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#64748b' }}>
                                <Save size={20} />
                                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Purchase Information</h2>
                            </div>

                            <div className="grid-form">
                                <div className="form-group" style={{ position: 'relative' }}>
                                    <label className="form-label">Vendor</label>
                                    <input name="vendor" className="form-control" value={formData.vendor || ''} onChange={handleChange} onFocus={() => setShowSuggestions(prev => ({ ...prev, vendor: true }))} autoComplete="off" />
                                    {showSuggestions.vendor && vendorSuggestions.length > 0 && (
                                        <div className="autocomplete-dropdown">
                                            {vendorSuggestions.map(s => (
                                                <div key={s} className="autocomplete-item" onClick={() => handleSuggestionClick('vendor', s)}>{s}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="form-group" style={{ position: 'relative' }}>
                                    <label className="form-label">Manufacturer</label>
                                    <input name="manufacturer" className="form-control" value={formData.manufacturer || ''} onChange={handleChange} onFocus={() => setShowSuggestions(prev => ({ ...prev, manufacturer: true }))} autoComplete="off" />
                                    {showSuggestions.manufacturer && manufacturerSuggestions.length > 0 && (
                                        <div className="autocomplete-dropdown">
                                            {manufacturerSuggestions.map(s => (
                                                <div key={s} className="autocomplete-item" onClick={() => handleSuggestionClick('manufacturer', s)}>{s}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Purchase Date</label>
                                    <input type="date" name="purchaseDate" className="form-control" value={formData.purchaseDate || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Warranty End</label>
                                    <input type="date" name="warrantyEndDate" className="form-control" value={formData.warrantyEndDate || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Order No</label>
                                    <input name="orderNo" className="form-control" value={formData.orderNo || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price</label>
                                    <input name="price" className="form-control" value={formData.price || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Order Status</label>
                                    <select name="orderStatus" className="form-control" value={formData.orderStatus || 'Ordered'} onChange={handleChange}>
                                        {orderStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#64748b' }}>
                                <Cpu size={20} />
                                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Specifications</h2>
                            </div>

                            <div className="grid-form">
                                <div className="form-group">
                                    <label className="form-label"><Cpu size={14} /> CPU</label>
                                    <input name="cpu" className="form-control" value={formData.cpu || ''} onChange={handleChange} placeholder="e.g. M2 Pro" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label"><Zap size={14} /> RAM</label>
                                    <input name="ram" className="form-control" value={formData.ram || ''} onChange={handleChange} placeholder="e.g. 16GB" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label"><HardDrive size={14} /> Storage</label>
                                    <input name="hdd" className="form-control" value={formData.hdd || ''} onChange={handleChange} placeholder="e.g. 512GB SSD" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ height: '56px', fontSize: '1.125rem' }}>
                            <Save size={20} /> {isEdit ? 'Update Asset' : 'Register Asset'}
                        </button>
                    </div>
                </div>
            </form>

            <style>{`
                .autocomplete-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid var(--border-color);
                    border-radius: 0 0 var(--radius) var(--radius);
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
                    z-index: 50;
                    margin-top: -1px;
                }
                .autocomplete-item {
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    font-size: 0.875rem;
                }
                .autocomplete-item:hover {
                    background-color: var(--bg-color);
                    color: var(--primary-color);
                }
            `}</style>
        </div>
    );
};

export default AssetFormPage;
