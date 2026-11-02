
import React, { useMemo, useState } from "react";
import {
  MapPin,
  Plus,
  Building2,
  CheckCircle,
  Clock,
  IndianRupee,
} from "lucide-react";

import LocationTable from "../../components/shooting-locations/LocationTable";
import LocationModal from "../../components/shooting-locations/LocationModal";
import LocationFilters from "../../components/shooting-locations/LocationFilters";

import "./ShootingLocationsPage.css";

const initialLocations = [
  {
    id: 1,
    name: "Chennai Film City",
    type: "Studio",
    address: "Taramani, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    mapUrl: "https://maps.google.com/",
    rentalCost: 25000,
    project: "Project Alpha",
    contactPerson: "Ramesh Kumar",
    contactPhone: "9876543210",
    status: "Approved",
    description: "Large studio facility for indoor shooting.",
  },
  {
    id: 2,
    name: "Mahabalipuram Beach",
    type: "Outdoor",
    address: "East Coast Road, Mahabalipuram",
    city: "Mahabalipuram",
    state: "Tamil Nadu",
    mapUrl: "https://maps.google.com/",
    rentalCost: 15000,
    project: "Project Beta",
    contactPerson: "Suresh",
    contactPhone: "9876543211",
    status: "Pending",
    description: "Beach location for outdoor shooting.",
  },
  {
    id: 3,
    name: "AVM Indoor Set",
    type: "Indoor",
    address: "Vadapalani, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    mapUrl: "https://maps.google.com/",
    rentalCost: 30000,
    project: "Project Gamma",
    contactPerson: "Karthik",
    contactPhone: "9876543212",
    status: "Approved",
    description: "Indoor shooting set with lighting facilities.",
  },
  {
    id: 4,
    name: "Pondicherry Heritage House",
    type: "Private Property",
    address: "White Town, Pondicherry",
    city: "Pondicherry",
    state: "Puducherry",
    mapUrl: "https://maps.google.com/",
    rentalCost: 18000,
    project: "Not Assigned",
    contactPerson: "Arun",
    contactPhone: "9876543213",
    status: "Rejected",
    description: "Heritage property considered for a film location.",
  },
];

function ShootingLocationsPage() {
  const [locations, setLocations] = useState(initialLocations);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [viewingLocation, setViewingLocation] = useState(null);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        [
          location.name,
          location.address,
          location.city,
          location.state,
          location.contactPerson,
          location.project,
        ].some((value) =>
          String(value || "").toLowerCase().includes(searchText)
        );

      const matchesType =
        type === "All" || location.type === type;

      const matchesStatus =
        status === "All" || location.status === status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [locations, search, type, status]);

  const totalLocations = locations.length;

  const approvedLocations = locations.filter(
    (location) => location.status === "Approved"
  ).length;

  const pendingLocations = locations.filter(
    (location) => location.status === "Pending"
  ).length;

  const totalRentalCost = locations.reduce(
    (total, location) =>
      total + (Number(location.rentalCost) || 0),
    0
  );

  const openAddModal = () => {
    setEditingLocation(null);
    setViewingLocation(null);
    setIsModalOpen(true);
  };

  const openEditModal = (location) => {
    setEditingLocation(location);
    setViewingLocation(null);
    setIsModalOpen(true);
  };

  const openViewModal = (location) => {
    setViewingLocation(location);
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
    setViewingLocation(null);
  };

  const handleSaveLocation = (formData) => {
    if (editingLocation) {
      setLocations((prev) =>
        prev.map((location) =>
          location.id === editingLocation.id
            ? { ...formData, id: location.id }
            : location
        )
      );
    } else {
      const newLocation = {
        ...formData,
        id: Date.now(),
      };

      setLocations((prev) => [newLocation, ...prev]);
    }

    closeModal();
  };

  const handleDeleteLocation = (location) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${location.name}"?`
    );

    if (!confirmed) return;

    setLocations((prev) =>
      prev.filter((item) => item.id !== location.id)
    );
  };

  return (
    <div className="shooting-locations-page">
      <div className="shooting-locations-header">
        <div>
          <span className="shooting-locations-eyebrow">
            PRODUCTION MANAGEMENT
          </span>

          <h1>Shooting Locations</h1>

          <p>
            Manage filming locations, rental costs and approval status.
          </p>
        </div>

        <button
          type="button"
          className="add-location-btn"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Location
        </button>
      </div>

      <div className="location-stats-grid">
        <div className="location-stat-card">
          <div className="location-stat-icon gold">
            <MapPin size={20} />
          </div>

          <div>
            <span>Total Locations</span>
            <h3>{totalLocations}</h3>
          </div>
        </div>

        <div className="location-stat-card">
          <div className="location-stat-icon green">
            <CheckCircle size={20} />
          </div>

          <div>
            <span>Approved Locations</span>
            <h3>{approvedLocations}</h3>
          </div>
        </div>

        <div className="location-stat-card">
          <div className="location-stat-icon yellow">
            <Clock size={20} />
          </div>

          <div>
            <span>Pending Approval</span>
            <h3>{pendingLocations}</h3>
          </div>
        </div>

        <div className="location-stat-card">
          <div className="location-stat-icon silver">
            <IndianRupee size={20} />
          </div>

          <div>
            <span>Total Rental Cost</span>
            <h3>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(totalRentalCost)}
            </h3>
          </div>
        </div>
      </div>

      <div className="shooting-locations-content">
        <div className="location-content-heading">
          <div>
            <h2>Location Directory</h2>
            <p>
              {filteredLocations.length} of {totalLocations} locations
            </p>
          </div>
        </div>

        <LocationFilters
          search={search}
          setSearch={setSearch}
          type={type}
          setType={setType}
          status={status}
          setStatus={setStatus}
        />

        <LocationTable
          locations={filteredLocations}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={handleDeleteLocation}
        />
      </div>

      <LocationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveLocation}
        editingLocation={editingLocation}
        viewingLocation={viewingLocation}
      />
    </div>
  );
}

export default ShootingLocationsPage;
