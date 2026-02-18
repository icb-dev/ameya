const { v4: uuidv4 } = require("uuid");
const service = require("./about.service");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// ===== About main record =====

// Create about entry
exports.createAbout = async (req, res) => {
  try {
    const id = uuidv4();
    const {
      video_url,
      delivered_projects,
      ongoing_development,
      satisfied_customers,
      brand_partnerships
    } = req.body;

    await service.createAbout({
      id,
      video_url,
      delivered_projects,
      ongoing_development,
      satisfied_customers,
      brand_partnerships
    });

    res.status(201).json({
      message: "About entry created",
      id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create about entry" });
  }
};

// List all about entries
exports.listAbout = async (req, res) => {
  try {
    const entries = await service.getAllAbout();
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch about entries" });
  }
};

// Get single about entry
exports.getAbout = async (req, res) => {
  const { id } = req.params;
  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid about ID" });
  }
  try {
    const entry = await service.getAboutById(id);
    if (!entry) {
      return res.status(404).json({ error: "About entry not found" });
    }
    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch about entry" });
  }
};

// Update about entry
exports.updateAbout = async (req, res) => {
  const { id } = req.params;
  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid about ID" });
  }
  try {
    const updated = await service.updateAbout(id, req.body);
    if (!updated) {
      return res
        .status(404)
        .json({ error: "About entry not found or no fields updated" });
    }
    res.json({ message: "About entry updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update about entry" });
  }
};

// Delete about entry
exports.deleteAbout = async (req, res) => {
  const { id } = req.params;
  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid about ID" });
  }
  try {
    const deleted = await service.deleteAbout(id);
    if (!deleted) {
      return res.status(404).json({ error: "About entry not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete about entry" });
  }
};

// ===== Logos (dynamic list) =====

// Add logo
exports.addLogo = async (req, res) => {
  const { aboutId } = req.params;
  if (!UUID_REGEX.test(aboutId)) {
    return res.status(400).json({ error: "Invalid about ID" });
  }
  try {
    const id = uuidv4();
    const { image_url, position = 1 } = req.body;

    await service.addLogo({
      id,
      about_id: aboutId,
      image_url,
      position
    });

    res.status(201).json({
      message: "Logo added",
      id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add logo" });
  }
};

// List logos for about entry
exports.listLogos = async (req, res) => {
  const { aboutId } = req.params;
  if (!UUID_REGEX.test(aboutId)) {
    return res.status(400).json({ error: "Invalid about ID" });
  }
  try {
    const logos = await service.getLogosByAbout(aboutId);
    res.json(logos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logos" });
  }
};

// Delete single logo
exports.deleteLogo = async (req, res) => {
  const { id } = req.params;
  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid logo ID" });
  }
  try {
    const deleted = await service.deleteLogo(id);
    if (!deleted) {
      return res.status(404).json({ error: "Logo not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete logo" });
  }
};

