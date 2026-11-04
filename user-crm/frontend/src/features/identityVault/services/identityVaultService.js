import { api } from "../../../services/api/apiClient";
const ENDPOINT = "/kyc/applications/";
const normalize = (r) => ({
  id: r.id,
  subscriber: r.subscriber,
  name: r.subscriber_name || `Subscriber #${r.subscriber}`,
  documentType: r.documentType || r.document_type || "—",
  submittedAt: r.created_at || "—",
  region: r.region || "—",
  status: (r.status || "pending")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()),
  reviewNote: r.reviewNote || r.review_note || "",
});
export const identityVaultService = {
  list: async () => (await api.getAll(ENDPOINT)).map(normalize),
  create: async () => {
    throw new Error(
      "KYC submissions are created by the subscriber. Admins can review existing applications.",
    );
  },
  update: async (id, data) =>
    api.patch(`${ENDPOINT}${encodeURIComponent(id)}/`, data).then(normalize),
  remove: async () => {
    throw new Error(
      "KYC records are retained for compliance; use the review action instead.",
    );
  },
  setKycStatus: (id, status, note = "") =>
    api
      .post(`${ENDPOINT}${encodeURIComponent(id)}/review/`, {
        status,
        reviewNote: note,
      })
      .then(normalize),
};
