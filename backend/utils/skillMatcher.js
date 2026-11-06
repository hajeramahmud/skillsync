function normalizeSkills(skills = []) {
  return [
    ...new Set(
      skills
        .filter(skill => typeof skill === "string")
        .map(skill => skill.trim().toLowerCase())
        .filter(Boolean)
    )
  ];
}

function calculateJaccard(projectSkills = [], userSkills = []) {
  const required = normalizeSkills(projectSkills);
  const candidate = normalizeSkills(userSkills);

  if (required.length === 0) return 0;

  const candidateSet = new Set(candidate);

  const matchedSkills = required.filter(skill =>
    candidateSet.has(skill)
  );

  const union = new Set([...required, ...candidate]);

  return union.size === 0
    ? 0
    : matchedSkills.length / union.size;
}

function getMatchedSkills(projectSkills = [], userSkills = []) {
  const required = normalizeSkills(projectSkills);
  const candidate = new Set(normalizeSkills(userSkills));

  return required.filter(skill => candidate.has(skill));
}

module.exports = {
  normalizeSkills,
  calculateJaccard,
  getMatchedSkills
};