import "./SidePanel.css";

const SidePanel = ({ isOpen, onClose, title, children }) => {

    if (!isOpen) return null;

    return (
        <div className="side-panel-overlay" onClick={onClose}>
            <div
                className="side-panel"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="side-panel-header">
                    <h2>{title}</h2>
                    <button className="side-panel-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="side-panel-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SidePanel;