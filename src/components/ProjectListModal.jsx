function ProjectListModal({ isOpen, onClose, projects, loading, errorMsg, onLoadProject, onDeleteProject }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px"
        }} onClick={onClose}>
            <div className="container" style={{
                maxWidth: "560px",
                width: "100%",
                textAlign: "left",
                position: "relative",
                animation: "fadeIn 0.25s ease",
                border: "1px solid var(--border-highlight)"
            }} onClick={(e) => e.stopPropagation()}>
                
                <button onClick={onClose} style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "transparent",
                    border: "none",
                    fontSize: "20px",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    boxShadow: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <SvgIcon name="close" size={18} />
                </button>

                <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "6px", color: "var(--text-primary)", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                    <SvgIcon name="folder" size={22} color="var(--accent-glow)" /> Cloud Saved Projects
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "18px" }}>
                    Select a project from your account to restore your timeline, settings, and overlays.
                </p>

                {errorMsg && (
                    <div style={{
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        color: "#fca5a5",
                        padding: "10px 14px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "13px",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        <SvgIcon name="alert" size={16} color="#fca5a5" /> {errorMsg}
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: "center", padding: "30px 0", color: "var(--text-secondary)" }}>
                        Loading your saved projects...
                    </div>
                ) : projects.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "30px 0", color: "var(--text-muted)" }}>
                        No saved projects found in your database account.
                    </div>
                ) : (
                    <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingRight: "5px" }}>
                        {projects.map((proj) => (
                            <div key={proj._id} style={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--radius-sm)",
                                padding: "12px 16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: "15px", color: "var(--text-primary)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                        <SvgIcon name="clapperboard" size={15} color="var(--accent-glow)" /> {proj.projectName || proj.title || "Untitled Project"}
                                    </h4>
                                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                                        Updated: {new Date(proj.updatedAt || proj.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <button onClick={() => { onLoadProject(proj); onClose(); }} style={{ padding: "6px 12px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                        <SvgIcon name="folder" size={13} /> Load
                                    </button>
                                    <button onClick={() => onDeleteProject(proj._id)} style={{ padding: "6px 12px", fontSize: "13px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                        <SvgIcon name="trash" size={13} color="#fca5a5" /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

window.ProjectListModal = ProjectListModal;
