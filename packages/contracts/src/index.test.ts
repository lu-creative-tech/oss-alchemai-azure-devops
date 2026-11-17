import { expect, test } from "vitest";
import { CONTRACT_VERSION } from "./index.js";

test("CONTRACT_VERSION is a semantic version", () => {
  expect(CONTRACT_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
});
