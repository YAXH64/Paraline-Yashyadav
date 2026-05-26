(() => {
  // ============================================================
  //  AURORA DRIFT — Phase 2: Core Visual Engine (Musical Intelligence Refined)
  //  A cinematic, atmospheric aurora borealis visualizer that rises
  //  from the bottom edge of the screen like translucent
  //  northern-lights curtains made of cosmic plasma, emotionally
  //  and physically synchronized to music using advanced signal filters.
  //
  //  Refined for maximum desktop readability, staying weightless and
  //  airy in the lower portion of the screen, channeling dynamic
  //  energy internally through rich folds, sways, and shimmers.
  // ============================================================

  // ----- Future-Proof Configurations -----
  const CONFIG = {
    intensity: 1.0,      // overall scaling of height/amplitude
    turbulence: 1.0,     // intensity of folding and twists
    glow: 1.0,           // opacity and shadowBlur scale
    speed: 1.05,          // global movement rate
    colorPalette: "cinematic",
    layerDensity: 6,     // default active layers (up to 6)
  };

  // ----- Aurora ribbon layer definitions -----
  // Refined vertical heights (maxHeight reduced by ~30%) and opacities (reduced by ~45%)
  // to ensure absolute readability of text and icons on the desktop behind Paraline.
  const AURORA_LAYERS = [
    // Layer 0: Deep background haze — widest, slowest, most transparent, very blurry
    {
      baseAmplitude: 20,
      frequency: 0.0016,
      speed: 0.04,
      turbulenceFreq: 0.0035,
      turbulenceSpeed: 0.03,
      maxHeight: 0.28,      // fraction of screen height
      opacity: 0.04,
      blur: 50,
      colorOffset: 0.0,
      widthScale: 1.0,
    },
    // Layer 1: Mid-background glow
    {
      baseAmplitude: 24,
      frequency: 0.0022,
      speed: 0.06,
      turbulenceFreq: 0.0048,
      turbulenceSpeed: 0.045,
      maxHeight: 0.24,
      opacity: 0.06,
      blur: 36,
      colorOffset: 0.12,
      widthScale: 1.0,
    },
    // Layer 2: Primary curtain — the main visible ribbon
    {
      baseAmplitude: 30,
      frequency: 0.0028,
      speed: 0.08,
      turbulenceFreq: 0.0055,
      turbulenceSpeed: 0.06,
      maxHeight: 0.21,
      opacity: 0.09,
      blur: 24,
      colorOffset: 0.25,
      widthScale: 1.0,
    },
    // Layer 3: Bright accent curtain
    {
      baseAmplitude: 26,
      frequency: 0.0035,
      speed: 0.10,
      turbulenceFreq: 0.007,
      turbulenceSpeed: 0.075,
      maxHeight: 0.18,
      opacity: 0.11,
      blur: 16,
      colorOffset: 0.42,
      widthScale: 0.94,
    },
    // Layer 4: Crisp detail ribbon — thinner, sharper, faster
    {
      baseAmplitude: 22,
      frequency: 0.0044,
      speed: 0.12,
      turbulenceFreq: 0.009,
      turbulenceSpeed: 0.09,
      maxHeight: 0.15,
      opacity: 0.08,
      blur: 9,
      colorOffset: 0.65,
      widthScale: 0.88,
    },
    // Layer 5: Topmost ethereal wisps
    {
      baseAmplitude: 16,
      frequency: 0.0055,
      speed: 0.15,
      turbulenceFreq: 0.011,
      turbulenceSpeed: 0.11,
      maxHeight: 0.12,
      opacity: 0.05,
      blur: 5,
      colorOffset: 0.82,
      widthScale: 0.80,
    }
  ];

  // ----- Cinematic Aurora Palette (Emerald Green, Teal, Cyan, Violet, Purple, Magenta) -----
  // Rich, tailored HSL color stops that mimic authentic northern lights.
  const AURORA_PALETTE = [
    [142, 85, 48],   // Deep Emerald Green
    [165, 78, 46],   // Electric Teal / Mint
    [185, 82, 45],   // Vibrant Cyan
    [210, 76, 46],   // Neon Blue
    [255, 68, 52],   // Ethereal Violet
    [285, 62, 50],   // Celestial Purple
    [320, 52, 52],   // Soft Magenta
    [285, 62, 50],   // Celestial Purple (loop back)
    [255, 68, 52],   // Ethereal Violet (loop back)
    [210, 76, 46],   // Neon Blue (loop back)
    [185, 82, 45],   // Vibrant Cyan (loop back)
    [165, 78, 46],   // Electric Teal (loop back)
  ];

  // ----- Persistent Theme State (IIFE Closure Scope) -----
  let lastTime = 0;
  let localAudioLevel = 0.20;
  let bassLevelState = 0.20;
  let midLevelState = 0.20;
  let midVariance = 0.05;
  let shimmerLevelState = 0.05;
  let averageVolume = 0.25;
  let globalDriftPhase = 0;
  let energyFlowOffset = 0;

  // Physics-based traveling shockwaves array
  let activePulses = [];
  let lastPulseTime = 0;

  // ----- Interpolation helpers -----

  function lerpHSL(a, b, t) {
    // Shortest-path hue interpolation
    let dh = b[0] - a[0];
    if (dh > 180) dh -= 360;
    if (dh < -180) dh += 360;
    return [
      (a[0] + dh * t + 360) % 360,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t
    ];
  }

  function getAuroraColor(palettePosition) {
    const count = AURORA_PALETTE.length;
    const scaled = ((palettePosition % 1) + 1) % 1 * (count - 1);
    const idx = Math.floor(scaled);
    const frac = scaled - idx;
    const a = AURORA_PALETTE[idx];
    const b = AURORA_PALETTE[Math.min(idx + 1, count - 1)];
    return lerpHSL(a, b, frac);
  }

  function hsla(hsl, alpha) {
    return `hsla(${hsl[0].toFixed(1)}, ${hsl[1].toFixed(1)}%, ${hsl[2].toFixed(1)}%, ${alpha})`;
  }

  // ----- Core drawing -----

  function drawAuroraDrift(options) {
    const {
      context: ctx,
      width,
      height,
      time,
      smoothedLevel
    } = options;

    // Resolve user-defined configurations or fall back to theme defaults
    const settings = options.settings || {};
    const cfg = {
      intensity: typeof settings.intensity === "number" ? settings.intensity : CONFIG.intensity,
      turbulence: typeof settings.turbulence === "number" ? settings.turbulence : CONFIG.turbulence,
      glow: typeof settings.glow === "number" ? settings.glow : CONFIG.glow,
      speed: typeof settings.speed === "number" ? settings.speed : CONFIG.speed,
      layerDensity: typeof settings.layerDensity === "number" ? Math.max(1, Math.min(6, settings.layerDensity)) : CONFIG.layerDensity
    };

    // Calculate elapsed frame time (dt) safely
    const dt = lastTime ? Math.min(0.1, Math.max(0.001, time - lastTime)) : 1 / 60;
    lastTime = time;

    // ----- Majestic, Jitter-Free Audio Processing -----
    const rawLevel = smoothedLevel || 0.24;

    // 1. Overall smooth level follower
    localAudioLevel += (rawLevel - localAudioLevel) * 0.08;

    // 2. Slow running baseline tracker (slow low-pass) to capture background ambient volume
    averageVolume += (rawLevel - averageVolume) * 0.003;

    // 3. Bass Beat / Surge Detector
    // Detect positive surges above 1.25x the long-term running average
    const rawSurge = Math.max(0, rawLevel - averageVolume * 1.25);
    // Smooth the bass state (majestic, slower release)
    const bassTarget = rawSurge * 1.6;
    const bassResponse = bassTarget > bassLevelState ? 0.07 : 0.02;
    bassLevelState += (bassTarget - bassLevelState) * bassResponse;

    // Manage traveling shockwaves lifespan (max 1.8 seconds)
    activePulses = activePulses.filter(p => (time - p.birth) < 1.8);
    // Trigger a new traveling shockwave if we detect a dynamic bass surge
    // Limit to max 4 active concurrent pulses to prevent rendering overhead and maintain 60 FPS
    if (rawSurge > 0.16 && (time - lastPulseTime) > 0.38 && activePulses.length < 4) {
      activePulses.push({
        birth: time,
        intensity: Math.min(1.0, rawSurge * 1.8),
        speed: 260 + Math.random() * 80 // speed of upward travel (pixels/second)
      });
      lastPulseTime = time;
    }

    // 4. Mid-Range Envelope (vocals, melodies, expressive instruments)
    // Filters out high-speed cymbals and static bass by using a moderate follower
    const midTarget = rawLevel;
    midLevelState += (midTarget - midLevelState) * 0.06;
    // Track standard deviation/variance to measure melodic activity
    midVariance += (Math.abs(rawLevel - midLevelState) - midVariance) * 0.05;
    const expressiveness = Math.min(1.0, midLevelState * 0.7 + midVariance * 1.6);

    // 5. High-Frequency Treble Shimmer
    // Extracted using a high-pass derivative (instantaneous minus smoothed volume)
    const trebleTransient = Math.max(0, rawLevel - localAudioLevel);
    shimmerLevelState += (trebleTransient - shimmerLevelState) * 0.18;

    // ----- Musical Emotion Engine -----
    // Scales movement speeds, opacities, and folding complexity dynamically.
    // Quiet/calm tracks lead to slow serene drift, active tracks lead to rich energy.
    // UX REFINEMENT: Direct reactivity into SPEED and TURBULENCE rather than physical size or opacity.
    const emotionFactor = Math.min(1.3, Math.max(0.16, (bassLevelState * 0.45 + expressiveness * 0.55 + localAudioLevel * 0.2)));

    const activeSpeed = cfg.speed * (0.42 + emotionFactor * 1.15); // faster internal movement on beats
    const activeTurbulence = cfg.turbulence * (0.35 + emotionFactor * 1.10); // richer folding
    const activeGlow = cfg.glow * (0.55 + emotionFactor * 0.25); // very gentle brightness swell

    // Accumulate horizontal and vertical motion rates based on time and emotional factor
    globalDriftPhase += dt * 0.009 * activeSpeed;
    energyFlowOffset += dt * (0.28 + emotionFactor * 0.90) * activeSpeed;

    // High-frequency temporal noise for magical atmospheric electric flicker
    const shimmerNoise = Math.sin(time * 66.0) * shimmerLevelState * 0.13;
    const shimmerSparkle = Math.cos(time * 76.0) * shimmerLevelState * 0.22;

    // Dynamic color HSL adjustment based on music energy (subtle, tasteful boosting)
    function adjustHSL(baseHSL) {
      return [
        baseHSL[0],
        Math.min(94, baseHSL[1] + localAudioLevel * 8.0), // subtle saturation boost
        Math.min(74, baseHSL[2] + localAudioLevel * 3.0)  // extremely soft luminosity boost
      ];
    }

    // ----- 1. Horizon Atmospheric Haze (Diffusion & Softness) -----
    // Deep volumetric backdrop, scaled down by 50% for maximum readability of icons/text behind it.
    const horizonHeight = height * 0.38; // lower horizon height
    const horizonGrad = ctx.createLinearGradient(0, height - horizonHeight, 0, height);
    const ambientColorPos = globalDriftPhase * 0.95;
    const ambientHSL = adjustHSL(getAuroraColor(ambientColorPos));

    horizonGrad.addColorStop(0, hsla(ambientHSL, 0));
    horizonGrad.addColorStop(0.35, hsla(ambientHSL, 0.02 * activeGlow));
    horizonGrad.addColorStop(0.7, hsla(ambientHSL, 0.06 * activeGlow));
    horizonGrad.addColorStop(1, hsla(ambientHSL, 0.09 * activeGlow));

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = horizonGrad;
    ctx.fillRect(0, height - horizonHeight, width, horizonHeight);
    ctx.restore();

    // ----- 2. Draw Aurora Layers (Parallax Depth) -----
    const baseY = height;

    for (let li = 0; li < cfg.layerDensity; li++) {
      const layer = AURORA_LAYERS[li];
      drawAuroraLayer(ctx, {
        width,
        height,
        baseY,
        time,
        layer,
        layerIndex: li,
        cfg,
        activeSpeed,
        activeTurbulence,
        activeGlow,
        expressiveness,
        shimmerNoise,
        shimmerSparkle,
        adjustHSL,
        audioBrightness: 1.0 + bassLevelState * 0.15, // tapered brightness swell (was 0.4)
      });
    }
  }

  function drawAuroraLayer(ctx, opts) {
    const {
      width,
      height,
      baseY,
      time,
      layer,
      layerIndex,
      cfg,
      activeSpeed,
      activeTurbulence,
      activeGlow,
      expressiveness,
      shimmerNoise,
      shimmerSparkle,
      adjustHSL,
      audioBrightness
    } = opts;

    const step = 6; // slightly larger step for excellent pathing performance
    const ribbonWidth = width * layer.widthScale;
    const xOffset = (width - ribbonWidth) * 0.5;

    // Unique offsets to guarantee layers flow out-of-sync
    const layerPhaseOffset = layerIndex * 1.63;

    // ----- Build the Ribbon Crest Coordinates -----
    const points = [];
    for (let x = 0; x <= ribbonWidth; x += step) {
      const nx = x / ribbonWidth; // normalized position 0..1

      // Parallax-driven low-frequency sine waves
      const wave1 = Math.sin(
        x * layer.frequency + globalDriftPhase * layer.speed * 8.0 + layerPhaseOffset
      );

      const wave2 = Math.sin(
        x * layer.frequency * 2.3 + globalDriftPhase * layer.speed * 4.5 + layerPhaseOffset * 0.7
      ) * 0.45;

      const wave3 = Math.sin(
        x * 0.012 + time * 0.06 + layerPhaseOffset * 1.3
      ) * 0.10;

      const combinedWave = wave1 + wave2 + wave3;

      // Base heights modulated by global intensity settings and bass state
      // UX REFINEMENT: overall amplitudes are scaled down significantly, and bass swelling is tapered
      const maxRise = height * layer.maxHeight * cfg.intensity;
      const amplitude = layer.baseAmplitude * 0.65 * cfg.intensity * (1.0 + bassLevelState * 0.18);
      
      // Vertical breathing drift to make layers feel like floating curtains
      const verticalDrift = Math.sin(time * 0.12 + layerPhaseOffset) * 10;

      const riseHeight = maxRise * 0.45 + combinedWave * amplitude + verticalDrift;

      // Edge falloff at left/right screen borders (avoids clipping)
      const edgeFade = Math.pow(Math.sin(nx * Math.PI), 0.75);

      points.push({
        x: x + xOffset,
        rise: Math.max(2, riseHeight * edgeFade)
      });
    }

    const segmentCount = points.length;
    if (segmentCount < 2) return;

    // Get color profile for this specific layer
    const layerColorPos = globalDriftPhase * 0.8 + layer.colorOffset;
    const baseHSL = adjustHSL(getAuroraColor(layerColorPos));

    // Compute maximum rise to set gradient bounds
    let maxRise = 0;
    for (let i = 0; i < segmentCount; i++) {
      if (points[i].rise > maxRise) maxRise = points[i].rise;
    }
    if (maxRise < 5) return;

    // ----- DRAW PASS 1: Base Volumetric Curtain (Soft Glow Backdrop) -----
    const gradTop = baseY - maxRise - 25;
    const gradBottom = baseY;

    const curtainGrad = ctx.createLinearGradient(0, gradTop, 0, gradBottom);
    const opacityMultiplier = layer.opacity * activeGlow * audioBrightness * (1.0 + shimmerNoise);

    curtainGrad.addColorStop(0, hsla(baseHSL, 0));
    curtainGrad.addColorStop(0.18, hsla(baseHSL, opacityMultiplier * 0.35));
    curtainGrad.addColorStop(0.42, hsla(baseHSL, opacityMultiplier * 0.70));
    curtainGrad.addColorStop(0.72, hsla(baseHSL, opacityMultiplier * 0.95));
    curtainGrad.addColorStop(1, hsla(baseHSL, opacityMultiplier * 0.40)); // soft blend into horizon

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.beginPath();
    ctx.moveTo(points[0].x, baseY);

    for (let i = 0; i < segmentCount; i++) {
      ctx.lineTo(points[i].x, baseY - points[i].rise);
    }

    ctx.lineTo(points[segmentCount - 1].x, baseY);
    ctx.closePath();

    ctx.shadowBlur = layer.blur * activeGlow;
    ctx.shadowColor = hsla(baseHSL, opacityMultiplier * 0.25); // halved shadow glow alpha for desktop legibility
    ctx.fillStyle = curtainGrad;
    ctx.fill();
    ctx.restore();

    // ----- DRAW PASS 2: Additive Plasma Filaments (Upward Energy & Folding) -----
    // Generate beautiful high-frequency vertical creases inside the curtains.
    // Background layers have fewer, softer lines; foreground layers are denser and sharper.
    const numFilaments = 20 + layerIndex * 8;
    const filamentPoints = [];

    // Interpolator to query the curtain height at any horizontal point
    function getCrestHeight(x) {
      const idx = Math.floor((x - xOffset) / step);
      if (idx < 0) return points[0].rise;
      if (idx >= points.length - 1) return points[points.length - 1].rise;
      const frac = ((x - xOffset) / step) - idx;
      return points[idx].rise * (1 - frac) + points[idx + 1].rise * frac;
    }

    for (let fi = 0; fi < numFilaments; fi++) {
      const fn = fi / (numFilaments - 1 || 1); // 0..1
      const xBase = xOffset + fn * ribbonWidth;
      const filamentRise = getCrestHeight(xBase);

      if (filamentRise < 5) continue;

      const fPoints = [];
      const vertSegments = 12; // Segmented curves for maximum performance and flow detail

      for (let si = 0; si <= vertSegments; si++) {
        const t = si / vertSegments; // 0..1 (from bottom to top)
        const d = t * filamentRise;  // distance rising upward from the base
        const y = baseY - d;

        // 1. Organic slow horizontal sway (varying with height)
        const sway = Math.sin(
          xBase * 0.0028 + d * 0.0009 + time * 0.28 * layer.speed + layerPhaseOffset
        ) * 36;

        // 2. High-frequency turbulence folding, driven by mid-range musical expressiveness (Internal Complexity)
        const foldPhase = xBase * 0.015 - d * (0.007 + layerIndex * 0.0006) + energyFlowOffset * (0.75 + layerIndex * 0.15) + layerPhaseOffset;
        const foldAmp = (8 + expressiveness * 45 * activeTurbulence) * (1.0 - t * 0.35); // boosted internal crease complexity
        const fold = Math.sin(foldPhase) * foldAmp;

        // 3. Audio-reactive traveling shockwaves propagating upward (Bass)
        // UX REFINEMENT: Reduced traveling wave physical displacement coefficient from 24 to 10.
        // Bass creates subtle elegant physical ripples rather than extreme distortion.
        let shockwaveDisplacement = 0;
        for (let pi = 0; pi < activePulses.length; pi++) {
          const p = activePulses[pi];
          const elapsed = time - p.birth;
          const pulseCenter = elapsed * p.speed;
          const distToPulse = Math.abs(d - pulseCenter);
          
          const pulseWidth = 130 + elapsed * 75;
          if (distToPulse < pulseWidth) {
            const normalizedDist = distToPulse / pulseWidth;
            const env = Math.pow(1.0 - normalizedDist, 2.2);
            const wave = Math.sin(distToPulse * 0.026 - elapsed * 4.8 + layerIndex * 0.5);
            const decay = Math.exp(-elapsed * 1.35);
            
            shockwaveDisplacement += wave * env * p.intensity * decay * 10; // soft elegant ripple
          }
        }

        // 4. Subtle high-frequency thermal plasma vibration along filament edges (Treble shimmer)
        const vibration = Math.sin(time * 88.0 + d * 0.18) * shimmerLevelState * 2.2 * cfg.intensity;

        // Combine all displacements: sway, fold, shockwaves, and high-frequency shimmer vibration
        const x = xBase + sway + fold + shockwaveDisplacement + vibration;

        fPoints.push({ x, y });
      }

      filamentPoints.push(fPoints);
    }

    // Single-path rendering batch for excellent GPU performance
    if (filamentPoints.length > 0) {
      const strokeGrad = ctx.createLinearGradient(0, baseY - maxRise, 0, baseY);
      const brightHSL = [baseHSL[0], baseHSL[1], Math.min(baseHSL[2] + 12, 85)];
      const filOpacity = layer.opacity * 0.55 * activeGlow * audioBrightness * (1.0 + shimmerNoise);

      strokeGrad.addColorStop(0, hsla(brightHSL, 0));
      strokeGrad.addColorStop(0.2, hsla(brightHSL, filOpacity * 0.30));
      strokeGrad.addColorStop(0.5, hsla(brightHSL, filOpacity * 0.85));
      strokeGrad.addColorStop(0.8, hsla(brightHSL, filOpacity * 1.0));
      strokeGrad.addColorStop(1, hsla(brightHSL, filOpacity * 0.15));

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = 1.1 + (1.0 - layer.widthScale) * 0.7 + (layerIndex * 0.32);
      ctx.shadowBlur = layer.blur * 0.42 * activeGlow;
      ctx.shadowColor = hsla(brightHSL, filOpacity * 0.25); // halved shadow glow alpha

      ctx.beginPath();
      for (let fi = 0; fi < filamentPoints.length; fi++) {
        const fPoints = filamentPoints[fi];
        ctx.moveTo(fPoints[0].x, fPoints[0].y);
        for (let i = 1; i < fPoints.length; i++) {
          ctx.lineTo(fPoints[i].x, fPoints[i].y);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // ----- DRAW PASS 3: Brighter Crest Highlights (Luminous Edges with Treble Sparkle) -----
    if (layer.opacity >= 0.11) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.beginPath();
      ctx.moveTo(points[0].x, baseY - points[0].rise);

      for (let i = 1; i < segmentCount - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const cpx = (curr.x + next.x) / 2;
        const cpy = (baseY - curr.rise + baseY - next.rise) / 2;
        ctx.quadraticCurveTo(curr.x, baseY - curr.rise, cpx, cpy);
      }

      const crestHSL = [baseHSL[0], baseHSL[1], Math.min(baseHSL[2] + 16, 92)];
      const crestOpacity = layer.opacity * 0.52 * activeGlow * audioBrightness * (1.0 + shimmerSparkle);

      ctx.strokeStyle = hsla(crestHSL, crestOpacity);
      ctx.lineWidth = 1.6 + layer.blur * 0.05 * activeGlow;
      ctx.shadowBlur = layer.blur * 0.55 * activeGlow;
      ctx.shadowColor = hsla(baseHSL, crestOpacity * 0.35); // reduced glow halo alpha
      ctx.stroke();
      ctx.restore();
    }
  }

  // ----- Audio multiplier (for the renderer's audio scaling system) -----
  function getAuroraDriftAudioMultiplier() {
    return 3.65; // boosted for majestic response curves
  }

  // ----- Export -----
  window.ParalineAuroraDrift = {
    getAuroraDriftAudioMultiplier,
    drawAuroraDrift
  };
})();
