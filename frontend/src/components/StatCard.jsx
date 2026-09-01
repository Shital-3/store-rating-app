import "./StatCard.css";

const StatCard = ({ label, value }) => {

    return (
        <div className="stat-card">
            <span className="stat-label">{label}</span>
            <span className="stat-value">{value}</span>
        </div>
    );
};

export default StatCard;