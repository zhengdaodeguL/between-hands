import assert from "node:assert/strict";
import test from "node:test";
import {
  instantiate,
  parse,
  resolveKitComponentSets,
} from "../src/compat/uikitml-disabled";

test("markup loading fails explicitly instead of silently producing an empty menu", () => {
  for (const entry of [parse, instantiate, resolveKitComponentSets]) {
    assert.throws(
      () => entry("<div />"),
      /UIKitML loading is disabled.*programmatic UIKit components/,
    );
  }
});
