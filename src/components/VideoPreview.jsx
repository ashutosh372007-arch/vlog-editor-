function VideoPreview({ videoRef, videoSrc, filterCss, transitionOpacity, transitionScale, handleLoadedMetadata, handleTimeUpdate, text, overlay, selectedElement, setSelectedElement }) {
    return (
        <div className="video-preview" onClick={(e) => { if (e.target.tagName !== "DIV" && e.target.tagName !== "IMG") setSelectedElement(null); }}>
            <video
                ref={videoRef}
                id="videoPreview"
                controls
                src={videoSrc || undefined}
                style={{
                    display: videoSrc ? "block" : "none",
                    filter: filterCss,
                    opacity: transitionOpacity,
                    transform: transitionScale !== 1 ? `scale(${transitionScale})` : "none"
                }}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
            />
            
            {/* Text Overlay */}
            {text.content && (
                <div
                    id="videoText"
                    onClick={(e) => { e.stopPropagation(); setSelectedElement("text"); }}
                    style={{
                        fontSize: `${text.size}px`,
                        color: text.color,
                        fontFamily: text.fontStyle,
                        top: text.position === "top" ? "10%" : text.position === "center" ? "50%" : "auto",
                        bottom: text.position === "bottom" ? "20px" : "auto",
                        transform: text.position === "center" ? "translate(-50%, -50%)" : "translateX(-50%)",
                        outline: selectedElement === "text" ? "2px dashed #818cf8" : "none",
                        pointerEvents: "auto",
                        cursor: "pointer"
                    }}
                >
                    {text.content}
                </div>
            )}

            {/* Image Overlay */}
            {overlay.src && (
                <img
                    id="videoOverlay"
                    alt="Overlay"
                    src={overlay.src}
                    onClick={(e) => { e.stopPropagation(); setSelectedElement("overlay"); }}
                    style={{
                        display: overlay.display,
                        position: "absolute",
                        top: overlay.top,
                        right: overlay.right,
                        left: overlay.left,
                        width: typeof overlay.width === "number" ? `${overlay.width}px` : overlay.width,
                        outline: selectedElement === "overlay" ? "2px dashed #818cf8" : "none",
                        cursor: "move"
                    }}
                />
            )}
        </div>
    );
}

window.VideoPreview = VideoPreview;
