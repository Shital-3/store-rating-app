import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import StarRating from "../../components/StarRating";
import "./UserDetailPage.css";

const UserDetailPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(`/admin/users/${userId}`);
                setUser(response.data.user);
            } catch {
                setError("Failed to load user details");
            }
        };

        fetchUser();
    }, [userId]);

    return (
        <div className="page-container">
            <div className="page-header">
                <button className="back-link" onClick={() => navigate(-1)}>
                    ← Back to User Management
                </button>
                <h1>User Details</h1>
            </div>

            {error && <p className="form-error">{error}</p>}

            {user && (
                <div className="detail-card">
                    <div className="detail-row">
                        <span className="detail-label">Name</span>
                        <span className="detail-value">{user.name}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">{user.email}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Address</span>
                        <span className="detail-value">{user.address}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Role</span>
                        <span className="detail-value">{user.role}</span>
                    </div>

                    {user.role === "OWNER" && (
                        <div className="detail-row">
                            <span className="detail-label">Store Rating</span>
                            <span className="detail-value">
                                {user.rating !== null ? (
                                    <StarRating rating={Math.round(user.rating)} />
                                ) : (
                                    "No ratings yet"
                                )}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserDetailPage;