const { v4: uuidv4 } = require("uuid");
const sectionService = require("./projectSection.service");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

exports.addSection = async (req, res) => {
  try {
    const id = uuidv4();
    const { project_id, section_type, position, data } = req.body;

    await sectionService.createSection({
      id,
      project_id,
      section_type,
      position,
      data
    });

    res.status(201).json({
      message: "Project section added",
      id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSections = async (req, res) => {
  try {
    const { projectId } = req.params;
    const sections = await sectionService.getSectionsByProject(projectId);

    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSection = async (req, res) => {
  const { id } = req.params;

  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid section ID" });
  }

  try {
    const updated = await sectionService.updateSection(id, req.body);

    if (!updated) {
      return res
        .status(404)
        .json({ error: "Section not found or no fields updated" });
    }

    res.json({ message: "Section updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update section" });
  }
};

// Update section scoped to a project id (safer for frontend URLs)
exports.updateSectionForProject = async (req, res) => {
  const { projectId, id } = req.params;

  if (!UUID_REGEX.test(projectId)) {
    return res.status(400).json({ error: "Invalid project ID" });
  }
  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid section ID" });
  }

  try {
    const existing = await sectionService.getSectionById(id);
    if (!existing || existing.project_id !== projectId) {
      return res.status(404).json({ error: "Section not found for this project" });
    }

    const updated = await sectionService.updateSection(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Section not found or no fields updated" });
    }

    res.json({ message: "Section updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update section" });
  }
};

// Update section by projectId + section_type (no need for section id)
exports.updateSectionByType = async (req, res) => {
  const { projectId, sectionType } = req.params;

  if (!UUID_REGEX.test(projectId)) {
    return res.status(400).json({ error: "Invalid project ID" });
  }

  try {
    const sections = await sectionService.getSectionsByProject(projectId);
    const target = sections.find(
      (s) => s.section_type === sectionType
    );

    if (!target) {
      return res
        .status(404)
        .json({ error: "Section with this type not found for project" });
    }

    const updated = await sectionService.updateSection(target.id, req.body);
    if (!updated) {
      return res
        .status(404)
        .json({ error: "Section not found or no fields updated" });
    }

    res.json({ message: "Section updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update section" });
  }
};
