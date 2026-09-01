import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import StatCard from "../../components/StatCard";
import "./AdminDashboard.css";

const AdminDashboard = () => {

    const [stats, setStats] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosInstance.get("/admin/dashboard");
                setStats(response.data);

            } catch (err) {
                setError("Failed to load dashboard stats");
            }
        };

        fetchStats();
    }, []);

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!stats) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Admin Overview</h1>

            <div className="stats-row">
                <StatCard label="Total Users" value={stats.totalUsers} />
                <StatCard label="Total Stores" value={stats.totalStores} />
                <StatCard label="Total Ratings" value={stats.totalRatings} />
            </div>
        </div>
    );
};

export default AdminDashboard;