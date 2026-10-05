function WelcomePage({ user, onOpenAuth, onLogout, theme, toggleTheme, onStart }) {
    return (
        <div className="container" id="welcomePage">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                {user ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                            <SvgIcon name="user" size={15} /> {user.name}
                        </span>
                        <button onClick={onLogout} style={{ padding: "4px 10px", fontSize: "12px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <SvgIcon name="logOut" size={13} color="#fca5a5" /> Logout
                        </button>
                    </div>
                ) : (
                    <button onClick={() => onOpenAuth("login")} style={{ padding: "6px 14px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <SvgIcon name="key" size={14} /> Login / Signup
                    </button>
                )}
                <button className="theme-toggle-welcome" onClick={toggleTheme} style={{ padding: "6px 14px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    {theme === "light" ? <SvgIcon name="sun" size={14} /> : <SvgIcon name="moon" size={14} />}
                    {theme === "light" ? "Light" : "Dark"}
                </button>
            </div>
            <h1 style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <SvgIcon name="clapperboard" size={36} color="var(--accent-glow)" /> Vlog Editor
            </h1>
            <p>Create, edit and manage your vlog videos easily.</p>

            <button id="startEditingBtn" onClick={onStart} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <SvgIcon name="rocket" size={16} /> Start Editing
            </button>
        </div>
    );
}

window.WelcomePage = WelcomePage;
