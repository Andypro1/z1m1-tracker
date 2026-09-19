const commonGlobals = Object.fromEntries(
  [
    "Blob",
    "WebSocket",
    "clearInterval",
    "clearTimeout",
    "console",
    "crypto",
    "fetch",
    "localStorage",
    "matchMedia",
    "process",
    "setInterval",
    "setTimeout",
    "structuredClone",
    "window",
  ].map((name) => [name, "readonly"]),
);

export default [
  {
    ignores: [
      ".netlify/**",
      ".svelte-kit/**",
      "build/**",
      "node_modules/**",
      "src/components/maps/**",
      "src/libs/**",
    ],
  },
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: commonGlobals,
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": [
        "error",
        { args: "after-used", argsIgnorePattern: "^_" },
      ],
      "no-unreachable": "error",
    },
  },
];
