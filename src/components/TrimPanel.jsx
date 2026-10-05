function TrimPanel({ trim, duration, handleStartTrim, handleEndTrim, previewTrimmedClip, exportVideo, exportState, formatTime }) {
    return (
        <div className="trim-panel" id="trimPanel">
            <h3 style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <SvgIcon name="scissors" size={18} /> Trim Video
            </h3>
            <div className="trim-times">
                <span>Start: <b id="trimStart">{formatTime(trim.start)}</b></span>
                <span>End: <b id="trimEnd">{formatTime(trim.end)}</b></span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "10px 0" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "4px" }}>Start Cut (sec)</label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input type="range" id="startRange" min="0" max={duration || 100} step="0.1" value={trim.start} onChange={(e) => handleStartTrim(e.target.value)} style={{ flex: 1 }} />
                        <input type="number" id="startTime" min="0" step="0.1" value={trim.start} onChange={(e) => handleStartTrim(e.target.value)} style={{ width: "90px" }} />
                    </div>
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "4px" }}>End Cut (sec)</label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input type="range" id="endRange" min="0" max={duration || 100} step="0.1" value={trim.end} onChange={(e) => handleEndTrim(e.target.value)} style={{ flex: 1 }} />
                        <input type="number" id="endTime" min="0" step="0.1" value={trim.end} onChange={(e) => handleEndTrim(e.target.value)} style={{ width: "90px" }} />
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
                <button id="previewTrim" onClick={previewTrimmedClip} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <SvgIcon name="play" size={13} /> Preview Trimmed Clip
                </button>
                <button id="trimBtn" onClick={previewTrimmedClip} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <SvgIcon name="scissors" size={13} /> Apply Trim
                </button>
            </div>

            <button id="exportBtn" onClick={exportVideo} disabled={exportState.isExporting} style={{ marginTop: "10px", width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {exportState.isExporting ? <SvgIcon name="clock" size={16} /> : <SvgIcon name="download" size={16} />}
                {exportState.isExporting ? "Exporting Video..." : "Export & Download Video"}
            </button>

            {(exportState.isExporting || exportState.progress > 0) && (
                <div id="exportProgressContainer" style={{ display: "block", marginTop: "12px", background: "rgba(0,0,0,0.25)", padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span id="exportStatus" style={{ fontSize: "13px", color: "#38bdf8", fontWeight: 600 }}>{exportState.status}</span>
                        <span id="exportPercentage" style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 700 }}>{Math.round(exportState.progress)}%</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "10px", height: "8px", overflow: "hidden" }}>
                        <div id="exportProgressBar" style={{ width: `${exportState.progress}%`, height: "100%", background: "var(--primary-gradient)", transition: "width 0.2s ease" }}></div>
                    </div>
                </div>
            )}
        </div>
    );
}

window.TrimPanel = TrimPanel;
