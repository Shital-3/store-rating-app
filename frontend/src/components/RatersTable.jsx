import StarRating from "./StarRating";
import "./RatersTable.css";

const formatDate = (isoString) => {
    if (!isoString) return "—";

    const date = new Date(isoString);

    return date.toLocaleDateString("en-GB") + ", " +
        date.toLocaleTimeString("en-GB");
};

const RatersTable = ({ raters }) => {

    if (raters.length === 0) {
        return <p className="no-raters">No ratings submitted yet.</p>;
    }

    return (
        <div className="table-wrapper">
            <table className="raters-table">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Rating</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {raters.map((rater) => (
                        <tr key={rater.id}>
                            <td>{rater.name}</td>
                            <td>
                                <StarRating rating={rater.rating} />
                            </td>
                            <td>{formatDate(rater.rated_at)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RatersTable;