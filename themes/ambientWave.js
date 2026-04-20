(() => {
  const {
    getGlowMultiplier,
    drawWave,
    drawGlowBand,
    drawSoftFill
  } = window.ParalineShared;

  const AMBIENT_TONES = {
    blue: {
      topLine: "rgba(145, 220, 255, 0.34)",
      topGlow: "rgba(120, 205, 255, 0.12)",
      bottomLine: "rgba(168, 232, 255, 0.22)",
      bottomGlow: "rgba(120, 205, 255, 0.08)",
      hazeTop: "rgba(115, 200, 255, 0.10)",
      hazeBottom: "rgba(115, 200, 255, 0.06)"
    },
    purple: {
      topLine: "rgba(202, 168, 255, 0.32)",
      topGlow: "rgba(180, 140, 255, 0.12)",
      bottomLine: "rgba(232, 196, 255, 0.20)",
      bottomGlow: "rgba(180, 140, 255, 0.08)",
      hazeTop: "rgba(186, 146, 255, 0.10)",
      hazeBottom: "rgba(186, 146, 255, 0.06)"
    },
    warm: {
      topLine: "rgba(255, 208, 156, 0.32)",
      topGlow: "rgba(255, 188, 128, 0.12)",
      bottomLine: "rgba(255, 224, 196, 0.20)",
      bottomGlow: "rgba(255, 188, 128, 0.08)",
      hazeTop: "rgba(255, 190, 124, 0.10)",
      hazeBottom: "rgba(255, 190, 124, 0.06)"
    }
  };

  function getAmbientTonePalette(settings) {
    return AMBIENT_TONES[settings.tone] || AMBIENT_TONES.blue;
  }

  function getAmbientSensitivityMultiplier(settings) {
    if (settings.sensitivity === "low") {
      return 3.2;
    }

    if (settings.sensitivity === "high") {
      return 6.2;
    }

    return 4.5;
  }

  function drawAmbientWave(options) {
    const {
      context,
      width,
      height,
      time,
      smoothedLevel,
      latestSource,
      edgeGradient,
      settings
    } = options;

    const ambientTheme = getAmbientTonePalette(settings);
    const helperDriven = latestSource === "helper";
    const glowScale = getGlowMultiplier(settings.glowStrength) * 1.18;
    const bothMode = settings.edgeMode === "both";
    const strongBothMode = bothMode && settings.glowStrength === "strong";
    const topGlowScale = strongBothMode ? glowScale * 0.94 : glowScale;
    const bottomPresenceBoost = strongBothMode
      ? 1.55
      : bothMode
        ? 1.28
        : 1;
    const bottomGlowScale = glowScale * bottomPresenceBoost;
    const bottomOpacityBoost = strongBothMode
      ? 1.36
      : bothMode
        ? 1.18
        : 1;
    const bottomLineWidthBoost = strongBothMode
      ? 1.16
      : bothMode
        ? 1.08
        : 1;

    drawGlowBand(context, width, height, edgeGradient, glowScale);

    const drawTop = settings.edgeMode === "top" || settings.edgeMode === "both";
    const drawBottom = settings.edgeMode === "bottom" || settings.edgeMode === "both";
    const topBase = 26 + smoothedLevel * 6;
    const bottomBase = height - 62 - smoothedLevel * 18;
    const primaryAmplitude = helperDriven ? 8 + smoothedLevel * 38 : 5 + smoothedLevel * 12;
    const secondaryAmplitude = helperDriven ? 3 + smoothedLevel * 16 : 2 + smoothedLevel * 6;

    if (drawTop) {
      drawSoftFill(context, {
        width,
        time,
        yBase: topBase,
        amplitude: primaryAmplitude * 0.6,
        frequency: 0.0064,
        speed: 0.28,
        color: ambientTheme.topGlow,
        thickness: 28,
        alphaScale: topGlowScale,
        invert: true
      });
      drawWave(context, {
        width,
        time,
        yBase: topBase,
        amplitude: primaryAmplitude * 0.6,
        frequency: 0.0088,
        speed: 0.26,
        color: ambientTheme.topLine,
        lineWidth: 1.05,
        opacity: 0.56,
        glowScale: topGlowScale,
        invert: true
      });
      drawWave(context, {
        width,
        time,
        yBase: topBase + 6,
        amplitude: secondaryAmplitude * 0.55,
        frequency: 0.0112,
        speed: 0.34,
        color: ambientTheme.topGlow,
        lineWidth: 0.8,
        opacity: 0.18,
        glowScale: topGlowScale,
        invert: true
      });
    }

    if (drawBottom) {
      drawSoftFill(context, {
        width,
        time,
        yBase: bottomBase,
        amplitude: primaryAmplitude * 0.9,
        frequency: 0.007,
        speed: 0.32,
        color: ambientTheme.bottomGlow,
        thickness: 40,
        alphaScale: bottomGlowScale
      });
      drawWave(context, {
        width,
        time,
        yBase: bottomBase,
        amplitude: primaryAmplitude * 0.9,
        frequency: 0.0102,
        speed: 0.34,
        color: ambientTheme.bottomLine,
        lineWidth: 1.25 * bottomLineWidthBoost,
        opacity: 0.68 * bottomOpacityBoost,
        glowScale: bottomGlowScale
      });
      drawWave(context, {
        width,
        time,
        yBase: bottomBase - 8,
        amplitude: secondaryAmplitude,
        frequency: 0.013,
        speed: 0.48,
        color: ambientTheme.bottomGlow,
        lineWidth: 0.9 * bottomLineWidthBoost,
        opacity: 0.28 * bottomOpacityBoost,
        glowScale: bottomGlowScale
      });
    }
  }

  window.ParalineAmbientWave = {
    getAmbientTonePalette,
    getAmbientSensitivityMultiplier,
    drawAmbientWave
  };
})();
