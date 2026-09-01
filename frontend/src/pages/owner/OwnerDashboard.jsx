import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";
import StatHeroCard from "../../components/StatHeroCard";
import RatersTable from "../../components/RatersTable";
import "./OwnerDashboard.css";

const OwnerDashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await axiosInstance.get("/owner/dashboard");
                setDashboard(response.data);

            } catch (err) {
                setError(
                    err.response?.data?.message || "Failed to load dashboard"
                );
            }
        };

        fetchDashboard();
    }, []);

    if (error) {
        return (
            <div>
                <Navbar />
                <p style={{ padding: 24, color: "red" }}>{error}</p>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div>
                <Navbar />
                <p style={{ padding: 24 }}>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar />

            <div className="owner-dashboard-container">
                <h1>Owner Overview</h1>

                <StatHeroCard
                    label={`Your Store: ${dashboard.store.name}`}
                    rating={dashboard.averageRating}
                />

                <h2>User Ratings Received</h2>

                <RatersTable raters={dashboard.raters} />
            </div>
        </div>
    );
};

export default OwnerDashboard;