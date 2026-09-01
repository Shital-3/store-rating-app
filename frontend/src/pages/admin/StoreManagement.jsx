import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import SidePanel from "../../components/SidePanel";
import AddStoreForm from "../../components/AddStoreForm";
import StarRating from "../../components/StarRating";
import "./UserManagement.css";

const StoreManagement = () => {

    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        address: ""
    });
    const [sortBy, setSortBy] = useState("id");
    const [order, setOrder] = useState("asc");
    const [panelOpen, setPanelOpen] = useState(false);
    const [error, setError] = useState("");

    const fetchStores = async () => {
        try {
            const response = await axiosInstance.get("/admin/stores", {
                params: {
                    ...filters,
                    sortBy,
                    order
                }
            });

            setStores(response.data.stores);

        } catch (err) {
            setError("Failed to load stores");
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStores();
        }, 400);

        return () => clearTimeout(timer);
    }, [filters, sortBy, order]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setOrder(order === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setOrder("asc");
        }
    };

    const handleAddSuccess = () => {
        setPanelOpen(false);
        fetchStores();
    };

    return (
        <div>
            <div className="page-header">
                <h1>Store Management</h1>
                <button
                    className="add-btn"
                    onClick={() => setPanelOpen(true)}
                >
                    + Add New Store
                </button>
            </div>

            <div className="filter-bar">
                <input
                    name="name"
                    placeholder="Filter by Name"
                    value={filters.name}
                    onChange={handleFilterChange}
                />
                <input
                    name="email"
                    placeholder="Filter by Email"
                    value={filters.email}
                    onChange={handleFilterChange}
                />
                <input
                    name="address"
                    placeholder="Filter by Address"
                    value={filters.address}
                    onChange={handleFilterChange}
                />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("name")}>
                                Name {sortBy === "name" && (order === "asc" ? "↑" : "↓")}
                            </th>
                            <th onClick={() => handleSort("email")}>
                                Email {sortBy === "email" && (order === "asc" ? "↑" : "↓")}
                            </th>
                            <th onClick={() => handleSort("address")}>
                                Address {sortBy === "address" && (order === "asc" ? "↑" : "↓")}
                            </th>
                            <th onClick={() => handleSort("overallRating")}>
                                Rating {sortBy === "overallRating" && (order === "asc" ? "↑" : "↓")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map((store) => (
                            <tr key={store.id}>
                                <td>{store.name}</td>
                                <td>{store.email}</td>
                                <td>{store.address}</td>
                                <td>
                                    <StarRating rating={Math.round(store.overallRating)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SidePanel
                isOpen={panelOpen}
                onClose={() => setPanelOpen(false)}
                title="Add New Store"
            >
                <AddStoreForm onSuccess={handleAddSuccess} />
            </SidePanel>
        </div>
    );
};

export default StoreManagement;