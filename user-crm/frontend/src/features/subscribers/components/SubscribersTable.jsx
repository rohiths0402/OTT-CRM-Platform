import "./SubscribersTable.css";
import FeatureTable from "../../shared/FeatureTable";
const columns = [
  { key: "id", label: "Subscriber ID" },
  { key: "name", label: "Subscriber" },
  { key: "email", label: "Email" },
  { key: "plan", label: "Plan" },
  { key: "region", label: "Region" },
  { key: "joined", label: "Joined" },
  {
    key: "status",
    label: "Status",
    render: (v) => (
      <span className={`crm-status ${String(v || "").toLowerCase()}`}>{v}</span>
    ),
  },
];
export default function SubscribersTable({ rows, extraHeader, renderExtra }) {
  return (
    <FeatureTable
      columns={columns}
      rows={rows}
      extraHeader={extraHeader}
      renderExtra={renderExtra}
    />
  );
}
