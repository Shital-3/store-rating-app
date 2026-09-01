import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "./AddUserForm.css";

const UpdatePasswordForm = ({ onSuccess }) => {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await axiosInstance.put("/account/password", {
                currentPassword,
                newPassword,
                confirmNewPassword
            });

            setSuccess("Password updated successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");

            if (onSuccess) onSuccess();

        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to update password"
            );
        }
    };

    return (
        <form className="add-user-form" onSubmit={handleSubmit}>

            {error && <p className="form-error">{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <label>Current Password</label>
            <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <label>New Password</label>
            <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <span className="field-hint">8-16 chars, 1 uppercase, 1 special</span>

            <label>Confirm New Password</label>
            <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
            />

            <button type="submit" className="submit-btn">
                Update Password
            </button>

        </form>
    );
};

export default UpdatePasswordForm;