
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./CastCrewModal.css";

const initialForm = {
  name: "",
  role: "Actor",
  email: "",
  phone: "",
  experience: "",
  location: "",
  status: "Available",
  project: "None",
};

function CastCrewModal({
  isOpen,
  onClose,
  onSubmit,
  editingMember,
  viewingMember,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isViewMode = Boolean(viewingMember);

  useEffect(() => {
    if (viewingMember) {
      setFormData({ ...initialForm, ...viewingMember });
    } else if (editingMember) {
      setFormData({ ...initialForm, ...editingMember });
    } else {
      setFormData(initialForm);
    }

    setErrors({});
  }, [editingMember, viewingMember, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email.";
    }

    const phone = formData.phone.replace(/[\s-]/g, "");

    if (!/^(\+91)?[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = "Enter a valid Indian mobile number.";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    onSubmit(formData);
  };

  const renderField = (label, name, placeholder, type = "text") => (
    <div className="cast-modal-field">
      <label htmlFor={name}>{label} *</label>
      <input
        id={name}
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isViewMode}
      />
      {errors[name] && <span className="cast-field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="cast-modal-overlay" onClick={onClose}>
      <div
        className="cast-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cast-modal-header">
          <div>
            <h2>
              {isViewMode
                ? "Member Details"
                : editingMember
                ? "Edit Member"
                : "Add New Member"}
            </h2>
            <p>Manage cast and crew information.</p>
          </div>

          <button
            type="button"
            className="cast-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="cast-modal-body">
            <div className="cast-modal-grid">
              {renderField("Full Name", "name", "Enter full name")}
              {renderField("Email Address", "email", "Enter email", "email")}
              {renderField("Phone Number", "phone", "Enter mobile number")}
              {renderField("Experience", "experience", "Example: 5 Years")}
              {renderField("Location", "location", "Enter city")}

              <div className="cast-modal-field">
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isViewMode}
                >
                  <option>Actor</option>
                  <option>Director</option>
                  <option>Cinematographer</option>
                  <option>Editor</option>
                  <option>Producer</option>
                  <option>Technician</option>
                  <option>Writer</option>
                </select>
              </div>

              <div className="cast-modal-field">
                <label htmlFor="status">Availability Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isViewMode}
                >
                  <option>Available</option>
                  <option>On Project</option>
                  <option>Unavailable</option>
                </select>
              </div>

              <div className="cast-modal-field">
                <label htmlFor="project">Assigned Project</label>
                <input
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  disabled={isViewMode}
                />
              </div>
            </div>
          </div>

          <div className="cast-modal-footer">
            <button
              type="button"
              className="cast-modal-cancel"
              onClick={onClose}
            >
              {isViewMode ? "Close" : "Cancel"}
            </button>

            {!isViewMode && (
              <button type="submit" className="cast-modal-save">
                {editingMember ? "Update Member" : "Save Member"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CastCrewModal;
