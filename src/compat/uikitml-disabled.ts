/**
 * Original compatibility boundary for SDK imports of the optional markup loader.
 * The application constructs UIKit components directly; no UIKitML code is used.
 */
function disabled(..._arguments: unknown[]): never {
  throw new Error(
    "UIKitML loading is disabled in Between Hands. Use programmatic UIKit components.",
  );
}

export {
  disabled as parse,
  disabled as instantiate,
  disabled as resolveKitComponentSets,
};
