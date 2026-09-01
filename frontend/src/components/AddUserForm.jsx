import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "./AddUserForm.css";

const AddUserForm = ({ onSuccess }) => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER"
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validate = () => {

        if (formData.name.length < 20 || formData.name.length > 60) {
            return "Name must be between 20 and 60 characters";
        }

        if (formData.address.length > 400) {
            return "Address must not exceed 400 characters";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return "Please enter a valid email address";
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
        if (!passwordRegex.test(formData.password)) {
            return "Password must be 8-16 characters with 1 uppercase and 1 special character";
        }

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validate();

        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");

        try {
            await axiosInstance.post("/admin/users", formData);
            onSuccess();

        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to create user"
            );
        }
    };

    return (
        <form className="add-user-form" onSubmit={handleSubmit}>

            {error && <p className="form-error">{error}</p>}

            <label>Name</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
            />
            <span className="field-hint">Min 20, Max 60 chars</span>

            <label>Email</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
            />

            <label>Address</label>
            <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
            />

            <label>Password</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
            />
            <span className="field-hint">8-16 chars, 1 uppercase, 1 special</span>

            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
                <option value="USER">Normal User</option>
                <option value="ADMIN">Admin</option>
                <option value="OWNER">Store Owner</option>
            </select>

            <button type="submit" className="submit-btn">
                Add User
            </button>

        </form>
    );
};

export default AddUserForm;