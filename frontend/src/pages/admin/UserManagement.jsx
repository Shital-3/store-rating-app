import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import SidePanel from "../../components/SidePanel";
import AddUserForm from "../../components/AddUserForm";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserManagement.css";

const UserManagement = () => {

    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        address: "",
        role: ""
    });

    const location = useLocation();
    const navigate = useNavigate();

    const [sortBy, setSortBy] = useState("id");
    const [order, setOrder] = useState("asc");
    const [panelOpen, setPanelOpen] = useState(
        () => Boolean(location.state?.openAddPanel)
    );
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get("/admin/users", {
                params: {
                    ...filters,
                    sortBy,
                    order
                }
            });

            setUsers(response.data.users);

        } catch {
            setError("Failed to load users");
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
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
        fetchUsers();
    };

    return (
        <div>
            <div className="page-header">
                <h1>User Management</h1>
                <button
                    className="add-btn"
                    onClick={() => setPanelOpen(true)}
                >
                    + Add New User
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
                <select
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                >
                    <option value="">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="USER">Normal User</option>
                    <option value="OWNER">Store Owner</option>
                </select>
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
                            <th onClick={() => handleSort("role")}>
                                Role {sortBy === "role" && (order === "asc" ? "↑" : "↓")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                onClick={() => navigate(`/admin/users/${user.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.address}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SidePanel
                isOpen={panelOpen}
                onClose={() => setPanelOpen(false)}
                title="Add New User"
            >
                <AddUserForm onSuccess={handleAddSuccess} />
            </SidePanel>
        </div>
    );
};

export default UserManagement;