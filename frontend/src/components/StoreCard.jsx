import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import "./StoreCard.css";

const StoreCard = ({ store, onSubmitRating }) => {

    const [selectedRating, setSelectedRating] = useState(
        store.user_rating || 0
    );
    const [isSaving, setIsSaving] = useState(false);

    // Keep local rating in sync if the store prop changes underneath us
    // (e.g. after a refetch)
    useEffect(() => {
        setSelectedRating(store.user_rating || 0);
    }, [store.user_rating]);

    const hasExistingRating = Boolean(store.user_rating);
    const isUnchanged = hasExistingRating && selectedRating === store.user_rating;

    const handleSubmit = async () => {
        if (selectedRating === 0 || isUnchanged || isSaving) return;

        setIsSaving(true);
        try {
            await onSubmitRating(store.id, selectedRating);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="store-card">
            <div className="store-info">
                <h3>{store.name}</h3>
                <p className="store-address">{store.address}</p>
            </div>

            <div className="store-rating-block">
                <div className="rating-column">
                    <span className="rating-label">Overall Rating</span>
                    <StarRating rating={store.overall_rating || 0} />
                    <span className="rating-number">
                        {store.overall_rating || "No ratings yet"}
                    </span>
                </div>

                <div className="rating-column">
                    <span className="rating-label">Your Rating</span>
                    <StarRating
                        rating={selectedRating}
                        interactive={!isSaving}
                        onRate={setSelectedRating}
                    />
                </div>

                <button
                    className="submit-rating-btn"
                    onClick={handleSubmit}
                    disabled={selectedRating === 0 || isUnchanged || isSaving}
                >
                    {isSaving
                        ? "Saving…"
                        : hasExistingRating
                            ? "Modify Rating"
                            : "Submit Rating"}
                </button>
            </div>
        </div>
    );
};

export default StoreCard;