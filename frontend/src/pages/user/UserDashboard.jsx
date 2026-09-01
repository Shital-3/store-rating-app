import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";
import StoreCard from "../../components/StoreCard";
import "./UserDashboard.css";

const UserDashboard = () => {

    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const fetchStores = async (searchTerm) => {
        try {
            const response = await axiosInstance.get("/user/stores", {
                params: {
                    name: searchTerm,
                    address: searchTerm
                }
            });

            setStores(response.data.stores);

        } catch (err) {
            setError("Failed to load stores");
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStores(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const handleSubmitRating = async (storeId, rating) => {
        try {
            await axiosInstance.post("/user/ratings", {
                storeId,
                rating
            });

            fetchStores(search);

        } catch (err) {
            setError("Failed to submit rating");
        }
    };

    return (
        <div>
            <Navbar />

            <div className="dashboard-container">
                <h1>User Dashboard</h1>

                <input
                    type="text"
                    placeholder="Search stores by Name or Address"
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <h2>Browse Stores</h2>

                <div className="store-list">
                    {stores.map((store) => (
                        <StoreCard
                            key={store.id}
                            store={store}
                            onSubmitRating={handleSubmitRating}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;