function AudioPanel({ volume, handleVolumeChange, toggleMute, isMuted }) {
    return (
        <div className="audio-panel" id="audioPanel">
            <h3 style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <SvgIcon name="volumeUp" size={18} /> Audio
            </h3>
            <input type="range" id="volumeControl" min="0" max="1" step="0.01" value={volume} onChange={(e) => handleVolumeChange(Number(e.target.value))} />
            <button id="muteBtn" onClick={toggleMute} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                {isMuted ? <SvgIcon name="volumeUp" size={15} /> : <SvgIcon name="volumeMute" size={15} />}
                {isMuted ? "Unmute" : "Mute"}
            </button>
        </div>
    );
}

window.AudioPanel = AudioPanel;
