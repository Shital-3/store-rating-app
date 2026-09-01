import StarRating from "./StarRating";
import "./StatHeroCard.css";

const StatHeroCard = ({ label, rating }) => {

    return (
        <div className="hero-card">
            <span className="hero-label">{label}</span>
            <div className="hero-value">
                {rating !== null ? `${rating} / 5` : "No ratings yet"}
            </div>
            {rating !== null && <StarRating rating={Math.round(rating)} />}
        </div>
    );
};

export default StatHeroCard;