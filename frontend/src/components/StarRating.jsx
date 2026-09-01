import "./StarRating.css";

const StarRating = ({ rating, interactive = false, onRate }) => {

    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="star-rating">
            {stars.map((star) => (
                <span
                    key={star}
                    className={
                        star <= rating ? "star filled" : "star"
                    }
                    onClick={
                        interactive ? () => onRate(star) : undefined
                    }
                    style={{
                        cursor: interactive ? "pointer" : "default"
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRating;