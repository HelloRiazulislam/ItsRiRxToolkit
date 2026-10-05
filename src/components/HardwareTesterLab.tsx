import React, { useState, useEffect, useRef } from 'react';
import {
  Keyboard,
  Mouse,
  Monitor,
  Volume2,
  Mic,
  Camera,
  Gamepad2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  Sparkles,
  Maximize2,
  VolumeX,
  Gauge,
  Sliders,
  Lock,
  Unlock,
  ShieldAlert
} from 'lucide-react';

interface HardwareTesterLabProps {
  onNotify: (msg: string) => void;
  isDark?: boolean;
}

export const HardwareTesterLab: React.FC<HardwareTesterLabProps> = ({ onNotify, isDark = false }) => {
  const [activeTest, setActiveTest] = useState<'keyboard' | 'mouse' | 'display' | 'audio' | 'mic' | 'camera' | 'gamepad'>('keyboard');

  // =========================================================================
  // 1. KEYBOARD TESTER STATE & BROWSER INPUT ISOLATION
  // =========================================================================
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [testedKeys, setTestedKeys] = useState<Set<string>>(new Set());
  const [keyHistory, setKeyHistory] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [inputLockEnabled, setInputLockEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext not permitted or muted
    }
  };

  // Global browser default key shortcut & right-click suppression (Page scrolling is never locked)
  useEffect(() => {
    if (!inputLockEnabled) return;

    if (activeTest === 'keyboard') {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Intercept browser default key behaviors so keys like F1-F12, Tab, Alt, Ctrl, Backspace don't trigger browser actions
        // (e.g. F5 won't reload, F1 won't open help, Tab won't jump focus, Ctrl+R won't reload)
        e.preventDefault();
        e.stopPropagation();

        playClickSound();
        setPressedKeys((prev) => new Set(prev).add(e.code));
        setTestedKeys((prev) => new Set(prev).add(e.code));
        setKeyHistory((prev) => [e.code, ...prev.slice(0, 15)]);
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPressedKeys((prev) => {
          const next = new Set(prev);
          next.delete(e.code);
          return next;
        });
      };

      window.addEventListener('keydown', handleKeyDown, { passive: false, capture: true });
      window.addEventListener('keyup', handleKeyUp, { passive: false, capture: true });

      return () => {
        window.removeEventListener('keydown', handleKeyDown, { capture: true });
        window.removeEventListener('keyup', handleKeyUp, { capture: true });
      };
    }

    if (activeTest === 'mouse') {
      // Prevent browser context menu completely on window during mouse test
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
      };

      window.addEventListener('contextmenu', handleContextMenu);
      return () => {
        window.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, [activeTest, inputLockEnabled, soundEnabled]);

  const resetKeyboard = () => {
    setPressedKeys(new Set());
    setTestedKeys(new Set());
    setKeyHistory([]);
    onNotify('Keyboard tester reset!');
  };

  // Keyboard layout definition
  const KEYBOARD_ROWS = [
    [
      { code: 'Escape', label: 'Esc' },
      { code: 'F1', label: 'F1' },
      { code: 'F2', label: 'F2' },
      { code: 'F3', label: 'F3' },
      { code: 'F4', label: 'F4' },
      { code: 'F5', label: 'F5' },
      { code: 'F6', label: 'F6' },
      { code: 'F7', label: 'F7' },
      { code: 'F8', label: 'F8' },
      { code: 'F9', label: 'F9' },
      { code: 'F10', label: 'F10' },
      { code: 'F11', label: 'F11' },
      { code: 'F12', label: 'F12' }
    ],
    [
      { code: 'Backquote', label: '`' },
      { code: 'Digit1', label: '1' },
      { code: 'Digit2', label: '2' },
      { code: 'Digit3', label: '3' },
      { code: 'Digit4', label: '4' },
      { code: 'Digit5', label: '5' },
      { code: 'Digit6', label: '6' },
      { code: 'Digit7', label: '7' },
      { code: 'Digit8', label: '8' },
      { code: 'Digit9', label: '9' },
      { code: 'Digit0', label: '0' },
      { code: 'Minus', label: '-' },
      { code: 'Equal', label: '=' },
      { code: 'Backspace', label: 'Backspace', width: 'w-20' }
    ],
    [
      { code: 'Tab', label: 'Tab', width: 'w-16' },
      { code: 'KeyQ', label: 'Q' },
      { code: 'KeyW', label: 'W' },
      { code: 'KeyE', label: 'E' },
      { code: 'KeyR', label: 'R' },
      { code: 'KeyT', label: 'T' },
      { code: 'KeyY', label: 'Y' },
      { code: 'KeyU', label: 'U' },
      { code: 'KeyI', label: 'I' },
      { code: 'KeyO', label: 'O' },
      { code: 'KeyP', label: 'P' },
      { code: 'BracketLeft', label: '[' },
      { code: 'BracketRight', label: ']' },
      { code: 'Backslash', label: '\\', width: 'w-12' }
    ],
    [
      { code: 'CapsLock', label: 'Caps', width: 'w-18' },
      { code: 'KeyA', label: 'A' },
      { code: 'KeyS', label: 'S' },
      { code: 'KeyD', label: 'D' },
      { code: 'KeyF', label: 'F' },
      { code: 'KeyG', label: 'G' },
      { code: 'KeyH', label: 'H' },
      { code: 'KeyJ', label: 'J' },
      { code: 'KeyK', label: 'K' },
      { code: 'KeyL', label: 'L' },
      { code: 'Semicolon', label: ';' },
      { code: 'Quote', label: "'" },
      { code: 'Enter', label: 'Enter', width: 'w-22' }
    ],
    [
      { code: 'ShiftLeft', label: 'Shift', width: 'w-22' },
      { code: 'KeyZ', label: 'Z' },
      { code: 'KeyX', label: 'X' },
      { code: 'KeyC', label: 'C' },
      { code: 'KeyV', label: 'V' },
      { code: 'KeyB', label: 'B' },
      { code: 'KeyN', label: 'N' },
      { code: 'KeyM', label: 'M' },
      { code: 'Comma', label: ',' },
      { code: 'Period', label: '.' },
      { code: 'Slash', label: '/' },
      { code: 'ShiftRight', label: 'Shift', width: 'w-24' }
    ],
    [
      { code: 'ControlLeft', label: 'Ctrl', width: 'w-14' },
      { code: 'MetaLeft', label: 'Win', width: 'w-12' },
      { code: 'AltLeft', label: 'Alt', width: 'w-14' },
      { code: 'Space', label: 'Space', width: 'flex-1' },
      { code: 'AltRight', label: 'Alt', width: 'w-14' },
      { code: 'MetaRight', label: 'Win', width: 'w-12' },
      { code: 'ControlRight', label: 'Ctrl', width: 'w-14' },
      { code: 'ArrowLeft', label: '←', width: 'w-10' },
      { code: 'ArrowUp', label: '↑', width: 'w-10' },
      { code: 'ArrowDown', label: '↓', width: 'w-10' },
      { code: 'ArrowRight', label: '→', width: 'w-10' }
    ]
  ];

  // =========================================================================
  // 2. MOUSE & POLLING RATE TESTER STATE
  // =========================================================================
  const [mouseClicks, setMouseClicks] = useState({
    left: 0,
    right: 0,
    middle: 0,
    back: 0,
    forward: 0
  });
  const [scrollDelta, setScrollDelta] = useState<number>(0);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [doubleClickInterval, setDoubleClickInterval] = useState<number | null>(null);
  const [pollingRateHz, setPollingRateHz] = useState<number>(0);
  const mouseMoveEvents = useRef<number[]>([]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = performance.now();
    if (e.button === 0 && lastClickTime > 0) {
      const diff = Math.round(now - lastClickTime);
      if (diff < 400) {
        setDoubleClickInterval(diff);
      }
    }
    setLastClickTime(now);

    setMouseClicks((prev) => {
      switch (e.button) {
        case 0:
          return { ...prev, left: prev.left + 1 };
        case 1:
          return { ...prev, middle: prev.middle + 1 };
        case 2:
          return { ...prev, right: prev.right + 1 };
        case 3:
          return { ...prev, back: prev.back + 1 };
        case 4:
          return { ...prev, forward: prev.forward + 1 };
        default:
          return prev;
      }
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    setScrollDelta((prev) => prev + (e.deltaY > 0 ? 1 : -1));
  };

  const handleMouseMove = () => {
    const now = performance.now();
    mouseMoveEvents.current.push(now);
    // keep only events in last 250ms
    mouseMoveEvents.current = mouseMoveEvents.current.filter((t) => now - t <= 250);
    if (mouseMoveEvents.current.length > 2) {
      const count = mouseMoveEvents.current.length;
      const duration = (now - mouseMoveEvents.current[0]) / 1000;
      if (duration > 0.05) {
        setPollingRateHz(Math.round(count / duration));
      }
    }
  };

  const resetMouseTest = () => {
    setMouseClicks({ left: 0, right: 0, middle: 0, back: 0, forward: 0 });
    setScrollDelta(0);
    setDoubleClickInterval(null);
    setPollingRateHz(0);
    onNotify('Mouse tester reset!');
  };

  // =========================================================================
  // 3. DISPLAY & SCREEN TESTER STATE
  // =========================================================================
  const [displayColorIndex, setDisplayColorIndex] = useState<number | null>(null);
  const [screenFps, setScreenFps] = useState<number>(60);

  const displayColors = [
    { name: 'Pure Red (Check Dead/Stuck Pixels)', color: '#ff0000' },
    { name: 'Pure Green', color: '#00ff00' },
    { name: 'Pure Blue', color: '#0000ff' },
    { name: 'Pure White (Check Dust/Uniformity)', color: '#ffffff' },
    { name: 'Pure Black (Check Backlight Bleed / IPS Glow)', color: '#000000' },
    { name: '50% Neutral Gray (Check Banding)', color: '#808080' },
    { name: 'Cyan', color: '#00ffff' },
    { name: 'Magenta', color: '#ff00ff' },
    { name: 'Yellow', color: '#ffff00' }
  ];

  // Live Refresh Rate (Hz / FPS) calculator
  useEffect(() => {
    if (activeTest !== 'display') return;
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setScreenFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [activeTest]);

  // =========================================================================
  // 4. AUDIO & STEREO CHANNEL TESTER
  // =========================================================================
  const [playingChannel, setPlayingChannel] = useState<'left' | 'right' | 'both' | 'sweep' | null>(null);
  const audioToneOsc = useRef<OscillatorNode | null>(null);

  const stopAudioTone = () => {
    if (audioToneOsc.current) {
      try {
        audioToneOsc.current.stop();
        audioToneOsc.current.disconnect();
      } catch {
        // already stopped
      }
      audioToneOsc.current = null;
    }
    setPlayingChannel(null);
  };

  const playStereoTone = (channel: 'left' | 'right' | 'both') => {
    stopAudioTone();
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // 440 Hz standard A tone

      if (panner) {
        if (channel === 'left') panner.pan.setValueAtTime(-1, ctx.currentTime);
        else if (channel === 'right') panner.pan.setValueAtTime(1, ctx.currentTime);
        else panner.pan.setValueAtTime(0, ctx.currentTime);
      }

      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      if (panner) {
        osc.connect(panner);
        panner.connect(gain);
      } else {
        osc.connect(gain);
      }
      gain.connect(ctx.destination);

      osc.start();
      audioToneOsc.current = osc;
      setPlayingChannel(channel);

      // automatically stop after 3 seconds
      setTimeout(() => {
        stopAudioTone();
      }, 3000);
    } catch {
      onNotify('Audio output error or permission blocked.');
    }
  };

  const playFrequencySweep = () => {
    stopAudioTone();
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(20, ctx.currentTime); // Start at deep bass 20 Hz
      osc.frequency.exponentialRampToValueAtTime(12000, ctx.currentTime + 5); // sweep to 12kHz over 5 seconds

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      audioToneOsc.current = osc;
      setPlayingChannel('sweep');

      setTimeout(() => {
        stopAudioTone();
      }, 5000);
    } catch {
      onNotify('Audio sweep error.');
    }
  };

  // =========================================================================
  // 5. MICROPHONE TESTER
  // =========================================================================
  const [micActive, setMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState<number>(0);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micAnimRef = useRef<number | null>(null);

  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setMicActive(true);

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
        micAnimRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
      onNotify('Microphone active! Speak to see audio level.');
    } catch {
      onNotify('Microphone access denied or no microphone found.');
      setMicActive(false);
    }
  };

  const stopMicTest = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (micAnimRef.current) cancelAnimationFrame(micAnimRef.current);
    setMicActive(false);
    setMicVolume(0);
  };

  // =========================================================================
  // 6. WEBCAM TESTER
  // =========================================================================
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraResolution, setCameraResolution] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const startCameraTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);

      // detect resolution once video starts playing
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();
      if (settings.width && settings.height) {
        setCameraResolution(`${settings.width} x ${settings.height} (${Math.round(settings.frameRate || 30)} FPS)`);
      }
      onNotify('Camera live test started!');
    } catch {
      onNotify('Webcam access denied or no camera device found.');
      setCameraActive(false);
    }
  };

  const stopCameraTest = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current = null;
    }
    setCameraActive(false);
    setCameraResolution('');
  };

  // Cleanup on unmount or tab switch
  useEffect(() => {
    return () => {
      stopAudioTone();
      stopMicTest();
      stopCameraTest();
    };
  }, []);

  // =========================================================================
  // 7. GAMEPAD / CONTROLLER TESTER
  // =========================================================================
  const [connectedGamepad, setConnectedGamepad] = useState<Gamepad | null>(null);
  const gamepadAnimRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeTest !== 'gamepad') return;

    const pollGamepads = () => {
      if (typeof navigator.getGamepads === 'function') {
        const pads = navigator.getGamepads();
        const activePad = pads.find((p) => p !== null) || null;
        setConnectedGamepad(activePad);
      }
      gamepadAnimRef.current = requestAnimationFrame(pollGamepads);
    };

    gamepadAnimRef.current = requestAnimationFrame(pollGamepads);
    return () => {
      if (gamepadAnimRef.current) cancelAnimationFrame(gamepadAnimRef.current);
    };
  }, [activeTest]);

  const testGamepadVibration = () => {
    if (connectedGamepad && connectedGamepad.vibrationActuator) {
      connectedGamepad.vibrationActuator.playEffect('dual-rumble', {
        startDelay: 0,
        duration: 800,
        weakMagnitude: 1.0,
        strongMagnitude: 1.0
      });
      onNotify('Gamepad rumble vibration triggered!');
    } else {
      onNotify('Vibration not supported by this controller/browser.');
    }
  };

  return (
    <div className="space-y-6 relative z-10">
      {/* Fullscreen Display Color Overlay */}
      {displayColorIndex !== null && (
        <div
          onClick={() => {
            if (displayColorIndex < displayColors.length - 1) {
              setDisplayColorIndex(displayColorIndex + 1);
            } else {
              setDisplayColorIndex(null);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer select-none"
          style={{ backgroundColor: displayColors[displayColorIndex].color }}
        >
          <div className="px-4 py-2 rounded-xl bg-black/60 text-white text-xs backdrop-blur-md opacity-40 hover:opacity-100 transition-opacity">
            {displayColors[displayColorIndex].name} • Click for Next Color • Press Esc or Click to Close
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div
        className={`rounded-3xl p-6 sm:p-8 backdrop-blur-2xl border transition-all duration-300 relative overflow-hidden ${
          isDark
            ? 'bg-zinc-900/75 border-zinc-800/90 shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
            : 'bg-white/80 border-slate-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.04)]'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Hardware & Peripherals Testing Lab
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              PC & Peripherals Diagnostic Tester
            </h1>
            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
              Comprehensive in-browser testing suite for Keyboard key-rollover, Mouse polling rate & double-clicks, Display dead pixels & refresh rate, Audio stereo channels, Microphone, Webcam, and Gamepad controllers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                isDark ? 'bg-emerald-950/60 border-emerald-800/50 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-500" /> 100% Client-Side & Private
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-1.5 rounded-2xl bg-slate-200/50 dark:bg-zinc-900/50 border border-slate-300/40 dark:border-white/10 backdrop-blur-xl">
        {[
          { id: 'keyboard', name: 'Keyboard', icon: Keyboard, color: 'emerald' },
          { id: 'mouse', name: 'Mouse & DPI', icon: Mouse, color: 'purple' },
          { id: 'display', name: 'Display & Hz', icon: Monitor, color: 'blue' },
          { id: 'audio', name: 'Audio Stereo', icon: Volume2, color: 'amber' },
          { id: 'mic', name: 'Microphone', icon: Mic, color: 'rose' },
          { id: 'camera', name: 'Webcam', icon: Camera, color: 'cyan' },
          { id: 'gamepad', name: 'Gamepad', icon: Gamepad2, color: 'indigo' }
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = activeTest === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTest(item.id as typeof activeTest)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                  : isDark
                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. KEYBOARD TESTER */}
      {/* ========================================================================= */}
      {activeTest === 'keyboard' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div
            className={`rounded-3xl p-6 md:p-8 border ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-emerald-500" />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Interactive Keyboard & Anti-Ghosting Tester
                  </h2>
                </div>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Press any key on your keyboard. Keys turn <span className="text-emerald-500 font-bold">Green</span> when passed, and glow while held down to test simultaneous N-Key Rollover (NKRO).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => {
                    const next = !inputLockEnabled;
                    setInputLockEnabled(next);
                    onNotify(
                      next
                        ? 'Exclusive Input Lock Active: Browser shortcuts & scrolling suppressed!'
                        : 'Input Lock Disabled: Normal browser behavior restored.'
                    );
                  }}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    inputLockEnabled
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/50 shadow-sm'
                      : isDark
                      ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                  title="Locks browser hotkeys (F1-F12, Space, Tab, Backspace, Arrows) so tester captures 100% of keys without browser actions"
                >
                  {inputLockEnabled ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>Exclusive Input Lock: {inputLockEnabled ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    soundEnabled
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : isDark
                      ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                  title="Toggle mechanical click sound feedback"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  Sound {soundEnabled ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={resetKeyboard}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDark
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Test
                </button>
              </div>
            </div>

            {/* Key Function Interception Alert Strip */}
            {inputLockEnabled && (
              <div className={`mt-4 p-3 rounded-2xl border flex items-center gap-2.5 text-xs ${
                isDark ? 'bg-amber-950/40 border-amber-800/50 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong>Default Key Actions Intercepted:</strong> F1-F12 (Reload/Help/Search), Tab, Alt, Ctrl, and Backspace shortcuts will not trigger browser functions while testing keys. You can freely scroll the page with your mouse or touchpad at any time.
                </span>
              </div>
            )}

            {/* Live Stats: Keys Passed and Currently Pressed */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-xs text-slate-500 dark:text-zinc-400">Keys Verified</span>
                <div className="text-lg font-extrabold text-emerald-500 mt-0.5">{testedKeys.size} Passed</div>
              </div>

              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-xs text-slate-500 dark:text-zinc-400">Active Held Keys</span>
                <div className="text-lg font-extrabold text-purple-500 mt-0.5">{pressedKeys.size} (NKRO)</div>
              </div>

              <div className={`p-3 rounded-2xl border col-span-2 ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-xs text-slate-500 dark:text-zinc-400">Last Pressed Key</span>
                <div className="text-sm font-mono font-bold text-slate-800 dark:text-zinc-200 truncate mt-1">
                  {keyHistory[0] ? keyHistory[0] : 'Press any key...'}
                </div>
              </div>
            </div>

            {/* Visual Keyboard Matrix */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-950 text-white shadow-inner overflow-x-auto select-none">
              <div className="space-y-2 min-w-[760px]">
                {KEYBOARD_ROWS.map((row, rIdx) => (
                  <div key={rIdx} className="flex gap-1.5">
                    {row.map((k) => {
                      const isCurrentlyPressed = pressedKeys.has(k.code);
                      const isPassed = testedKeys.has(k.code);

                      let keyStyle = 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-700/80';
                      if (isCurrentlyPressed) {
                        keyStyle = 'bg-amber-400 text-slate-950 border-amber-300 scale-95 shadow-lg shadow-amber-400/50';
                      } else if (isPassed) {
                        keyStyle = 'bg-emerald-600/90 text-white border-emerald-400';
                      }

                      return (
                        <div
                          key={k.code}
                          className={`h-11 rounded-lg border font-mono font-bold text-xs flex items-center justify-center transition-all ${
                            k.width || 'w-11'
                          } ${keyStyle}`}
                        >
                          {k.label}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MOUSE & POLLING RATE TESTER */}
      {/* ========================================================================= */}
      {activeTest === 'mouse' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div
            className={`rounded-3xl p-6 md:p-8 border ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mouse className="w-5 h-5 text-purple-500" />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Mouse Clicks, Scroll Wheel & Polling Rate Tester
                  </h2>
                </div>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Test Left, Right, Middle click switches, detect faulty double-clicking, and measure live mouse sensor polling rate (Hz).
                </p>
              </div>

              <button
                onClick={resetMouseTest}
                className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Counts
              </button>
            </div>

            {/* Click Test Interactive Zone */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
              {/* Interactive Mouse Click Pad */}
              <div
                onMouseDown={handleMouseDown}
                onWheel={handleWheel}
                onMouseMove={handleMouseMove}
                onContextMenu={(e) => e.preventDefault()}
                className={`lg:col-span-2 h-72 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer transition-all ${
                  isDark
                    ? 'bg-zinc-950/60 hover:bg-zinc-900/80 border-purple-500/30 hover:border-purple-500/60'
                    : 'bg-purple-50/40 hover:bg-purple-50/70 border-purple-300 hover:border-purple-400'
                }`}
              >
                <Mouse className="w-12 h-12 text-purple-500 mb-3 animate-bounce" />
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Click & Move Mouse Anywhere Inside This Box
                </h3>
                <p className={`text-xs mt-1 max-w-sm ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Test Left Click, Right Click, Middle Click, Scroll Wheel, and fast movement for Polling Rate detection.
                </p>
              </div>

              {/* Live Click Counters Card */}
              <div className={`p-5 rounded-2xl border space-y-3.5 ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  Click Statistics
                </h3>

                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400">Left Click:</span>
                  <span className="font-bold text-emerald-500 text-sm">{mouseClicks.left}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400">Right Click:</span>
                  <span className="font-bold text-blue-500 text-sm">{mouseClicks.right}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400">Middle Click:</span>
                  <span className="font-bold text-purple-500 text-sm">{mouseClicks.middle}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400">Scroll Delta:</span>
                  <span className="font-bold text-amber-500 text-sm">{scrollDelta}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-1.5">
                  <span className="text-slate-500 dark:text-zinc-400">Sensor Polling Rate:</span>
                  <span className="font-bold text-cyan-500 text-sm">{pollingRateHz > 0 ? `${pollingRateHz} Hz` : 'Move mouse'}</span>
                </div>

                {doubleClickInterval !== null && (
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
                    <span className="font-bold text-purple-400">Double-Click Speed:</span> {doubleClickInterval} ms
                    {doubleClickInterval < 50 && (
                      <span className="text-rose-400 block mt-0.5">⚠️ Possible hardware switch chatter/fault!</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DISPLAY & DEAD PIXEL TESTER */}
      {/* ========================================================================= */}
      {activeTest === 'display' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div
            className={`rounded-3xl p-6 md:p-8 border ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-blue-500" />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Monitor Dead Pixel & Refresh Rate (Hz) Tester
                  </h2>
                </div>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Cycle through pure primary colors to discover stuck or dead pixels, backlight bleed, and view your screen's active refresh rate.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                  isDark ? 'bg-blue-950/60 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}>
                  <Gauge className="w-4 h-4 text-blue-500" />
                  <span>Refresh Rate: {screenFps} Hz</span>
                </div>

                <button
                  onClick={() => setDisplayColorIndex(0)}
                  className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" /> Start Fullscreen Test
                </button>
              </div>
            </div>

            {/* Color Swatch Picker Grid */}
            <div className="pt-6 space-y-3">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Quick Color Inspection Swatches
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
                {displayColors.map((c, i) => (
                  <button
                    key={c.color}
                    onClick={() => setDisplayColorIndex(i)}
                    className="group flex flex-col items-center gap-1.5 p-2 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:scale-105 transition-all cursor-pointer"
                  >
                    <div
                      className="w-12 h-12 rounded-xl shadow-md border border-black/10"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-[11px] font-medium text-slate-700 dark:text-zinc-300 truncate max-w-full">
                      {c.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. AUDIO & STEREO CHANNEL TESTER */}
      {/* ========================================================================= */}
      {activeTest === 'audio' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div
            className={`rounded-3xl p-6 md:p-8 border ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="space-y-1 pb-6 border-b border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-500" />
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Speaker & Headphone Stereo Channel Isolation
                </h2>
              </div>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                Verify whether your headphones and speakers are correctly configured for Left and Right channels, and test low-bass to high-treble frequencies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className={`p-5 rounded-2xl border text-center space-y-3 ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-lg mx-auto">
                  L
                </div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Left Channel</h3>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Plays a 440 Hz test tone panned 100% to your Left speaker or earcup.
                </p>
                <button
                  onClick={() => playStereoTone('left')}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    playingChannel === 'left' ? 'bg-rose-600 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  {playingChannel === 'left' ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {playingChannel === 'left' ? 'Playing Left...' : 'Test Left Speaker'}
                </button>
              </div>

              <div className={`p-5 rounded-2xl border text-center space-y-3 ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-black text-lg mx-auto">
                  R
                </div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Right Channel</h3>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Plays a 440 Hz test tone panned 100% to your Right speaker or earcup.
                </p>
                <button
                  onClick={() => playStereoTone('right')}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    playingChannel === 'right' ? 'bg-rose-600 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                >
                  {playingChannel === 'right' ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {playingChannel === 'right' ? 'Playing Right...' : 'Test Right Speaker'}
                </button>
              </div>

              <div className={`p-5 rounded-2xl border text-center space-y-3 ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-black text-lg mx-auto">
                  ~
                </div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Frequency Sweep</h3>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Sweeps frequencies from deep 20 Hz bass up to 12,000 Hz treble.
                </p>
                <button
                  onClick={playFrequencySweep}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    playingChannel === 'sweep' ? 'bg-rose-600 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  {playingChannel === 'sweep' ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {playingChannel === 'sweep' ? 'Sweeping...' : 'Start Frequency Sweep'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MICROPHONE TESTER */}
      {/* ========================================================================= */}
      {activeTest === 'mic' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div
            className={`rounded-3xl p-6 md:p-8 border ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-rose-500" />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Microphone Input & Noise Level Tester
                  </h2>
                </div>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Check your microphone volume levels, input clarity, and background noise in real-time.
                </p>
              </div>

              <button
                onClick={micActive ? stopMicTest : startMicTest}
                className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                  micActive ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25'
                }`}
              >
                {micActive ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {micActive ? 'Stop Microphone' : 'Start Mic Test'}
              </button>
            </div>

            {/* Mic Level Visualizer Bar */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Live Audio Volume:</span>
                <span className="font-mono font-bold text-emerald-500">{micVolume}%</span>
              </div>

              <div className="h-6 w-full rounded-xl bg-slate-200 dark:bg-zinc-800 overflow-hidden p-1 flex items-center">
                <div
                  className="h-full rounded-lg bg-gradient-to-r from-emerald-500 via-yellow-500 to-rose-500 transition-all duration-75"
                  style={{ width: `${micVolume}%` }}
                />
              </div>

              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {micActive
                  ? 'Speak normally. If the green/yellow bar moves when you talk, your microphone is working perfectly!'
                  : 'Click "Start Mic Test" and allow browser permission to test your microphone.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. WEBCAM TESTER */}
      {/* ========================================================================= */}
      {activeTest === 'camera' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div
            className={`rounded-3xl p-6 md:p-8 border ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-cyan-500" />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Webcam Camera & Resolution Diagnostics
                  </h2>
                </div>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Inspect live video feed, verify supported camera resolution (1080p/720p), and FPS.
                </p>
              </div>

              <button
                onClick={cameraActive ? stopCameraTest : startCameraTest}
                className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                  cameraActive ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/25'
                }`}
              >
                {cameraActive ? <Square className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                {cameraActive ? 'Stop Webcam' : 'Start Camera Test'}
              </button>
            </div>

            <div className="pt-6 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-2xl h-80 rounded-2xl bg-black overflow-hidden flex items-center justify-center border border-slate-300 dark:border-zinc-800">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <Camera className="w-12 h-12 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">Camera preview is currently inactive.</p>
                  </div>
                )}

                {cameraResolution && (
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/70 text-cyan-400 text-xs font-mono backdrop-blur-md">
                    {cameraResolution}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. GAMEPAD / CONTROLLER TESTER */}
      {/* ========================================================================= */}
      {activeTest === 'gamepad' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div
            className={`rounded-3xl p-6 md:p-8 border ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-indigo-500" />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Gamepad & Game Controller Tester
                  </h2>
                </div>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Connect any Xbox, PlayStation, or generic USB/Bluetooth controller to test analog stick drift, button presses, trigger pressure, and dual-rumble vibration.
                </p>
              </div>

              {connectedGamepad && (
                <button
                  onClick={testGamepadVibration}
                  className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4" /> Test Controller Vibration
                </button>
              )}
            </div>

            <div className="pt-6">
              {connectedGamepad ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Connected Device:</span>
                    <div className="text-sm font-bold text-indigo-500 mt-0.5">{connectedGamepad.id}</div>
                  </div>

                  {/* Buttons Matrix */}
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {connectedGamepad.buttons.map((btn, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          btn.pressed
                            ? 'bg-emerald-500 text-white border-emerald-400 scale-95 shadow-md'
                            : isDark
                            ? 'bg-zinc-950 border-zinc-800 text-zinc-400'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="text-[10px] font-mono">B{i}</div>
                        <div className="text-xs font-bold mt-0.5">{btn.pressed ? 'ON' : '0'}</div>
                      </div>
                    ))}
                  </div>

                  {/* Analog Sticks Axes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Left Stick (X, Y)</span>
                      <div className="text-xs font-mono text-indigo-400 mt-1">
                        X: {connectedGamepad.axes[0]?.toFixed(2) || '0.00'} | Y: {connectedGamepad.axes[1]?.toFixed(2) || '0.00'}
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Right Stick (X, Y)</span>
                      <div className="text-xs font-mono text-indigo-400 mt-1">
                        X: {connectedGamepad.axes[2]?.toFixed(2) || '0.00'} | Y: {connectedGamepad.axes[3]?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`p-8 rounded-2xl border text-center space-y-3 ${isDark ? 'bg-zinc-950/40 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                  <Gamepad2 className="w-12 h-12 text-slate-400 mx-auto" />
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    No Gamepad Detected
                  </h3>
                  <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Please plug in your controller via USB or connect via Bluetooth, then <strong>press any button on the gamepad</strong> to awaken the browser Gamepad API.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
