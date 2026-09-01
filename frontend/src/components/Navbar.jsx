import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SidePanel from "./SidePanel";
import UpdatePasswordForm from "./UpdatePasswordForm";
import "./Navbar.css";

const Navbar = ({ showMenuButton = false, onMenuClick }) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [passwordPanelOpen, setPasswordPanelOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                {showMenuButton && (
                    <button
                        className="navbar-menu-btn"
                        onClick={onMenuClick}
                        aria-label="Open menu"
                    >
                        ☰
                    </button>
                )}
                <div className="navbar-logo">STORESCORE</div>
            </div>

            <div className="navbar-profile">
                <button
                    className="profile-icon"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    👤
                </button>

                {menuOpen && (
                    <div className="profile-menu">
                        {user?.role !== "ADMIN" && (
                            <button
                                onClick={() => {
                                    setPasswordPanelOpen(true);
                                    setMenuOpen(false);
                                }}
                            >
                                Update Password
                            </button>
                        )}
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>

            <SidePanel
                isOpen={passwordPanelOpen}
                onClose={() => setPasswordPanelOpen(false)}
                title="Update Password"
            >
                <UpdatePasswordForm
                    onSuccess={() => setPasswordPanelOpen(false)}
                />
            </SidePanel>
        </nav>
    );
};

export default Navbar;