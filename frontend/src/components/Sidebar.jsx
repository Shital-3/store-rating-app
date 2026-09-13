import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Store
} from "lucide-react";

import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {

    return (
        <>
            {isOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={onClose}
                />
            )}

            <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
                <nav>

                    <NavLink
                        to="/admin"
                        end
                        className="sidebar-link"
                        onClick={onClose}
                    >
                        <LayoutDashboard
                            className="sidebar-icon"
                            size={20}
                        />
                        <span>Dashboard</span>
                    </NavLink>


                    <NavLink
                        to="/admin/users"
                        className="sidebar-link"
                        onClick={onClose}
                    >
                        <Users
                            className="sidebar-icon"
                            size={20}
                        />
                        <span>User Management</span>
                    </NavLink>


                    <NavLink
                        to="/admin/stores"
                        className="sidebar-link"
                        onClick={onClose}
                    >
                        <Store
                            className="sidebar-icon"
                            size={20}
                        />
                        <span>Store Management</span>
                    </NavLink>

                </nav>
            </aside>
        </>
    );
};

export default Sidebar;