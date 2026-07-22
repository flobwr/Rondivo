// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

// ─────────────────────────────────────────────────────────────────────────────
// Design-system guardrails
//
// Goal: make technical debt harder to add. We forbid *hard-coded colours* in
// all app code and steer developers to the design tokens (constants/design.ts,
// shadow.ts, motion.ts).
//
// The entire codebase is now colour-literal-free, so this is enforced as an
// ERROR everywhere except the token definition files (constants/**), where raw
// values legitimately live. Any new hard-coded hex/rgb/hsl colour fails lint —
// add a token instead (see ARCHITECTURE_RULES.md § Styling).
//
// Not enforced here (documented limitation): hard-coded *padding / radius /
// font-size numbers*. Numeric literals are indistinguishable at the AST level
// from legitimate layout numbers (flex, dimensions, durations, opacities), so a
// lint rule produces too many false positives to be useful. These are covered
// by code review + the token layer instead. A future option is
// eslint-plugin-react-native's `no-color-literals` / `no-inline-styles`, but it
// adds a dependency and overlaps with the rule below.
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

  // All app code: hard-coded colours are an error.
  {
    files: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'features/**/*.{ts,tsx}', 'hooks/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error', ...noHardcodedColors],
    },
  },

  // Token files may (and must) contain raw values. Listed last so it wins.
  {
    files: ['constants/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
]);
