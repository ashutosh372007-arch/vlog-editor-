function AiAudioGeneratorPanel({ aiAudio, setAiAudio, generateAiAudio, isGenerating, togglePlayAiAudio, addToTimeline, clearAiAudio, saveState }) {
    const samplePrompts = [
        "Create a cinematic village vlog intro with birds, soft background music, and a calm atmosphere.",
        "Upbeat travel vlog energetic background music with acoustic guitar and light percussion.",
        "Lo-fi chill aesthetic chillout beat for relaxing cooking vlog.",
        "Dramatic intro sound effect with deep bass sweep and ambient wind sound."
    ];

    return (
        <div className="audio-controls" id="aiAudioGeneratorPanel" style={{ marginTop: "20px" }}>
            <h3 style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <SvgIcon name="wand" size={18} color="var(--accent-glow)" /> AI Audio Generator (Prompt to Sound)
            </h3>

            <label>Prompt Description</label>
            <textarea
                id="aiAudioPromptInput"
                rows="3"
                placeholder="Describe the audio track, atmosphere, background music, or sound effects you want..."
                value={aiAudio.prompt}
                onChange={(e) => {
                    const val = e.target.value;
                    setAiAudio(prev => ({ ...prev, prompt: val }));
                    saveState();
                }}
                style={{ width: "100%", padding: "8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-input)", color: "var(--text-primary)", fontFamily: "inherit" }}
            />

            {/* Quick Sample Prompts */}
            <div style={{ margin: "8px 0 12px 0" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Quick Prompt Ideas:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {samplePrompts.map((p, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => {
                                setAiAudio(prev => ({ ...prev, prompt: p }));
                                saveState();
                            }}
                            style={{ padding: "4px 8px", fontSize: "11px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-secondary)", borderRadius: "12px", textAlign: "left" }}
                        >
                            {p.slice(0, 35)}...
                        </button>
                    ))}
                </div>
            </div>

            {aiAudio.isGenerated && (
                <div style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: "12px" }}>
                    <div style={{ fontSize: "13px", color: "#38bdf8", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                        <SvgIcon name="music" size={14} color="#38bdf8" /> {aiAudio.title || "AI Generated Track"}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        Prompt: "{aiAudio.prompt}"
                    </div>
                </div>
            )}

            <label style={{ display: "block" }}>
                AI Audio Volume <span style={{ color: "#818cf8", fontWeight: "normal", marginLeft: "5px" }}>{Math.round(aiAudio.volume * 100)}%</span>
            </label>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={aiAudio.volume}
                onChange={(e) => {
                    const vol = Number(e.target.value);
                    setAiAudio(prev => ({ ...prev, volume: vol }));
                    saveState();
                }}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                <button
                    id="generateAiAudioBtn"
                    onClick={() => generateAiAudio()}
                    disabled={isGenerating || !aiAudio.prompt.trim()}
                    style={{ flex: 2, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                    <SvgIcon name="wand" size={14} /> {isGenerating ? "Generating AI Track..." : "Generate AI Audio"}
                </button>
                
                {aiAudio.isGenerated && (
                    <button
                        onClick={() => generateAiAudio()}
                        disabled={isGenerating}
                        style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                    >
                        <SvgIcon name="refresh" size={13} /> Regenerate
                    </button>
                )}

                <button
                    id="playAiAudioBtn"
                    onClick={() => togglePlayAiAudio(!aiAudio.isPlaying)}
                    disabled={!aiAudio.isGenerated}
                    style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                    {aiAudio.isPlaying ? <SvgIcon name="pause" size={13} /> : <SvgIcon name="play" size={13} />}
                    {aiAudio.isPlaying ? "Pause" : "Preview"}
                </button>

                <button
                    id="applyToVideoBtn"
                    onClick={addToTimeline}
                    disabled={!aiAudio.isGenerated}
                    style={{
                        flex: 1.8,
                        background: aiAudio.addedToTimeline ? "var(--primary-gradient)" : "rgba(56, 189, 248, 0.2)",
                        border: aiAudio.addedToTimeline ? "none" : "1px solid rgba(56, 189, 248, 0.4)",
                        color: "#ffffff",
                        fontWeight: "700",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                    }}
                >
                    <SvgIcon name="plus" size={13} /> {aiAudio.addedToTimeline ? "✓ Applied to Video" : "Apply to Video"}
                </button>

                <button
                    onClick={clearAiAudio}
                    disabled={!aiAudio.isGenerated && !aiAudio.prompt}
                    style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                    <SvgIcon name="close" size={13} /> Clear
                </button>
            </div>
        </div>
    );
}

window.AiAudioGeneratorPanel = AiAudioGeneratorPanel;
