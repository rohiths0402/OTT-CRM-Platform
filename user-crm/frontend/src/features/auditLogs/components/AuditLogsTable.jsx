import './AuditLogsTable.css';
import FeatureTable from '../../shared/FeatureTable';

const columns = [
    { key: 'id', label: 'Log ID' },
    { key: 'actor', label: 'Actor' },
    { key: 'action', label: 'Action' },
    { key: 'target', label: 'Target' },
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'ipAddress', label: 'IP address' },
    {
        key: 'result',
        label: 'Result',
        render: (v) => (
            <span className={`crm-status ${String(v || '').toLowerCase()}`}>
                {v}
            </span>
        )
    }
];

export default function AuditLogsTable({
    rows,
    extraHeader,
    renderExtra
}) {
    return (
        <FeatureTable
            columns={columns}
            rows={rows}
            extraHeader={extraHeader}
            renderExtra={renderExtra}
        />
    );
}