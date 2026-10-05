function VideoControls({ videoInputRef, handleVideoChange, togglePlayPause, toggleMute, isMuted, volume, handleVolumeChange }) {
    return (
        <div className="video-controls">
            <input type="file" ref={videoInputRef} id="videoInput" accept="video/*" onChange={handleVideoChange} />
            <button id="playBtn" onClick={togglePlayPause} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="play" size={14} /> Play
            </button>
            <button id="pauseBtn" onClick={togglePlayPause} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="pause" size={14} /> Pause
            </button>
            <button id="muteBtn" onClick={toggleMute} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                {isMuted ? <SvgIcon name="volumeUp" size={15} /> : <SvgIcon name="volumeMute" size={15} />}
                {isMuted ? "Unmute" : "Mute"}
            </button>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "180px", maxWidth: "300px" }}>
                <label htmlFor="volumeSlider" style={{ margin: 0, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    <SvgIcon name="volumeUp" size={15} /> Volume
                </label>
                <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value={volume} onChange={(e) => handleVolumeChange(Number(e.target.value))} />
            </div>
        </div>
    );
}

window.VideoControls = VideoControls;
