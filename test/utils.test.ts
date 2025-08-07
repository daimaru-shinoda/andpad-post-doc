import {
  loadJsonAndpad,
  loadJsonGas,
  formatDate,
  zenkakuToHankaku,
} from "../src/utils";

describe("loadJsonAndpad", () => {
  it("should not throw error", () => {
    const json = loadJsonAndpad();
    expect(json.mail).toBeDefined();
    expect(json.password).toBeDefined();
  });
});

describe("loadJsonGas", () => {
  it("should not throw error", () => {
    const json = loadJsonGas();
    expect(json.url).toBeDefined();
    expect(json.apiKey).toBeDefined();
  });
});

describe("formatDate", () => {
  it("should formated", () => {
    const actual = formatDate(new Date(2023, 9, 10));
    expect(actual).toBe("2023-10-10");
  });
  it("should be padding 0", () => {
    const actual = formatDate(new Date(2023, 0, 1));
    expect(actual).toBe("2023-01-01");
  });
});

describe("zenkakuToHankaku", () => {
  it("can convert", () => {
    expect(zenkakuToHankaku("１２３４５６７８９０")).toBe("1234567890");
  });
});
