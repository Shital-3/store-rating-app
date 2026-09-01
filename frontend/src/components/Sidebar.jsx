import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

            <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
                <nav>
                    <NavLink to="/admin" end className="sidebar-link" onClick={onClose}>
                        <span className="sidebar-icon">▦</span>
                        Dashboard
                    </NavLink>

                    <NavLink to="/admin/users" className="sidebar-link" onClick={onClose}>
                        <span className="sidebar-icon">👤</span>
                        User Management
                    </NavLink>

                    <NavLink to="/admin/stores" className="sidebar-link" onClick={onClose}>
                        <span className="sidebar-icon">🏬</span>
                        Store Management
                    </NavLink>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;