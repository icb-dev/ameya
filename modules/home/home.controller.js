const { v4: uuidv4 } = require("uuid");
const service = require("./home.service");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Create home entry
exports.createHome = async (req, res) => {
  try {
    const id = uuidv4();
    const { banner_image, title, large_title, button_url } = req.body;

    await service.createHome({
      id,
      banner_image,
      title,
      large_title,
      button_url
    });

    res.status(201).json({
      message: "Home entry created",
      id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create home entry" });
  }
};

// List all home entries
exports.listHome = async (req, res) => {
  try {
    const entries = await service.getAllHome();
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch home entries" });
  }
};

// Get single home entry by id
exports.getHome = async (req, res) => {
  const { id } = req.params;
  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid home ID" });
  }
  try {
    const entry = await service.getHomeById(id);
    if (!entry) {
      return res.status(404).json({ error: "Home entry not found" });
    }
    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch home entry" });
  }
};

// Update home entry
exports.updateHome = async (req, res) => {
  const { id } = req.params;
  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid home ID" });
  }
  try {
    const updated = await service.updateHome(id, req.body);
    if (!updated) {
      return res
        .status(404)
        .json({ error: "Home entry not found or no fields updated" });
    }
    res.json({ message: "Home entry updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update home entry" });
  }
};

// Delete home entry
exports.deleteHome = async (req, res) => {
  const { id } = req.params;
  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid home ID" });
  }
  try {
    const deleted = await service.deleteHome(id);
    if (!deleted) {
      return res.status(404).json({ error: "Home entry not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete home entry" });
  }
};

