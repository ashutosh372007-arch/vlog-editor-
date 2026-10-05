function MusicControls({ musicInputRef, musicRef, music, handleMusicChange, setMusic, togglePlayMusic, playVideoWithMusic }) {
    return (
        <div className="audio-controls" id="audioControls">
            <h3 style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <SvgIcon name="music" size={18} /> Background Music
            </h3>
            <label>Upload Audio File</label>
            <input type="file" ref={musicInputRef} id="musicInput" accept="audio/*" onChange={handleMusicChange} />
            {music.fileName && (
                <p id="musicFileName" style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "-5px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    <SvgIcon name="music" size={13} /> Selected: {music.fileName}
                </p>
            )}
            
            <audio ref={musicRef} id="musicPlayer" src={music.src || undefined} controls style={{ display: music.src ? "block" : "none", width: "100%", marginTop: "5px" }} />

            <label>Music Volume <span id="musicVolumeVal" style={{ color: "#818cf8", fontWeight: "normal", marginLeft: "5px" }}>{Math.round(music.volume * 100)}%</span></label>
            <input type="range" id="musicVolume" min="0" max="1" step="0.01" value={music.volume} onChange={(e) => { const v = Number(e.target.value); setMusic(prev => ({ ...prev, volume: v })); if (musicRef.current) musicRef.current.volume = v; }} />

            <div style={{ display: "flex", gap: "10px", marginTop: "5px", flexWrap: "wrap" }}>
                <button id="playMusicBtn" onClick={() => togglePlayMusic(true)} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <SvgIcon name="play" size={13} /> Play Music
                </button>
                <button id="pauseMusicBtn" onClick={() => togglePlayMusic(false)} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <SvgIcon name="pause" size={13} /> Pause Music
                </button>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                <button id="applyMusicToVideoBtn" onClick={playVideoWithMusic} disabled={!music.src} style={{ flex: 1, background: music.src ? "var(--primary-gradient)" : undefined, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <SvgIcon name="plus" size={13} /> Apply Audio to Video
                </button>
                <button id="playWithMusicBtn" onClick={playVideoWithMusic} disabled={!music.src} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <SvgIcon name="clapperboard" size={15} /> Preview Video + Music
                </button>
            </div>
        </div>
    );
}

window.MusicControls = MusicControls;
