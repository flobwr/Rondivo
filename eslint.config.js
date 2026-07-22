// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

// ─────────────────────────────────────────────────────────────────────────────
// Design-system guardrails
//
// Goal: make technical debt harder to add without blocking day-to-day work.
// We forbid *hard-coded colours* in component/screen code and steer developers
// to the design tokens (constants/design.ts, shadow.ts, motion.ts).
//
// Strategy — two tiers so this is realistic to adopt (see ARCHITECTURE_RULES.md):
//   • NEW code (components/ui, future features/**): colours are an ERROR. This
//     surface is already token-clean, so it stays clean.
//   • LEGACY screens (app/**, components/home, components/planning): colours are
//     a WARNING — a migration backlog signal that never breaks the build.
//   • Token definition files (constants/**) are exempt: raw values live there
//     by design.
//
// Not enforced here (documented limitation): hard-coded *padding / radius /
// font-size numbers*. Numeric literals are indistinguishable at the AST level
// from legitimate layout numbers (flex, dimensions, durations, opacities), so a
// lint rule produces too many false positives to be useful. These are covered
// by code review + the token layer instead. A future option is
// eslint-plugin-react-native's `no-color-literals` / `no-inline-styles`, but it
// adds a dependency and overlaps with the rules below.
// ─────────────────────────────────────────────────────────────────────────────

const hexColor = "Literal[value=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]";
const funcColor = "Literal[value=/^(?:rgb|rgba|hsl|hsla)\\(/]";

const colorMessage =
  'Couleur codée en dur. Utilise un token (Palette / Accent / <AppText color> …). ' +
  'Voir ARCHITECTURE_RULES.md § Styling.';

const noHardcodedColors = [
  { selector: hexColor, message: colorMessage },
  { selector: funcColor, message: colorMessage },
];

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },

  // Token files may (and must) contain raw values.
  {
    files: ['constants/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },

  // NEW code: colours are an error — keep the design system and features clean.
  {
    files: ['components/ui/**/*.{ts,tsx}', 'features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error', ...noHardcodedColors],
    },
  },

  // LEGACY screens/components: colours are a non-blocking warning (migrate
  // opportunistically). Remove these overrides once a folder is fully migrated.
  {
    files: [
      'app/**/*.{ts,tsx}',
      'components/home/**/*.{ts,tsx}',
      'components/planning/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-syntax': ['warn', ...noHardcodedColors],
    },
  },
]);
