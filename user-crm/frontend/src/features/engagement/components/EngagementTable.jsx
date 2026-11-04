import "./EngagementTable.css";
import FeatureTable from "../../shared/FeatureTable";
const columns = [
  { key: "id", label: "Subscriber ID" },
  { key: "subscriber", label: "Subscriber" },
  { key: "sessions", label: "Sessions" },
  { key: "watchTime", label: "Watch time" },
  { key: "lastActive", label: "Last active" },
  { key: "segment", label: "Segment" },
  { key: "score", label: "Score" },
];
export default function EngagementTable({ rows, extraHeader, renderExtra }) {
  return (
    <FeatureTable
      columns={columns}
      rows={rows}
      extraHeader={extraHeader}
      renderExtra={renderExtra}
    />
  );
}
