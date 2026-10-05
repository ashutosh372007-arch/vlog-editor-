function Header({ user, onOpenAuth, onLogout, theme, toggleTheme, saveProject, loadProject, undoAction, redoAction, canUndo, canRedo, onEndEditing, projectFileInputRef, handleProjectFileChange }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "10px" }}>
            <h1 style={{ marginBottom: 0, display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <SvgIcon name="clapperboard" size={28} color="var(--accent-glow)" /> Vlog Editor
            </h1>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <button id="themeToggleBtn" onClick={toggleTheme} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    {theme === "light" ? <SvgIcon name="sun" size={14} /> : <SvgIcon name="moon" size={14} />}
                    {theme === "light" ? "Light" : "Dark"}
                </button>
                <button id="saveProjectBtn" onClick={saveProject} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <SvgIcon name="save" size={14} /> Save Project
                </button>
                <button id="loadProjectBtn" onClick={loadProject} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <SvgIcon name="folder" size={14} /> Load Project
                </button>
                <input type="file" ref={projectFileInputRef} id="projectFileInput" accept=".json,.vlogproj" style={{ display: "none" }} onChange={handleProjectFileChange} />
                <button id="undoBtn" onClick={undoAction} disabled={!canUndo} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <SvgIcon name="undo" size={14} /> Undo
                </button>
                <button id="redoBtn" onClick={redoAction} disabled={!canRedo} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <SvgIcon name="redo" size={14} /> Redo
                </button>
                
                {user ? (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                            <SvgIcon name="user" size={14} /> {user.name}
                        </span>
                        <button onClick={onLogout} style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                            <SvgIcon name="logOut" size={14} color="#fca5a5" /> Logout
                        </button>
                    </div>
                ) : (
                    <button onClick={() => onOpenAuth("login")} style={{ background: "var(--primary-gradient)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <SvgIcon name="key" size={14} /> Login / Signup
                    </button>
                )}

                <button id="endEditingBtn" onClick={onEndEditing} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <SvgIcon name="stop" size={13} color="#ef4444" /> End Editing
                </button>
            </div>
        </div>
    );
}

window.Header = Header;
