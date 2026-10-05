function TextEditor({ text, setText, textInputVal, setTextInputVal, applyTextOverlay, clearTextOverlay, saveState }) {
    return (
        <div className="text-editor" id="textEditor">
            <h3 style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <SvgIcon name="type" size={18} /> Text Overlay
            </h3>
            <input type="text" id="textInput" placeholder="Enter text overlay here..." value={textInputVal} onChange={(e) => setTextInputVal(e.target.value)} />
            
            <div style={{ display: "flex", gap: "10px" }}>
                <button id="addTextBtn" onClick={applyTextOverlay} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <SvgIcon name="plus" size={14} /> Apply Text
                </button>
                <button id="clearTextBtn" onClick={clearTextOverlay} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", boxShadow: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <SvgIcon name="close" size={14} /> Clear Text
                </button>
            </div>

            <label>Text Size <span id="textSizeVal" style={{ color: "#818cf8", fontWeight: "normal", marginLeft: "5px" }}>{text.size}px</span></label>
            <input type="range" id="textSize" min="14" max="72" value={text.size} onChange={(e) => { setText(prev => ({ ...prev, size: Number(e.target.value) })); saveState(); }} />

            <label>Text Color</label>
            <input type="color" id="textColor" value={text.color} onChange={(e) => { setText(prev => ({ ...prev, color: e.target.value })); saveState(); }} />

            <label>Text Position</label>
            <select id="textPosition" value={text.position} onChange={(e) => { setText(prev => ({ ...prev, position: e.target.value })); saveState(); }}>
                <option value="top">Top</option>
                <option value="center">Center</option>
                <option value="bottom">Bottom</option>
            </select>

            <label>Font Style</label>
            <select id="fontStyle" value={text.fontStyle} onChange={(e) => { setText(prev => ({ ...prev, fontStyle: e.target.value })); saveState(); }}>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Courier New">Courier New</option>
                <option value="Impact">Impact</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
            </select>
        </div>
    );
}

window.TextEditor = TextEditor;
