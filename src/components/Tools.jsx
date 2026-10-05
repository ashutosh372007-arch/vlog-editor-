function Tools({ undoAction, redoAction, canUndo, canRedo, saveProject, loadProject, scrollToSection, exportVideo, onEndEditing }) {
    return (
        <div className="tools">
            <button id="undoBtnNav" onClick={undoAction} disabled={!canUndo} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="undo" size={14} /> Undo
            </button>
            <button id="redoBtnNav" onClick={redoAction} disabled={!canRedo} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="redo" size={14} /> Redo
            </button>
            <button onClick={saveProject} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="save" size={14} /> Save Project
            </button>
            <button onClick={loadProject} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="folder" size={14} /> Load Project
            </button>
            <button onClick={() => scrollToSection("trimPanel", "trim")} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="scissors" size={14} /> Trim
            </button>
            <button onClick={() => scrollToSection("textEditor", "text")} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="type" size={14} /> Add Text
            </button>
            <button onClick={() => scrollToSection("musicControls", "audio")} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="music" size={14} /> Add Music
            </button>
            <button onClick={() => scrollToSection("voicePanel", "ai")} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="mic" size={14} /> AI Voice
            </button>
            <button onClick={() => scrollToSection("aiAudioGeneratorPanel", "ai")} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="wand" size={14} /> AI Audio
            </button>
            <button onClick={() => scrollToSection("effectsEditor", "transitions")} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="sparkles" size={14} /> Effects
            </button>
            <button onClick={exportVideo} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="download" size={14} /> Export
            </button>
            <button onClick={onEndEditing} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SvgIcon name="stop" size={13} color="#ef4444" /> End Editing
            </button>
        </div>
    );
}

window.Tools = Tools;
