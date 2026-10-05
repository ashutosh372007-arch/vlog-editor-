function AuthModal({ isOpen, onClose, authMode, setAuthMode, onLoginSuccess }) {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errorMsg, setErrorMsg] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        const endpoint = authMode === "signup" ? "/api/auth/signup" : "/api/auth/login";
        const payload = authMode === "signup" ? { name, email, password } : { email, password };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Authentication failed. Please check your details.");
            }

            // Save user and token
            localStorage.setItem("vlog_token", data.token);
            localStorage.setItem("vlog_user", JSON.stringify(data.user));

            onLoginSuccess(data.user, data.token);
            onClose();

            // Reset inputs
            setName("");
            setEmail("");
            setPassword("");
        } catch (err) {
            setErrorMsg(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

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
                maxWidth: "420px",
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

                <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "8px", color: "var(--text-primary)", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                    {authMode === "signup" ? <SvgIcon name="rocket" size={24} color="var(--accent-glow)" /> : <SvgIcon name="key" size={24} color="var(--accent-glow)" />}
                    {authMode === "signup" ? "Create Account" : "Welcome Back"}
                </h2>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
                    {authMode === "signup" ? "Sign up to save and manage your vlog projects in the cloud." : "Log in to access your saved vlog projects."}
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

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {authMode === "signup" && (
                        <div>
                            <label style={{ display: "block", marginBottom: "6px" }}>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{ width: "100%" }}
                            />
                        </div>
                    )}

                    <div>
                        <label style={{ display: "block", marginBottom: "6px" }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "6px" }}>Password</label>
                        <input
                            type="password"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: "100%" }}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={{
                        marginTop: "8px",
                        width: "100%",
                        background: "var(--primary-gradient)",
                        color: "#fff",
                        fontWeight: "700",
                        padding: "12px",
                        fontSize: "15px",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer"
                    }}>
                        {loading ? "Please wait..." : (authMode === "signup" ? "Sign Up" : "Log In")}
                    </button>
                </form>

                <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "var(--text-secondary)" }}>
                    {authMode === "signup" ? "Already have an account? " : "Don't have an account? "}
                    <button
                        onClick={() => { setAuthMode(authMode === "signup" ? "login" : "signup"); setErrorMsg(""); }}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#818cf8",
                            cursor: "pointer",
                            fontWeight: "700",
                            padding: 0,
                            boxShadow: "none",
                            fontSize: "14px",
                            textDecoration: "underline"
                        }}
                    >
                        {authMode === "signup" ? "Log In" : "Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}

window.AuthModal = AuthModal;
