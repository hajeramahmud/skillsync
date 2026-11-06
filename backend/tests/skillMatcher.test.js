
const {
  normalizeSkills,
  calculateJaccard,
  getMatchedSkills
} = require("../utils/skillMatcher");

describe("Skill Matcher Unit Tests", () => {

  test("should normalize skills to lowercase and remove duplicates", () => {
    const result = normalizeSkills([
      "React",
      "NODE.JS",
      "React",
      " MongoDB "
    ]);

    expect(result).toEqual([
      "react",
      "node.js",
      "mongodb"
    ]);
  });

  test("should calculate Jaccard similarity correctly", () => {
    const projectSkills = [
      "React",
      "Node.js",
      "MongoDB"
    ];

    const userSkills = [
      "React",
      "Node.js",
      "MongoDB",
      "Express"
    ];

    const score = calculateJaccard(
      projectSkills,
      userSkills
    );

    expect(score).toBe(0.75);
  });

  test("should return zero when project has no required skills", () => {
    expect(calculateJaccard([], ["React"])).toBe(0);
  });

  test("should return matched skills only", () => {
    const result = getMatchedSkills(
      ["React", "Node.js", "MongoDB"],
      ["React", "Python", "MongoDB"]
    );

    expect(result).toEqual(["react", "mongodb"]);
  });

  test("should ignore non-string and empty skills", () => {
  const result = normalizeSkills([
    "React",
    123,
    "",
    "  ",
    "MongoDB"
  ]);

  expect(result).toEqual([
    "react",
    "mongodb"
  ]);
});

test("should use empty arrays when skills are undefined", () => {
  expect(normalizeSkills()).toEqual([]);
  expect(calculateJaccard()).toBe(0);
  expect(getMatchedSkills()).toEqual([]);
});

test("should return zero when there are no common skills", () => {
  const score = calculateJaccard(
    ["React"],
    ["Python"]
  );

  expect(score).toBe(0);
});

test("should return zero when both skill lists are empty", () => {
  expect(calculateJaccard([], [])).toBe(0);
});

test("should handle duplicate skills correctly", () => {
  const score = calculateJaccard(
    ["React", "React", "Node.js"],
    ["React", "Python"]
  );

  expect(score).toBe(1 / 3);
});

});