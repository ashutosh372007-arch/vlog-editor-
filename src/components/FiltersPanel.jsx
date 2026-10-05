function FiltersPanel({ filters, handleFilterChange, applyPreset, resetFilters }) {
    return (
        <div className="filters" id="filtersPanel">
            <h3 style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <SvgIcon name="palette" size={18} /> Video Filters
            </h3>
            <label>Filter Presets</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                <button type="button" className="filter-preset-btn" onClick={() => applyPreset("normal")} style={{ flex: 1, padding: "6px 10px", fontSize: "13px" }}>Normal</button>
                <button type="button" className="filter-preset-btn" onClick={() => applyPreset("grayscale")} style={{ flex: 1, padding: "6px 10px", fontSize: "13px" }}>Grayscale</button>
                <button type="button" className="filter-preset-btn" onClick={() => applyPreset("sepia")} style={{ flex: 1, padding: "6px 10px", fontSize: "13px" }}>Sepia</button>
                <button type="button" className="filter-preset-btn" onClick={() => applyPreset("vintage")} style={{ flex: 1, padding: "6px 10px", fontSize: "13px" }}>Vintage</button>
                <button type="button" className="filter-preset-btn" onClick={() => applyPreset("invert")} style={{ flex: 1, padding: "6px 10px", fontSize: "13px" }}>Invert</button>
            </div>

            <label>Brightness <span id="brightnessVal" style={{ color: "#818cf8", fontWeight: "normal", marginLeft: "5px" }}>{filters.brightness}%</span></label>
            <input type="range" id="brightness" min="0" max="200" value={filters.brightness} onChange={(e) => handleFilterChange("brightness", e.target.value)} />

            <label>Contrast <span id="contrastVal" style={{ color: "#818cf8", fontWeight: "normal", marginLeft: "5px" }}>{filters.contrast}%</span></label>
            <input type="range" id="contrast" min="0" max="200" value={filters.contrast} onChange={(e) => handleFilterChange("contrast", e.target.value)} />

            <label>Saturation <span id="saturationVal" style={{ color: "#818cf8", fontWeight: "normal", marginLeft: "5px" }}>{filters.saturation}%</span></label>
            <input type="range" id="saturation" min="0" max="200" value={filters.saturation} onChange={(e) => handleFilterChange("saturation", e.target.value)} />

            <label>Grayscale <span id="grayscaleVal" style={{ color: "#818cf8", fontWeight: "normal", marginLeft: "5px" }}>{filters.grayscale}%</span></label>
            <input type="range" id="grayscale" min="0" max="100" value={filters.grayscale} onChange={(e) => handleFilterChange("grayscale", e.target.value)} />

            <label>Sepia <span id="sepiaVal" style={{ color: "#818cf8", fontWeight: "normal", marginLeft: "5px" }}>{filters.sepia}%</span></label>
            <input type="range" id="sepia" min="0" max="100" value={filters.sepia} onChange={(e) => handleFilterChange("sepia", e.target.value)} />

            <label>Invert <span id="invertVal" style={{ color: "#818cf8", fontWeight: "normal", marginLeft: "5px" }}>{filters.invert}%</span></label>
            <input type="range" id="invert" min="0" max="100" value={filters.invert} onChange={(e) => handleFilterChange("invert", e.target.value)} />

            <label>Blur <span id="blurVal" style={{ color: "#818cf8", fontWeight: "normal", marginLeft: "5px" }}>{filters.blur}px</span></label>
            <input type="range" id="blur" min="0" max="10" step="0.5" value={filters.blur} onChange={(e) => handleFilterChange("blur", e.target.value)} />

            <button id="resetFilters" onClick={resetFilters} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <SvgIcon name="refresh" size={14} /> Reset Filters
            </button>
        </div>
    );
}

window.FiltersPanel = FiltersPanel;
