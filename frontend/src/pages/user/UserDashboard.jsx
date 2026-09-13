import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";
import StoreCard from "../../components/StoreCard";
import "./UserDashboard.css";

const UserDashboard = () => {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
        const store = stores.find((s) => s.id === storeId);
        const isModifying = Boolean(store?.user_rating);

        try {
            await axiosInstance.post("/user/ratings", {
                storeId,
                rating
            });

            setSuccess(
                isModifying
                    ? "✓ Rating modified successfully!"
                    : "✓ Rating submitted successfully!"
            );

            // Clear search and return to the full store list
            setSearch("");
            await fetchStores("");

            setTimeout(() => {
                setSuccess("");
            }, 1800);

        } catch (err) {
            setError("Failed to submit rating");
        }
    };

    return (
        <div>
            <Navbar />

            <div className="dashboard-container">
                <h1>User Dashboard</h1>

                {success && (
                    <p className="success-toast">
                        {success}
                    </p>
                )}

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