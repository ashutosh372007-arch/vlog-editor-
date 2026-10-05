function Timeline({ currentTime, duration, handleSeek, formatTime, aiVoice, music, aiAudio }) {
    return (
        <div className="timeline" id="timelineSection">
            <h3 style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <SvgIcon name="film" size={18} /> Video Timeline
            </h3>
            <div className="time-display" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="clock" size={15} /> <span id="currentTime">{formatTime(currentTime)}</span> / <span id="duration">{formatTime(duration)}</span>
            </div>
            <input
                type="range"
                id="timelineBar"
                min="0"
                max={duration || 100}
                value={currentTime}
                step="0.1"
                onChange={(e) => handleSeek(Number(e.target.value))}
                title="Drag to seek video"
            />
            <div className="timeline-track" style={{ marginBottom: "8px" }}>
                <div className="track-label">VIDEO</div>
                <div className="clip" id="videoClip" style={{ width: `${Math.min(700, Math.max(120, duration * 10))}px`, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <SvgIcon name="clapperboard" size={14} /> Vlog Track
                </div>
            </div>

            {aiAudio && aiAudio.isGenerated && aiAudio.addedToTimeline && (
                <div className="timeline-track" style={{ marginBottom: "8px" }}>
                    <div className="track-label" style={{ color: "#38bdf8" }}>AI AUDIO</div>
                    <div className="clip" id="aiAudioTrackClip" style={{ width: `${Math.min(700, Math.max(120, duration * 10))}px`, background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <SvgIcon name="wand" size={14} color="#fff" /> {aiAudio.title || "AI Sound Track"}
                    </div>
                </div>
            )}

            {aiVoice && aiVoice.isGenerated && (
                <div className="timeline-track" style={{ marginBottom: "8px" }}>
                    <div className="track-label" style={{ color: "#38bdf8" }}>VOICE</div>
                    <div className="clip" id="aiVoiceTrackClip" style={{ width: `${Math.min(700, Math.max(120, (aiVoice.duration || duration || 10) * 10))}px`, background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <SvgIcon name="mic" size={14} color="#fff" /> AI Voice Track ({aiVoice.voiceURI ? "Custom" : "Default"})
                    </div>
                </div>
            )}

            {music && music.src && (
                <div className="timeline-track">
                    <div className="track-label" style={{ color: "#a855f7" }}>MUSIC</div>
                    <div className="clip" id="musicTrackClip" style={{ width: `${Math.min(700, Math.max(120, duration * 10))}px`, background: "linear-gradient(135deg, #7e22ce 0%, #6b21a8 100%)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <SvgIcon name="music" size={14} color="#fff" /> Background Audio Track
                    </div>
                </div>
            )}
        </div>
    );
}

window.Timeline = Timeline;
