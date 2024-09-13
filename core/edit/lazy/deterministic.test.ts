import FileSystemIde from "../../util/filesystem";
import { applyLazyCodeDeterministically } from "./deterministic";
import { UNCHANGED_CODE } from "./prompts";
import { jest } from "@jest/globals";

describe("applyLazyCodeDeterministically", () => {
  const mockIde = new FileSystemIde(process.cwd());

  it("should correctly merge lazy code with the original code", async () => {
    const oldCode = `
class Calculator {
  add(number) {
    this.result += number;
    return this;
  }

  getResult() {
    return this.result;
  }
}
`;

    const newCode = `
class Calculator {
  // ${UNCHANGED_CODE}

  exponent(number) {
    this.result = Math.pow(this.result, number);
    return this;
  }

  // ${UNCHANGED_CODE}
}
`;

    const expectedResult = `
class Calculator {
  add(number) {
    this.result += number;
    return this;
  }

  exponent(number) {
    this.result = Math.pow(this.result, number);
    return this;
  }

  getResult() {
    return this.result;
  }
}
`;

    // Mock the readFile method of mockIde
    // @ts-ignore
    mockIde.readFile = jest.fn().mockResolvedValue(oldCode);

    const result = await applyLazyCodeDeterministically(
      newCode,
      "test.ts", // Needs to have correct filetype ending for AST parsing
      mockIde,
    );

    expect(result.trim()).toEqual(expectedResult.trim());
  });
});
