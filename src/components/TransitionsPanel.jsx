function TransitionsPanel({ transition, setTransition, previewTransition, saveState }) {
    return (
        <div className="effects-editor" id="transitionsPanel">
            <h3 style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <SvgIcon name="clapperboard" size={18} /> Video Transitions
            </h3>
            <label>Transition Effect</label>
            <select id="transitionType" value={transition.type} onChange={(e) => { setTransition(prev => ({ ...prev, type: e.target.value })); saveState(); }}>
                <option value="none">None (Instant)</option>
                <option value="fadeIn">Fade In</option>
                <option value="fadeOut">Fade Out</option>
                <option value="fadeInOut">Fade In + Fade Out</option>
                <option value="crossfade">Crossfade (Zoom Dip)</option>
            </select>

            <label>Transition Duration <span id="transitionDurationVal" style={{ color: "#818cf8", fontWeight: "normal", marginLeft: "5px" }}>{parseFloat(transition.duration).toFixed(1)}s</span></label>
            <input type="range" id="transitionDuration" min="0.5" max="3" step="0.5" value={transition.duration} onChange={(e) => { setTransition(prev => ({ ...prev, duration: Number(e.target.value) })); saveState(); }} />

            <button id="previewTransitionBtn" onClick={previewTransition} style={{ marginTop: "10px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <SvgIcon name="play" size={13} /> Preview Transition
            </button>
        </div>
    );
}

window.TransitionsPanel = TransitionsPanel;
