import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axiosInstance.post("/auth/login", {
                email,
                password
            });

            const { token, user } = response.data;

            login(token, user);

            if (user.role === "ADMIN") navigate("/admin");
            else if (user.role === "OWNER") navigate("/owner");
            else navigate("/user");

        } catch (err) {
            const message = err.response?.data?.message || "Login failed";
            setError(message);
        }
    };

    return (
        <div className="auth-container">
            <h1>Sign In</h1>

            {error && <p className="form-error-banner">{error}</p>}

            <form onSubmit={handleSubmit}>

                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="auth-submit-btn">
                    Sign In
                </button>

            </form>

            <p className="auth-switch-link">
                New here? <Link to="/signup">Create an account</Link>
            </p>
        </div>
    );
};

export default Login;