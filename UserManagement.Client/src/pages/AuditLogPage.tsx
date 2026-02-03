import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../api';
import type { AuditLog } from '../api';
import { User as UserIcon, Calendar } from 'lucide-react';

const AuditLogPage: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAuditLogs()
            .then(setLogs)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const getActionColor = (action: string) => {
        switch (action.toLowerCase()) {
            case 'create': return '#15803d';
            case 'update': return '#1d4ed8';
            case 'delete': return '#b91c1c';
            default: return '#64748b';
        }
    };

    return (
        <div className="container">
            <div className="header-actions">
                <h1>Audit Logs</h1>
                <p style={{ color: '#64748b' }}>History of all system changes</p>
            </div>

            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading logs...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Performed By</th>
                                <th>Action</th>
                                <th>Target</th>
                                <th>Summary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? logs.map(log => (
                                <tr key={log.id}>
                                    <td style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Calendar size={14} color="#94a3b8" />
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <UserIcon size={14} color="#94a3b8" />
                                            {log.performedBy}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            backgroundColor: `${getActionColor(log.action)}15`,
                                            color: getActionColor(log.action)
                                        }}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.8125rem' }}>
                                        <span style={{ color: '#64748b' }}>{log.targetEntity}</span>
                                        <span style={{ marginLeft: '4px', color: '#94a3b8' }}>#{log.targetId}</span>
                                    </td>
                                    <td style={{ fontSize: '0.875rem' }}>{log.changeSummary}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No audit logs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AuditLogPage;
