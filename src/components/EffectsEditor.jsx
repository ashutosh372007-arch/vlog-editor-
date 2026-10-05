function EffectsEditor({ filters, handleFilterChange, resetFilters, imageInputRef, handleImageChange, overlay, setOverlay, removeImageOverlay, saveState }) {
    return (
        <div className="effects-editor" id="effectsEditor">
            <h3 style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <SvgIcon name="sparkles" size={18} /> Video Effects
            </h3>
            <label>Brightness</label>
            <input type="range" id="brightness" min="0" max="200" value={filters.brightness} onChange={(e) => handleFilterChange("brightness", e.target.value)} />
            <br /><br />
            <label>Contrast</label>
            <input type="range" id="contrast" min="0" max="200" value={filters.contrast} onChange={(e) => handleFilterChange("contrast", e.target.value)} />
            <br /><br />
            <label>Saturation</label>
            <input type="range" id="saturation" min="0" max="200" value={filters.saturation} onChange={(e) => handleFilterChange("saturation", e.target.value)} />
            <br /><br />
            <label>Grayscale</label>
            <input type="range" id="grayscale" min="0" max="100" value={filters.grayscale} onChange={(e) => handleFilterChange("grayscale", e.target.value)} />
            <br /><br />
            <label>Blur</label>
            <input type="range" id="blur" min="0" max="10" value={filters.blur} onChange={(e) => handleFilterChange("blur", e.target.value)} />
            <br /><br />
            <button id="resetFilters" onClick={resetFilters} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <SvgIcon name="refresh" size={14} /> Reset Filters
            </button>
            <br /><br />
            <label>Upload Overlay Image</label>
            <input type="file" ref={imageInputRef} id="imageInput" accept="image/*" onChange={handleImageChange} />
            <br /><br />
            <label>Image Size</label>
            <input type="range" id="imageSize" min="50" max="300" value={overlay.width} onChange={(e) => { setOverlay(prev => ({ ...prev, width: Number(e.target.value) })); saveState(); }} />
            <br /><br />
            <button id="removeImageBtn" onClick={removeImageOverlay} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <SvgIcon name="close" size={14} /> Remove Image
            </button>
        </div>
    );
}

window.EffectsEditor = EffectsEditor;
