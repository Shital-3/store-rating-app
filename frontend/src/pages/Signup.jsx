import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./Auth.css";

const Signup = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: ""
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateField = (name, value) => {

        if (name === "name") {
            if (value.length > 0 && value.length < 20) {
                return "Name is too short (min 20 chars)";
            }
            if (value.length > 60) {
                return "Name is too long (max 60 chars)";
            }
        }

        if (name === "address" && value.length > 400) {
            return "Address must not exceed 400 characters";
        }

        if (name === "email" && value.length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return "Please enter a valid email address";
            }
        }

        if (name === "password" && value.length > 0) {
            const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
            if (!passwordRegex.test(value)) {
                return "Password weak (8-16 chars, 1 uppercase, 1 special)";
            }
        }

        if (name === "confirmPassword" && value.length > 0) {
            if (value !== formData.password) {
                return "Passwords do not match";
            }
        }

        return "";
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);

        setFieldErrors({
            ...fieldErrors,
            [name]: error
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        try {
            await axiosInstance.post("/auth/signup", formData);
            navigate("/login");

        } catch (err) {
            setServerError(
                err.response?.data?.message || "Signup failed"
            );
        }
    };

    return (
        <div className="auth-container">
            <h1>Sign Up</h1>

            {serverError && (
                <p className="form-error-banner">{serverError}</p>
            )}

            <form onSubmit={handleSubmit}>

                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldErrors.name ? "input-error" : ""}
                />
                {fieldErrors.name ? (
                    <p className="field-error">{fieldErrors.name}</p>
                ) : (
                    <p className="field-hint">Min 20, Max 60 chars</p>
                )}

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldErrors.email ? "input-error" : ""}
                />
                {fieldErrors.email && (
                    <p className="field-error">{fieldErrors.email}</p>
                )}

                <label>Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldErrors.address ? "input-error" : ""}
                />
                {fieldErrors.address && (
                    <p className="field-error">{fieldErrors.address}</p>
                )}

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldErrors.password ? "input-error" : ""}
                />
                {fieldErrors.password ? (
                    <p className="field-error">{fieldErrors.password}</p>
                ) : (
                    <p className="field-hint">8-16 chars, 1 uppercase, 1 special</p>
                )}

                <label>Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldErrors.confirmPassword ? "input-error" : ""}
                />
                {fieldErrors.confirmPassword && (
                    <p className="field-error">{fieldErrors.confirmPassword}</p>
                )}

                <button type="submit" className="auth-submit-btn">
                    Sign Up
                </button>

            </form>

            <p className="auth-switch-link">
                Already have an account? <Link to="/login">Sign in instead</Link>
            </p>
        </div>
    );
};

export default Signup;