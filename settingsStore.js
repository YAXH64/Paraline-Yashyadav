const fs = require("fs");
const path = require("path");

const DEFAULT_SETTINGS = Object.freeze({
  selectedTheme: "ambientWave",
  ambientWave: Object.freeze({
    tone: "blue",
    sensitivity: "medium",
    edgeMode: "bottom",
    glowStrength: "medium"
  }),
  reactiveBorder: Object.freeze({
    colorStyle: "rainbow",
    intensity: "medium",
    borderThickness: "thin",
    glowStrength: "medium"
  }),
  flowBorder: Object.freeze({
    direction: "clockwise",
    speedMode: "balanced",
    segmentLength: "medium",
    glowStrength: "medium",
    colorStyle: "rainbow"
  })
});

const VALID_MAIN_THEMES = new Set(["ambientWave", "reactiveBorder", "flowBorder"]);
const VALID_AMBIENT_TONES = new Set(["blue", "purple", "warm"]);
const VALID_LEVELS = new Set(["low", "medium", "high"]);
const VALID_EDGE_MODES = new Set(["top", "bottom", "both"]);
const VALID_GLOW_STRENGTHS = new Set(["soft", "medium", "strong"]);
const VALID_REACTIVE_COLOR_STYLES = new Set(["rainbow", "neonBlue", "neonPurple", "warmGlow"]);
const VALID_BORDER_THICKNESS = new Set(["thin", "medium", "thick"]);
const VALID_FLOW_DIRECTIONS = new Set(["clockwise", "anticlockwise"]);
const VALID_FLOW_SPEEDS = new Set(["calm", "balanced", "energetic"]);
const VALID_FLOW_SEGMENTS = new Set(["short", "medium", "long"]);
const VALID_FLOW_COLOR_STYLES = new Set(["rainbow", "cool", "warm"]);

function createDefaultSettings() {
  return {
    selectedTheme: DEFAULT_SETTINGS.selectedTheme,
    ambientWave: { ...DEFAULT_SETTINGS.ambientWave },
    reactiveBorder: { ...DEFAULT_SETTINGS.reactiveBorder },
    flowBorder: { ...DEFAULT_SETTINGS.flowBorder }
  };
}

function pick(value, validValues, fallback) {
  return validValues.has(value) ? value : fallback;
}

function legacySensitivityToLevel(value) {
  if (!Number.isFinite(value)) {
    return "medium";
  }

  if (value < 2.6) {
    return "low";
  }

  if (value < 4.2) {
    return "medium";
  }

  return "high";
}

function sanitizeAmbientWave(input = {}) {
  return {
    tone: pick(input.tone, VALID_AMBIENT_TONES, DEFAULT_SETTINGS.ambientWave.tone),
    sensitivity: pick(input.sensitivity, VALID_LEVELS, DEFAULT_SETTINGS.ambientWave.sensitivity),
    edgeMode: pick(input.edgeMode, VALID_EDGE_MODES, DEFAULT_SETTINGS.ambientWave.edgeMode),
    glowStrength: pick(input.glowStrength, VALID_GLOW_STRENGTHS, DEFAULT_SETTINGS.ambientWave.glowStrength)
  };
}

function sanitizeReactiveBorder(input = {}) {
  return {
    colorStyle: pick(input.colorStyle, VALID_REACTIVE_COLOR_STYLES, DEFAULT_SETTINGS.reactiveBorder.colorStyle),
    intensity: pick(input.intensity, VALID_LEVELS, DEFAULT_SETTINGS.reactiveBorder.intensity),
    borderThickness: pick(input.borderThickness, VALID_BORDER_THICKNESS, DEFAULT_SETTINGS.reactiveBorder.borderThickness),
    glowStrength: pick(input.glowStrength, VALID_GLOW_STRENGTHS, DEFAULT_SETTINGS.reactiveBorder.glowStrength)
  };
}

function sanitizeFlowBorder(input = {}) {
  return {
    direction: pick(input.direction, VALID_FLOW_DIRECTIONS, DEFAULT_SETTINGS.flowBorder.direction),
    speedMode: pick(input.speedMode, VALID_FLOW_SPEEDS, DEFAULT_SETTINGS.flowBorder.speedMode),
    segmentLength: pick(input.segmentLength, VALID_FLOW_SEGMENTS, DEFAULT_SETTINGS.flowBorder.segmentLength),
    glowStrength: pick(input.glowStrength, VALID_GLOW_STRENGTHS, DEFAULT_SETTINGS.flowBorder.glowStrength),
    colorStyle: pick(input.colorStyle, VALID_FLOW_COLOR_STYLES, DEFAULT_SETTINGS.flowBorder.colorStyle)
  };
}

function migrateLegacySettings(input = {}) {
  if (VALID_MAIN_THEMES.has(input.selectedTheme)) {
    return input;
  }

  const migrated = createDefaultSettings();
  const legacyTheme = input.theme;
  const legacyLevel = legacySensitivityToLevel(input.sensitivity);

  migrated.ambientWave.sensitivity = legacyLevel;

  if (VALID_EDGE_MODES.has(input.edgeMode)) {
    migrated.ambientWave.edgeMode = input.edgeMode;
  }

  if (legacyTheme === "purple" || legacyTheme === "warm") {
    migrated.ambientWave.tone = legacyTheme;
  }

  if (legacyTheme === "rainbow") {
    migrated.selectedTheme = "reactiveBorder";
    migrated.reactiveBorder.intensity = legacyLevel;
  } else if (legacyTheme === "flow") {
    migrated.selectedTheme = "flowBorder";
  } else {
    migrated.selectedTheme = "ambientWave";
    if (legacyTheme === "blue" || legacyTheme === "purple" || legacyTheme === "warm") {
      migrated.ambientWave.tone = legacyTheme;
    }
  }

  return migrated;
}

function sanitizeSettings(input = {}) {
  const source = migrateLegacySettings(input);

  return {
    selectedTheme: pick(source.selectedTheme, VALID_MAIN_THEMES, DEFAULT_SETTINGS.selectedTheme),
    ambientWave: sanitizeAmbientWave(source.ambientWave),
    reactiveBorder: sanitizeReactiveBorder(source.reactiveBorder),
    flowBorder: sanitizeFlowBorder(source.flowBorder)
  };
}

function createSettingsStore(userDataPath) {
  const settingsPath = path.join(userDataPath, "settings.json");

  function load() {
    try {
      if (!fs.existsSync(settingsPath)) {
        return createDefaultSettings();
      }

      const fileContent = fs.readFileSync(settingsPath, "utf8");
      const parsed = JSON.parse(fileContent);
      return sanitizeSettings(parsed);
    } catch (_error) {
      return createDefaultSettings();
    }
  }

  function save(settings) {
    const cleanSettings = sanitizeSettings(settings);
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    fs.writeFileSync(settingsPath, JSON.stringify(cleanSettings, null, 2));
    return cleanSettings;
  }

  return {
    load,
    save,
    path: settingsPath
  };
}

module.exports = {
  DEFAULT_SETTINGS,
  createSettingsStore
};
