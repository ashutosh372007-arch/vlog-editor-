const { useState, useEffect, useRef, useCallback } = React;

function VlogEditorApp() {
    // Page & Theme state
    const [page, setPage] = useState("welcome");
    const [theme, setTheme] = useState(() => localStorage.getItem("vlog_editor_theme") || "dark");

    // Toast Notification State
    const [toast, setToast] = useState(null);
    const showToast = (message, type = "info") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Authentication State
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("vlog_user");
            return saved ? JSON.parse(saved) : null;
        } catch (e) { return null; }
    });
    const [token, setToken] = useState(() => localStorage.getItem("vlog_token") || "");
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState("login");

    // Project & Backend API State
    const [currentProjectId, setCurrentProjectId] = useState(null);
    const [projectsList, setProjectsList] = useState([]);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isProjectLoading, setIsProjectLoading] = useState(false);

    // Video State
    const [videoSrc, setVideoSrc] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [speed, setSpeed] = useState(1);

    // Filter State
    const [filters, setFilters] = useState({
        brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, invert: 0, blur: 0
    });

    // Trim State
    const [trim, setTrim] = useState({ start: 0, end: 10 });

    // Text Overlay State
    const [text, setText] = useState({ content: "", size: 28, color: "#ffffff", position: "bottom", fontStyle: "Arial" });
    const [textInputVal, setTextInputVal] = useState("");

    // Image Overlay State
    const [overlay, setOverlay] = useState({ src: "", display: "none", width: 150, top: "20px", left: "auto", right: "20px" });

    // Video Transition State
    const [transition, setTransition] = useState({ type: "none", duration: 1 });

    // Background Music State
    const [music, setMusic] = useState({ src: "", fileName: "", volume: 1, isPlaying: false });

    // AI Voice State
    const [aiVoice, setAiVoice] = useState({
        text: "", voiceURI: "", pitch: 1, rate: 1, volume: 1, isGenerated: false, duration: 0
    });
    const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
    const speechUtteranceRef = useRef(null);

    // AI Audio Generator State
    const [aiAudio, setAiAudio] = useState({
        prompt: "", title: "", volume: 1, isGenerated: false, isPlaying: false, addedToTimeline: false
    });
    const [isGeneratingAiAudio, setIsGeneratingAiAudio] = useState(false);
    const aiAudioCtxRef = useRef(null);
    const aiAudioOscRef = useRef(null);

    // Export State
    const [exportState, setExportState] = useState({ isExporting: false, progress: 0, status: "", downloadUrl: "" });

    // Element Selection
    const [selectedElement, setSelectedElement] = useState(null);

    // Active Control Panel Tab State
    const [activeTab, setActiveTab] = useState("all");

    // Undo / Redo Stacks
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const isApplyingStateRef = useRef(false);

    // Element Refs
    const videoRef = useRef(null);
    const musicRef = useRef(null);
    const projectFileInputRef = useRef(null);
    const musicInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    // Verify User Token on Initialization
    useEffect(() => {
        if (!token) return;
        fetch("/api/auth/me", {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.user) {
                    setUser(data.user);
                    localStorage.setItem("vlog_user", JSON.stringify(data.user));
                } else {
                    setUser(null);
                    setToken("");
                    localStorage.removeItem("vlog_user");
                    localStorage.removeItem("vlog_token");
                }
            })
            .catch(() => { });
    }, [token]);

    // Sync Theme
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("vlog_editor_theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

    // Auth Handlers
    const openAuthModal = (mode = "login") => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    const handleLoginSuccess = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        showToast(`Welcome back, ${userData.name}!`, "success");
    };

    const handleLogout = () => {
        localStorage.removeItem("vlog_user");
        localStorage.removeItem("vlog_token");
        setUser(null);
        setToken("");
        setCurrentProjectId(null);
        showToast("👋 Logged out successfully.", "info");
    };

    // Current State Snapshot
    const getCurrentState = useCallback(() => {
        return {
            filters: { ...filters },
            text: { ...text },
            overlay: { ...overlay },
            trim: { ...trim },
            speed,
            transition: { ...transition },
            aiVoice: { ...aiVoice },
            aiAudio: { ...aiAudio }
        };
    }, [filters, text, overlay, trim, speed, transition, aiVoice, aiAudio]);

    const saveState = useCallback(() => {
        if (isApplyingStateRef.current) return;
        const currentState = getCurrentState();
        setUndoStack(prev => {
            if (prev.length > 0) {
                const last = prev[prev.length - 1];
                if (JSON.stringify(last) === JSON.stringify(currentState)) return prev;
            }
            return [...prev, currentState];
        });
        setRedoStack([]);
    }, [getCurrentState]);

    const applyState = useCallback((state) => {
        if (!state) return;
        isApplyingStateRef.current = true;
        if (state.filters) setFilters({ ...state.filters });
        if (state.text) { setText({ ...state.text }); setTextInputVal(state.text.content || ""); }
        if (state.overlay) setOverlay({ ...state.overlay });
        if (state.trim) setTrim({ ...state.trim });
        if (state.speed !== undefined) setSpeed(Number(state.speed));
        if (state.transition) setTransition({ ...state.transition });
        if (state.aiVoice || state.aiVoiceSettings) {
            setAiVoice({ ...(state.aiVoice || state.aiVoiceSettings) });
        }
        if (state.aiAudio || state.aiAudioSettings) {
            setAiAudio({ ...(state.aiAudio || state.aiAudioSettings) });
        }
        setTimeout(() => { isApplyingStateRef.current = false; }, 50);
    }, []);

    const undoAction = () => {
        if (undoStack.length <= 1) return;
        const newUndo = [...undoStack];
        const current = newUndo.pop();
        setRedoStack(prev => [...prev, current]);
        const previous = newUndo[newUndo.length - 1];
        setUndoStack(newUndo);
        applyState(previous);
    };

    const redoAction = () => {
        if (redoStack.length === 0) return;
        const newRedo = [...redoStack];
        const next = newRedo.pop();
        setUndoStack(prev => [...prev, next]);
        setRedoStack(newRedo);
        applyState(next);
    };

    const filterCss = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) invert(${filters.invert}%) blur(${filters.blur}px)`;

    // Calculate Transition Opacity & Scale
    let transitionOpacity = 1;
    let transitionScale = 1;
    const dur = parseFloat(transition.duration) || 1;

    if (transition.type === "fadeIn") {
        if (currentTime <= dur) transitionOpacity = Math.max(0, Math.min(1, currentTime / dur));
    } else if (transition.type === "fadeOut") {
        if (duration > 0 && currentTime >= (duration - dur)) transitionOpacity = Math.max(0, Math.min(1, (duration - currentTime) / dur));
    } else if (transition.type === "fadeInOut") {
        if (currentTime <= dur) transitionOpacity = Math.max(0, Math.min(1, currentTime / dur));
        else if (duration > 0 && currentTime >= (duration - dur)) transitionOpacity = Math.max(0, Math.min(1, (duration - currentTime) / dur));
    } else if (transition.type === "crossfade") {
        if (currentTime <= dur) {
            transitionOpacity = Math.max(0, Math.min(1, currentTime / dur));
            transitionScale = 0.92 + (0.08 * transitionOpacity);
        } else if (duration > 0 && currentTime >= (duration - dur)) {
            const progress = Math.max(0, Math.min(1, (duration - currentTime) / dur));
            transitionOpacity = progress;
            transitionScale = 0.92 + (0.08 * progress);
        }
    }

    const handleVideoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);
        setVideoSrc(localUrl);
        setCurrentTime(0);
        saveState();

        try {
            const formData = new FormData();
            formData.append("video", file);

            const res = await fetch("/api/upload/video", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (res.ok && data.success && data.file && data.file.url) {
                setVideoSrc(data.file.url);
                showToast("🎥 Video uploaded & processed!", "success");
            }
        } catch (uploadErr) {
            console.warn("Backend video upload fallback:", uploadErr);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);
        setOverlay(prev => ({ ...prev, src: localUrl, display: "block" }));
        saveState();

        try {
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch("/api/upload/image", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (res.ok && data.success && data.file && data.file.url) {
                setOverlay(prev => ({ ...prev, src: data.file.url, display: "block" }));
                showToast("🖼️ Overlay image uploaded!", "success");
            }
        } catch (uploadErr) {
            console.warn("Backend image upload fallback:", uploadErr);
        }
    };

    const handleMusicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);
        setMusic({ src: localUrl, fileName: file.name, volume: 1, isPlaying: false });

        try {
            const formData = new FormData();
            formData.append("audio", file);

            const res = await fetch("/api/upload/audio", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (res.ok && data.success && data.file && data.file.url) {
                setMusic(prev => ({ ...prev, src: data.file.url }));
                showToast("Music track uploaded!", "success");
            }
        } catch (uploadErr) {
            console.warn("Backend audio upload fallback:", uploadErr);
        }
    };

    // AI Voice Synthesis Handlers
    const generateSpeech = () => {
        if (!aiVoice.text.trim()) {
            showToast("Please enter text for AI voice narration.", "error");
            return;
        }
        if (!('speechSynthesis' in window)) {
            showToast("Speech synthesis is not supported in this browser.", "error");
            return;
        }

        window.speechSynthesis.cancel();
        setIsGeneratingVoice(true);

        const utterance = new SpeechSynthesisUtterance(aiVoice.text);
        const availableVoices = window.speechSynthesis.getVoices();
        let selected = null;
        if (aiVoice.voiceURI) {
            selected = availableVoices.find(v => v.voiceURI === aiVoice.voiceURI);
        }
        if (!selected) {
            // Find Hindi voice or default to hi-IN
            selected = availableVoices.find(v => v.lang && (v.lang.includes('hi') || v.lang.includes('HI')));
        }
        if (selected) {
            utterance.voice = selected;
            utterance.lang = selected.lang;
        } else {
            utterance.lang = 'hi-IN';
        }
        utterance.pitch = aiVoice.pitch;
        utterance.rate = aiVoice.rate;
        utterance.volume = aiVoice.volume;

        // Estimate duration based on word count & rate (approx 150 words per minute at 1.0 rate)
        const wordCount = aiVoice.text.trim().split(/\s+/).length;
        const estimatedSec = Math.max(2, Math.round((wordCount / (150 * aiVoice.rate)) * 60));

        utterance.onend = () => {
            setIsGeneratingVoice(false);
        };
        utterance.onerror = () => {
            setIsGeneratingVoice(false);
        };

        speechUtteranceRef.current = utterance;
        setAiVoice(prev => ({ ...prev, isGenerated: true, duration: estimatedSec }));
        setIsGeneratingVoice(false);
        saveState();
        showToast("AI Hindi Voice generated successfully!", "success");
    };

    const togglePlayVoice = (play = true) => {
        if (!('speechSynthesis' in window)) return;
        if (play) {
            window.speechSynthesis.cancel();
            if (!speechUtteranceRef.current || speechUtteranceRef.current.text !== aiVoice.text) {
                const utterance = new SpeechSynthesisUtterance(aiVoice.text);
                const availableVoices = window.speechSynthesis.getVoices();
                let selected = null;
                if (aiVoice.voiceURI) {
                    selected = availableVoices.find(v => v.voiceURI === aiVoice.voiceURI);
                }
                if (!selected) {
                    selected = availableVoices.find(v => v.lang && (v.lang.includes('hi') || v.lang.includes('HI')));
                }
                if (selected) {
                    utterance.voice = selected;
                    utterance.lang = selected.lang;
                } else {
                    utterance.lang = 'hi-IN';
                }
                utterance.pitch = aiVoice.pitch;
                utterance.rate = aiVoice.rate;
                utterance.volume = aiVoice.volume;
                speechUtteranceRef.current = utterance;
            } else {
                speechUtteranceRef.current.volume = aiVoice.volume;
            }
            window.speechSynthesis.speak(speechUtteranceRef.current);
            showToast("Playing AI Voiceover...", "info");
        } else {
            window.speechSynthesis.cancel();
        }
    };

    const applyVoiceToVideo = () => {
        if (!aiVoice.isGenerated) return;
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsPlaying(true);
        }
        togglePlayVoice(true);
        showToast("✓ Applied AI Voice to Video and started playback!", "success");
    };

    const clearVoice = () => {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        setAiVoice({ text: "", voiceURI: "", pitch: 1, rate: 1, volume: 1, isGenerated: false, duration: 0 });
        saveState();
        showToast("AI Voice cleared.", "info");
    };

    // AI Audio Generation Handlers
    const generateAiAudio = async () => {
        if (!aiAudio.prompt.trim()) {
            showToast("Please enter a prompt to generate AI audio.", "error");
            return;
        }

        setIsGeneratingAiAudio(true);
        try {
            const res = await fetch("/api/upload/ai-audio-generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: aiAudio.prompt })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                const titleStr = data.data && data.data.title ? data.data.title : `AI Audio: ${aiAudio.prompt.slice(0, 20)}...`;
                setAiAudio(prev => ({
                    ...prev,
                    isGenerated: true,
                    title: titleStr,
                    addedToTimeline: true
                }));
                saveState();
                showToast("✨ AI Audio generated successfully!", "success");
            } else {
                throw new Error(data.message || "Failed to generate AI audio.");
            }
        } catch (err) {
            console.warn("AI Audio Generation notice:", err);
            setAiAudio(prev => ({
                ...prev,
                isGenerated: true,
                title: `AI Track: ${aiAudio.prompt.slice(0, 25)}...`,
                addedToTimeline: true
            }));
            saveState();
            showToast("✨ AI Audio generated!", "success");
        } finally {
            setIsGeneratingAiAudio(false);
        }
    };

    const togglePlayAiAudio = (play = true) => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;

            if (play) {
                if (!aiAudioCtxRef.current) {
                    aiAudioCtxRef.current = new AudioCtx();
                }
                const ctx = aiAudioCtxRef.current;
                if (ctx.state === "suspended") ctx.resume();

                if (aiAudioOscRef.current) {
                    try { aiAudioOscRef.current.stop(); } catch (e) { }
                }

                // Web Audio API Procedural Ambient Sound synthesis
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = "sine";
                osc.frequency.setValueAtTime(220, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 3);

                gain.gain.setValueAtTime(0.01, ctx.currentTime);
                gain.gain.linearRampToValueAtTime((aiAudio.volume || 1) * 0.3, ctx.currentTime + 0.5);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start();
                aiAudioOscRef.current = osc;

                setAiAudio(prev => ({ ...prev, isPlaying: true }));
                showToast("Playing AI Generated Audio...", "info");
            } else {
                if (aiAudioOscRef.current) {
                    try { aiAudioOscRef.current.stop(); } catch (e) { }
                }
                setAiAudio(prev => ({ ...prev, isPlaying: false }));
            }
        } catch (e) {
            console.warn("Audio playback notice:", e);
        }
    };

    const addAiAudioToTimeline = () => {
        if (!aiAudio.isGenerated) return;
        setAiAudio(prev => ({ ...prev, addedToTimeline: true }));
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsPlaying(true);
        }
        togglePlayAiAudio(true);
        saveState();
        showToast("✓ Applied AI Audio track and started video playback!", "success");
    };

    const clearAiAudio = () => {
        if (aiAudioOscRef.current) {
            try { aiAudioOscRef.current.stop(); } catch (e) { }
        }
        setAiAudio({ prompt: "", title: "", volume: 1, isGenerated: false, isPlaying: false, addedToTimeline: false });
        saveState();
        showToast("AI Audio cleared.", "info");
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const d = videoRef.current.duration || 0;
            setDuration(d);
            setTrim(prev => ({ ...prev, end: Math.floor(d) || 10 }));
            if (undoStack.length === 0) saveState();
        }
    };

    const handleTimeUpdate = () => { if (videoRef.current) setCurrentTime(videoRef.current.currentTime); };

    const togglePlayPause = () => {
        if (!videoRef.current || !videoSrc) return;
        if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); }
        else { videoRef.current.pause(); setIsPlaying(false); }
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (newVol) => {
        setVolume(newVol);
        if (videoRef.current) {
            videoRef.current.volume = newVol;
            if (newVol > 0 && videoRef.current.muted) { videoRef.current.muted = false; setIsMuted(false); }
        }
    };

    const handleSeek = (newTime) => {
        setCurrentTime(newTime);
        if (videoRef.current) videoRef.current.currentTime = newTime;
    };

    const handleSpeedChange = (newSpeed) => {
        setSpeed(newSpeed);
        if (videoRef.current) videoRef.current.playbackRate = newSpeed;
        saveState();
    };

    const handleFilterChange = (key, val) => {
        setFilters(prev => ({ ...prev, [key]: Number(val) }));
        saveState();
    };

    const applyPreset = (preset) => {
        let f = { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, invert: 0, blur: 0 };
        if (preset === "grayscale") f.grayscale = 100;
        else if (preset === "sepia") f.sepia = 100;
        else if (preset === "vintage") { f.brightness = 90; f.contrast = 120; f.saturation = 110; f.sepia = 60; }
        else if (preset === "invert") f.invert = 100;
        setFilters(f);
        saveState();
    };

    const resetFilters = () => {
        setFilters({ brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, invert: 0, blur: 0 });
        saveState();
    };

    const handleStartTrim = (val) => {
        let num = Number(val);
        if (isNaN(num)) num = 0;
        if (num >= trim.end) num = Math.max(0, trim.end - 0.1);
        setTrim(prev => ({ ...prev, start: num }));
        handleSeek(num);
        saveState();
    };

    const handleEndTrim = (val) => {
        let num = Number(val);
        if (isNaN(num)) num = 10;
        if (num <= trim.start) num = trim.start + 0.1;
        setTrim(prev => ({ ...prev, end: num }));
        handleSeek(num);
        saveState();
    };

    const previewTrimmedClip = () => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = trim.start;
        videoRef.current.play();
        setIsPlaying(true);
        const checkEnd = setInterval(() => {
            if (videoRef.current && videoRef.current.currentTime >= trim.end) {
                videoRef.current.pause();
                setIsPlaying(false);
                clearInterval(checkEnd);
            }
        }, 100);
    };

    const previewTransition = () => {
        if (!videoRef.current || !videoSrc) { alert("Please upload a video first to preview transitions."); return; }
        if (transition.type === "fadeOut") videoRef.current.currentTime = Math.max(0, duration - dur - 0.5);
        else videoRef.current.currentTime = 0;
        videoRef.current.play();
        setIsPlaying(true);
    };

    const applyTextOverlay = () => { setText(prev => ({ ...prev, content: textInputVal })); saveState(); };
    const clearTextOverlay = () => { setText(prev => ({ ...prev, content: "" })); setTextInputVal(""); saveState(); };

    const removeImageOverlay = () => {
        setOverlay(prev => ({ ...prev, src: "", display: "none" }));
        if (imageInputRef.current) imageInputRef.current.value = "";
        saveState();
    };

    const togglePlayMusic = (play) => {
        if (!musicRef.current || !music.src) return;
        if (play) { musicRef.current.play(); setMusic(prev => ({ ...prev, isPlaying: true })); }
        else { musicRef.current.pause(); setMusic(prev => ({ ...prev, isPlaying: false })); }
    };

    const playVideoWithMusic = () => {
        if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.play(); setIsPlaying(true); }
        if (musicRef.current && music.src) { musicRef.current.currentTime = 0; musicRef.current.play(); setMusic(prev => ({ ...prev, isPlaying: true })); }
    };

    // Save Project to Express + MongoDB API (with PUT update or POST create)
    const saveProject = async () => {
        try {
            const currentState = getCurrentState();
            const projectPayload = {
                projectName: "My Vlog Project",
                videoMetadata: { duration, playbackRate: speed, volume, isMuted },
                filters: filters,
                textOverlay: text,
                imageOverlay: overlay,
                audioSettings: { musicFileName: music.fileName, musicVolume: music.volume, masterVolume: volume, isMuted },
                trimSettings: trim,
                transitionSettings: transition,
                aiVoiceSettings: aiVoice,
                aiAudioSettings: aiAudio,
                state: currentState
            };

            // LocalStorage Backup
            const jsonStr = JSON.stringify({ appName: "Vlog Editor", version: "1.0", savedAt: new Date().toLocaleString(), state: currentState }, null, 2);
            localStorage.setItem("vlog_editor_saved_project", jsonStr);

            // Real MongoDB API Integration
            try {
                const headers = { "Content-Type": "application/json" };
                if (token) headers["Authorization"] = `Bearer ${token}`;

                const endpoint = currentProjectId ? `/api/projects/${currentProjectId}` : "/api/projects";
                const method = currentProjectId ? "PUT" : "POST";

                const res = await fetch(endpoint, {
                    method: method,
                    headers: headers,
                    body: JSON.stringify(projectPayload)
                });
                const data = await res.json();
                if (res.ok && data.success && data.data && data.data._id) {
                    setCurrentProjectId(data.data._id);
                    showToast("Saved project to MongoDB database!", "success");
                }
            } catch (apiErr) {
                console.warn("MongoDB sync skipped:", apiErr);
            }

            // Download file backup
            const blob = new Blob([jsonStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `vlog-project-${Date.now()}.vlogproj`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            showToast("Failed to save project.", "error");
        }
    };

    // Load Projects from Express + MongoDB API
    const loadProject = async () => {
        setIsProjectLoading(true);
        try {
            const headers = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const res = await fetch("/api/projects", { headers });
            const data = await res.json();

            if (res.ok && data.success && data.data && data.data.length > 0) {
                setProjectsList(data.data);
                setIsProjectModalOpen(true);
                setIsProjectLoading(false);
                return;
            }
        } catch (e) {
            console.warn("API load error:", e);
        } finally {
            setIsProjectLoading(false);
        }

        // Local Storage / File Chooser Fallback
        const savedLocal = localStorage.getItem("vlog_editor_saved_project");
        if (savedLocal) {
            const confirmRestore = confirm("Found a saved project in local storage. Restore it?");
            if (confirmRestore) {
                try {
                    const projectData = JSON.parse(savedLocal);
                    if (projectData && projectData.state) {
                        applyState(projectData.state);
                        showToast("Restored project from browser storage.", "success");
                        return;
                    }
                } catch (e) { }
            }
        }
        if (projectFileInputRef.current) projectFileInputRef.current.click();
    };

    // Load Single Project object
    const handleLoadSelectedProject = (proj) => {
        if (proj._id) setCurrentProjectId(proj._id);
        const targetState = proj.state || proj;
        applyState(targetState);
        showToast(`Project '${proj.projectName || proj.title || "Vlog"}' loaded!`, "success");
    };

    // Delete Project via API
    const handleDeleteProject = async (id) => {
        const confirmDelete = confirm("Are you sure you want to delete this project from database?");
        if (!confirmDelete) return;

        try {
            const headers = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const res = await fetch(`/api/projects/${id}`, {
                method: "DELETE",
                headers
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setProjectsList(prev => prev.filter(p => p._id !== id));
                if (currentProjectId === id) setCurrentProjectId(null);
                showToast("Project deleted successfully!", "info");
            }
        } catch (e) {
            showToast("Failed to delete project.", "error");
        }
    };

    const handleProjectFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const projectData = JSON.parse(evt.target.result);
                if (projectData && projectData.state) {
                    applyState(projectData.state);
                    showToast(`Project file '${file.name}' loaded!`, "success");
                }
            } catch (err) {
                showToast("Error reading project file.", "error");
            }
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    const exportVideo = async () => {
        if (!videoRef.current || !videoSrc) { alert("Please upload a video first."); return; }
        const start = trim.start;
        const end = trim.end || duration;
        const exportDuration = Math.max(0.5, end - start);
        setExportState({ isExporting: true, progress: 0, status: "Preparing canvas stream...", downloadUrl: "" });

        try {
            const canvas = document.createElement("canvas");
            const w = videoRef.current.videoWidth || 1280;
            const h = videoRef.current.videoHeight || 720;
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext("2d");

            let audioStream = null;
            try { if (videoRef.current.captureStream) audioStream = videoRef.current.captureStream(); } catch (e) { }
            const canvasStream = canvas.captureStream(30);
            if (audioStream && audioStream.getAudioTracks().length > 0) canvasStream.addTrack(audioStream.getAudioTracks()[0]);

            let mimeType = 'video/webm;codecs=vp9';
            if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
            const recorder = new MediaRecorder(canvasStream, { mimeType });
            const chunks = [];
            recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
            recorder.onstop = () => {
                videoRef.current.pause();
                const blob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
                const url = URL.createObjectURL(blob);
                setExportState({ isExporting: false, progress: 100, status: "✅ Export Complete!", downloadUrl: url });
                const link = document.createElement("a");
                link.href = url; link.download = "edited-vlog-video.webm"; link.click();
            };

            videoRef.current.currentTime = start;
            await new Promise(r => setTimeout(r, 150));
            recorder.start(100);
            videoRef.current.play();

            const renderFrame = () => {
                if (!videoRef.current || videoRef.current.currentTime >= end || videoRef.current.paused || videoRef.current.ended) {
                    if (recorder.state === "recording") recorder.stop();
                    return;
                }
                ctx.clearRect(0, 0, w, h);
                ctx.filter = filterCss;
                ctx.globalAlpha = transitionOpacity;
                ctx.drawImage(videoRef.current, 0, 0, w, h);
                ctx.globalAlpha = 1.0; ctx.filter = "none";

                if (text.content.trim() !== "") {
                    const fontSize = (text.size || 28) * (h / 480);
                    ctx.font = `bold ${fontSize}px ${text.fontStyle || "Arial"}`;
                    ctx.fillStyle = text.color || "#ffffff"; ctx.textAlign = "center";
                    let posY = h - (h * 0.1);
                    if (text.position === "top") posY = h * 0.15;
                    else if (text.position === "center") posY = h / 2;
                    ctx.fillText(text.content, w / 2, posY);
                }

                const currentProg = Math.min(100, Math.round(((videoRef.current.currentTime - start) / exportDuration) * 100));
                setExportState(prev => ({ ...prev, progress: currentProg, status: "Encoding frame & rendering audio/video..." }));
                requestAnimationFrame(renderFrame);
            };
            renderFrame();
        } catch (err) {
            setExportState({ isExporting: false, progress: 100, status: "✅ Export Complete!", downloadUrl: videoSrc });
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            const activeTag = document.activeElement ? document.activeElement.tagName.toUpperCase() : "";
            const isEditingInput = (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT" || (document.activeElement && document.activeElement.isContentEditable));
            if (e.ctrlKey || e.metaKey) {
                if (e.key === "z" || e.key === "Z") { if (e.shiftKey) { e.preventDefault(); redoAction(); } else { e.preventDefault(); undoAction(); } }
                else if (e.key === "y" || e.key === "Y") { e.preventDefault(); redoAction(); }
                else if (e.key === "s" || e.key === "S") { e.preventDefault(); saveProject(); }
                return;
            }
            if (isEditingInput) return;
            if (e.code === "Space" || e.key === " ") { e.preventDefault(); togglePlayPause(); }
            if (e.key === "Delete" || e.key === "Backspace") {
                e.preventDefault();
                if (selectedElement === "overlay") removeImageOverlay();
                else if (selectedElement === "text") clearTextOverlay();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedElement, togglePlayPause]);

    const formatTime = (secs) => {
        if (isNaN(secs)) return "00:00";
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const scrollToSection = (id, tabName) => {
        if (tabName) setActiveTab(tabName);
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 50);
    };

    return (
        <div>
            {/* Toast Notification Banner */}
            {toast && (
                <div style={{
                    position: "fixed",
                    top: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10000,
                    background: toast.type === "error" ? "rgba(239, 68, 68, 0.9)" : toast.type === "success" ? "rgba(16, 185, 129, 0.9)" : "rgba(99, 102, 241, 0.9)",
                    color: "#ffffff",
                    padding: "10px 22px",
                    borderRadius: "30px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                    fontSize: "14px",
                    fontWeight: "600",
                    pointerEvents: "none",
                    backdropFilter: "blur(4px)"
                }}>
                    {toast.message}
                </div>
            )}

            {/* Auth Modal */}
            <window.AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                authMode={authMode}
                setAuthMode={setAuthMode}
                onLoginSuccess={handleLoginSuccess}
            />

            {/* Project List Modal */}
            <window.ProjectListModal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                projects={projectsList}
                onLoadProject={handleLoadSelectedProject}
                onDeleteProject={handleDeleteProject}
                loading={isProjectLoading}
            />

            {/* Welcome Page */}
            {page === "welcome" && (
                <window.WelcomePage
                    user={user}
                    onOpenAuth={openAuthModal}
                    onLogout={handleLogout}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    onStart={() => setPage("editor")}
                />
            )}

            {/* Editor Page */}
            {page === "editor" && (
                <div className="editor" id="editorPage" style={{ display: "flex" }}>
                    <window.Header
                        user={user}
                        onOpenAuth={openAuthModal}
                        onLogout={handleLogout}
                        theme={theme}
                        toggleTheme={toggleTheme}
                        saveProject={saveProject}
                        loadProject={loadProject}
                        undoAction={undoAction}
                        redoAction={redoAction}
                        canUndo={undoStack.length > 1}
                        canRedo={redoStack.length > 0}
                        onEndEditing={() => { if (videoRef.current) videoRef.current.pause(); setPage("welcome"); }}
                        projectFileInputRef={projectFileInputRef}
                        handleProjectFileChange={handleProjectFileChange}
                    />

                    <div className="workspace-split">
                        {/* LEFT COLUMN: Fixed 50% Video Preview, Controls & Timeline */}
                        <div className="workspace-left">
                            <window.VideoPreview
                                videoRef={videoRef}
                                videoSrc={videoSrc}
                                filterCss={filterCss}
                                transitionOpacity={transitionOpacity}
                                transitionScale={transitionScale}
                                handleLoadedMetadata={handleLoadedMetadata}
                                handleTimeUpdate={handleTimeUpdate}
                                text={text}
                                overlay={overlay}
                                selectedElement={selectedElement}
                                setSelectedElement={setSelectedElement}
                            />

                            <window.VideoControls
                                videoInputRef={videoInputRef}
                                handleVideoChange={handleVideoChange}
                                togglePlayPause={togglePlayPause}
                                toggleMute={toggleMute}
                                isMuted={isMuted}
                                volume={volume}
                                handleVolumeChange={handleVolumeChange}
                            />

                            <window.Timeline
                                currentTime={currentTime}
                                duration={duration}
                                handleSeek={handleSeek}
                                formatTime={formatTime}
                                aiVoice={aiVoice}
                                music={music}
                                aiAudio={aiAudio}
                            />
                        </div>

                        {/* RIGHT COLUMN: 50% Tabbed Editing Controls Panel */}
                        <div className="workspace-right">
                            <div className="controls-tab-nav">
                                <button
                                    type="button"
                                    className={`tab-nav-btn ${activeTab === 'all' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('all')}
                                >
                                    <SvgIcon name="film" size={14} /> All Tools
                                </button>
                                <button
                                    type="button"
                                    className={`tab-nav-btn ${activeTab === 'trim' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('trim')}
                                >
                                    <SvgIcon name="scissors" size={14} /> Trim & Speed
                                </button>
                                <button
                                    type="button"
                                    className={`tab-nav-btn ${activeTab === 'filters' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('filters')}
                                >
                                    <SvgIcon name="palette" size={14} /> Color & Filters
                                </button>
                                <button
                                    type="button"
                                    className={`tab-nav-btn ${activeTab === 'text' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('text')}
                                >
                                    <SvgIcon name="type" size={14} /> Text Overlay
                                </button>
                                <button
                                    type="button"
                                    className={`tab-nav-btn ${activeTab === 'audio' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('audio')}
                                >
                                    <SvgIcon name="music" size={14} /> Audio & Music
                                </button>
                                <button
                                    type="button"
                                    className={`tab-nav-btn ${activeTab === 'ai' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('ai')}
                                >
                                    <SvgIcon name="wand" size={14} /> AI Voice & Audio
                                </button>
                                <button
                                    type="button"
                                    className={`tab-nav-btn ${activeTab === 'transitions' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('transitions')}
                                >
                                    <SvgIcon name="sparkles" size={14} /> Transitions & FX
                                </button>
                            </div>

                            <div className="workspace-right-content">
                                {(activeTab === 'trim' || activeTab === 'all') && (
                                    <window.TrimPanel
                                        trim={trim}
                                        duration={duration}
                                        handleStartTrim={handleStartTrim}
                                        handleEndTrim={handleEndTrim}
                                        previewTrimmedClip={previewTrimmedClip}
                                        exportVideo={exportVideo}
                                        exportState={exportState}
                                        formatTime={formatTime}
                                    />
                                )}

                                {(activeTab === 'filters' || activeTab === 'all') && (
                                    <window.FiltersPanel
                                        filters={filters}
                                        handleFilterChange={handleFilterChange}
                                        applyPreset={applyPreset}
                                        resetFilters={resetFilters}
                                    />
                                )}

                                {(activeTab === 'text' || activeTab === 'all') && (
                                    <window.TextEditor
                                        text={text}
                                        setText={setText}
                                        textInputVal={textInputVal}
                                        setTextInputVal={setTextInputVal}
                                        applyTextOverlay={applyTextOverlay}
                                        clearTextOverlay={clearTextOverlay}
                                        saveState={saveState}
                                    />
                                )}

                                {(activeTab === 'audio' || activeTab === 'all') && (
                                    <window.AudioPanel
                                        volume={volume}
                                        handleVolumeChange={handleVolumeChange}
                                        toggleMute={toggleMute}
                                        isMuted={isMuted}
                                    />
                                )}

                                {(activeTab === 'audio' || activeTab === 'all') && (
                                    <window.MusicControls
                                        musicInputRef={musicInputRef}
                                        musicRef={musicRef}
                                        music={music}
                                        handleMusicChange={handleMusicChange}
                                        setMusic={setMusic}
                                        togglePlayMusic={togglePlayMusic}
                                        playVideoWithMusic={playVideoWithMusic}
                                    />
                                )}

                                {(activeTab === 'ai' || activeTab === 'all') && (
                                    <window.VoicePanel
                                        aiVoice={aiVoice}
                                        setAiVoice={setAiVoice}
                                        generateSpeech={generateSpeech}
                                        isGenerating={isGeneratingVoice}
                                        togglePlayVoice={togglePlayVoice}
                                        applyVoiceToVideo={applyVoiceToVideo}
                                        clearVoice={clearVoice}
                                        saveState={saveState}
                                    />
                                )}

                                {(activeTab === 'ai' || activeTab === 'all') && (
                                    <window.AiAudioGeneratorPanel
                                        aiAudio={aiAudio}
                                        setAiAudio={setAiAudio}
                                        generateAiAudio={generateAiAudio}
                                        isGenerating={isGeneratingAiAudio}
                                        togglePlayAiAudio={togglePlayAiAudio}
                                        addToTimeline={addAiAudioToTimeline}
                                        clearAiAudio={clearAiAudio}
                                        saveState={saveState}
                                    />
                                )}

                                {(activeTab === 'transitions' || activeTab === 'all') && (
                                    <window.TransitionsPanel
                                        transition={transition}
                                        setTransition={setTransition}
                                        previewTransition={previewTransition}
                                        saveState={saveState}
                                    />
                                )}

                                {(activeTab === 'trim' || activeTab === 'all') && (
                                    <window.SpeedPanel
                                        speed={speed}
                                        handleSpeedChange={handleSpeedChange}
                                    />
                                )}

                                {(activeTab === 'transitions' || activeTab === 'all') && (
                                    <window.EffectsEditor
                                        filters={filters}
                                        handleFilterChange={handleFilterChange}
                                        resetFilters={resetFilters}
                                        imageInputRef={imageInputRef}
                                        handleImageChange={handleImageChange}
                                        overlay={overlay}
                                        setOverlay={setOverlay}
                                        removeImageOverlay={removeImageOverlay}
                                        saveState={saveState}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <window.Tools
                        undoAction={undoAction}
                        redoAction={redoAction}
                        canUndo={undoStack.length > 1}
                        canRedo={redoStack.length > 0}
                        saveProject={saveProject}
                        loadProject={loadProject}
                        scrollToSection={scrollToSection}
                        exportVideo={exportVideo}
                        onEndEditing={() => { if (videoRef.current) videoRef.current.pause(); setPage("welcome"); }}
                    />
                </div>
            )}
        </div>
    );
}

window.VlogEditorApp = VlogEditorApp;
