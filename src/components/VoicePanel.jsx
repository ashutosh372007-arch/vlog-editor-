function VoicePanel({ aiVoice, setAiVoice, generateSpeech, isGenerating, togglePlayVoice, applyVoiceToVideo, clearVoice, saveState }) {
    const [voices, setVoices] = React.useState([]);

    React.useEffect(() => {
        const updateVoices = () => {
            if ('speechSynthesis' in window) {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);
            }
        };

        updateVoices();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = updateVoices;
        }
    }, []);

    return (
        <div className="audio-controls" id="voicePanel" style={{ marginTop: "20px" }}>
            <h3 style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <SvgIcon name="mic" size={18} color="var(--accent-glow)" /> AI Voiceover (Text to Speech)
            </h3>

            <label>Voiceover Script Text (Hindi / Hinglish / English)</label>
            <textarea
                id="aiVoiceTextInput"
                rows="3"
                placeholder="यहाँ अपना हिंदी या हिंग्लिश टेक्स्ट लिखें (उदा: 'नमस्ते दोस्तों, आज के इस नए ब्लॉग में आपका स्वागत है...')..."
                value={aiVoice.text}
                onChange={(e) => {
                    const textVal = e.target.value;
                    setAiVoice(prev => ({ ...prev, text: textVal }));
                    saveState();
                }}
                style={{ width: "100%", padding: "8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-input)", color: "var(--text-primary)", fontFamily: "inherit" }}
            />

            {/* Quick Hindi Samples */}
            <div style={{ margin: "8px 0" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Hindi Samples:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {[
                        "नमस्ते दोस्तों, आज के इस ब्लॉग में आपका स्वागत है!",
                        "आज हम घूमने जा रहे हैं एक सुंदर प्राकृतिक गांव में।",
                        "अगर आपको यह ब्लॉग पसंद आए तो लाइक और सब्सक्राइब करें!"
                    ].map((sample, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => {
                                setAiVoice(prev => ({ ...prev, text: sample }));
                                saveState();
                            }}
                            style={{ padding: "4px 8px", fontSize: "11px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-secondary)", borderRadius: "12px" }}
                        >
                            {sample.slice(0, 30)}...
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <div style={{ flex: 1 }}>
                    <label>Select AI Voice</label>
                    <select
                        id="aiVoiceSelect"
                        value={aiVoice.voiceURI}
                        onChange={(e) => {
                            const uri = e.target.value;
                            setAiVoice(prev => ({ ...prev, voiceURI: uri }));
                            saveState();
                        }}
                    >
                        <option value="">Default System Voice</option>
                        {voices.map(v => (
                            <option key={v.voiceURI} value={v.voiceURI}>
                                {v.name} ({v.lang})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ width: "100px" }}>
                    <label>Pitch</label>
                    <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={aiVoice.pitch}
                        onChange={(e) => {
                            const pitchVal = Number(e.target.value);
                            setAiVoice(prev => ({ ...prev, pitch: pitchVal }));
                            saveState();
                        }}
                    />
                </div>

                <div style={{ width: "100px" }}>
                    <label>Speed</label>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={aiVoice.rate}
                        onChange={(e) => {
                            const rateVal = Number(e.target.value);
                            setAiVoice(prev => ({ ...prev, rate: rateVal }));
                            saveState();
                        }}
                    />
                </div>
            </div>

            <label style={{ marginTop: "10px", display: "block" }}>
                Voiceover Volume <span style={{ color: "#818cf8", fontWeight: "normal", marginLeft: "5px" }}>{Math.round(aiVoice.volume * 100)}%</span>
            </label>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={aiVoice.volume}
                onChange={(e) => {
                    const vol = Number(e.target.value);
                    setAiVoice(prev => ({ ...prev, volume: vol }));
                    saveState();
                }}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                <button
                    id="generateSpeechBtn"
                    onClick={generateSpeech}
                    disabled={isGenerating || !aiVoice.text.trim()}
                    style={{ flex: 2, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                    <SvgIcon name="sparkles" size={14} /> {isGenerating ? "Generating..." : "Generate AI Voice"}
                </button>
                <button
                    id="playVoiceBtn"
                    onClick={() => togglePlayVoice(true)}
                    disabled={!aiVoice.isGenerated}
                    style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                    <SvgIcon name="play" size={13} /> Preview
                </button>
                <button
                    id="applyVoiceToVideoBtn"
                    onClick={applyVoiceToVideo}
                    disabled={!aiVoice.isGenerated}
                    style={{
                        flex: 1.8,
                        background: aiVoice.isGenerated ? "var(--primary-gradient)" : "rgba(56, 189, 248, 0.2)",
                        border: aiVoice.isGenerated ? "none" : "1px solid rgba(56, 189, 248, 0.4)",
                        color: "#ffffff",
                        fontWeight: "700",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                    }}
                >
                    <SvgIcon name="plus" size={13} /> Apply to Video
                </button>
                <button
                    id="clearVoiceBtn"
                    onClick={clearVoice}
                    disabled={!aiVoice.isGenerated && !aiVoice.text}
                    style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                    <SvgIcon name="close" size={13} /> Clear
                </button>
            </div>
        </div>
    );
}

window.VoicePanel = VoicePanel;
