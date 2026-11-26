import { useState } from "react";
import StarRating from "./StarRating";
import "./StoreCard.css";

const StoreCard = ({ store, onSubmitRating }) => {

    const [ratingSelection, setRatingSelection] = useState({
        storeId: store.id,
        value: store.user_rating || 0
    });
    const [isSaving, setIsSaving] = useState(false);
    const selectedRating =
        ratingSelection.storeId === store.id
            ? ratingSelection.value
            : (store.user_rating || 0);

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
                        onRate={(value) =>
                            setRatingSelection({ storeId: store.id, value })
                        }
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