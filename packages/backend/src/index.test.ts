import { CONTRACT_VERSION } from "@alchemai/contracts";
import { expect, test } from "vitest";
import { SUPPORTED_CONTRACT_VERSION } from "./index.js";

test("backend supports the current contract version", () => {
  expect(SUPPORTED_CONTRACT_VERSION).toBe(CONTRACT_VERSION);
});
