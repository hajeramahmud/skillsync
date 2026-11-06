
const express = require("express");
const request = require("supertest");

jest.mock("../models/Project", () => ({
  findById: jest.fn()
}));

jest.mock("../models/User", () => ({
  aggregate: jest.fn()
}));

jest.mock("../middleware/authMiddleware", () => ({
  protect: (req, res, next) => {
    req.user = { _id: "test-user-id" };
    next();
  }
}));

const Project = require("../models/Project");
const User = require("../models/User");
const projectRoutes = require("../routes/projectRoutes");

const app = express();
app.use(express.json());
app.use("/api/projects", projectRoutes);

const projectId = "6a358675fc19b8ba8a59215a";

describe("Project Recommendation API Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    Project.findById.mockResolvedValue({
      _id: projectId,
      title: "SkillSync App",
      skillsNeeded: ["React", "Node.js", "MongoDB"],
      owner: "owner-id",
      members: []
    });

    User.aggregate.mockResolvedValue([
      {
        _id: "candidate-1",
        name: "Sadia",
        email: "sadia@example.com",
        bio: "",
        skills: ["React", "Express", "Node.js", "MongoDB"]
      },
      {
        _id: "candidate-2",
        name: "NJH",
        email: "njh@example.com",
        bio: "",
        skills: ["React", "Node.js"]
      }
    ]);
  });

  test("should return ranked recommendations successfully", async () => {
    const response = await request(app)
      .get(`/api/projects/${projectId}/recommendations`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.totalCandidates).toBe(2);
    expect(response.body.recommendations[0].name).toBe("Sadia");
    expect(response.body.recommendations[0].score).toBe(75);
    expect(response.body.recommendations[1].score).toBe(67);
  });

  test("should return 404 when project does not exist", async () => {
    Project.findById.mockResolvedValueOnce(null);

    const response = await request(app)
      .get(`/api/projects/${projectId}/recommendations`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Project not found");
  });

  test("should return 400 for an invalid project ID", async () => {
    const response = await request(app)
      .get("/api/projects/invalid-id/recommendations");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid project ID");
  });

  test("should return an empty list when no candidates are available", async () => {
  User.aggregate.mockResolvedValueOnce([]);

  const response = await request(app)
    .get(`/api/projects/${projectId}/recommendations`);

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.totalCandidates).toBe(0);
  expect(response.body.recommendations).toEqual([]);
});

test("should sort candidates alphabetically when scores are equal", async () => {
  User.aggregate.mockResolvedValueOnce([
    {
      _id: "candidate-1",
      name: "Zain",
      email: "zain@example.com",
      bio: "",
      skills: ["React", "Node.js", "MongoDB"]
    },
    {
      _id: "candidate-2",
      name: "Ayesha",
      email: "ayesha@example.com",
      bio: "",
      skills: ["React", "Node.js", "MongoDB"]
    }
  ]);

  const response = await request(app)
    .get(`/api/projects/${projectId}/recommendations`);

  expect(response.status).toBe(200);
  expect(response.body.recommendations[0].name).toBe("Ayesha");
  expect(response.body.recommendations[1].name).toBe("Zain");
  expect(response.body.recommendations[0].score).toBe(100);
  expect(response.body.recommendations[1].score).toBe(100);
});

});