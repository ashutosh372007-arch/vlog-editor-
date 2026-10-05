function SpeedPanel({ speed, handleSpeedChange }) {
    return (
        <div className="speed-panel" id="speedPanel">
            <h3 style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <SvgIcon name="zap" size={18} /> Video Speed
            </h3>
            <select id="speedControl" value={speed} onChange={(e) => handleSpeedChange(Number(e.target.value))}>
                <option value="0.25">0.25x</option>
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x Normal</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
            </select>
        </div>
    );
}

window.SpeedPanel = SpeedPanel;
