
import './RolesTable.css'
import FeatureTable from '../../shared/FeatureTable'

const columns = [
  {
    key: 'id',
    label: 'Role ID',
  },
  {
    key: 'name',
    label: 'Role',
  },
  {
    key: 'members',
    label: 'Members',
  },
  {
    key: 'description',
    label: 'Description',
  },
  {
    key: 'permissions',
    label: 'Permissions',
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <span className={`crm-status ${String(value || '').toLowerCase()}`}>
        {value}
      </span>
    ),
  },
]

export default function RolesTable({ rows }) {
  return (
    <FeatureTable
      columns={columns}
      rows={rows}
    />
  )
}
