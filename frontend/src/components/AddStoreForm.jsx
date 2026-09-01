import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "./AddUserForm.css";

const AddStoreForm = ({ onSuccess }) => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });

    const [owners, setOwners] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await axiosInstance.get("/admin/users", {
                    params: { role: "OWNER" }
                });

                setOwners(response.data.users);

            } catch (err) {
                setError("Failed to load store owners");
            }
        };

        fetchOwners();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.address) {
            setError("Name, email and address are required");
            return;
        }

        setError("");

        try {
            await axiosInstance.post("/admin/stores", {
                ...formData,
                owner_id: formData.owner_id || null
            });

            onSuccess();

        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to create store"
            );
        }
    };

    return (
        <form className="add-user-form" onSubmit={handleSubmit}>

            {error && <p className="form-error">{error}</p>}

            <label>Store Name</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
            />

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

            <label>Store Owner</label>
            <select
                name="owner_id"
                value={formData.owner_id}
                onChange={handleChange}
            >
                <option value="">No owner assigned</option>
                {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                        {owner.name} ({owner.email})
                    </option>
                ))}
            </select>

            <button type="submit" className="submit-btn">
                Add Store
            </button>

        </form>
    );
};

export default AddStoreForm;