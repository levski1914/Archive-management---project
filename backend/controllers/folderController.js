const Folder = require("../models/Folder");

exports.createFolder = async (req, res) => {
  try {
    const { name, client, year, code, location } = req.body;
    const { companyId } = req.user;

    const newFolder = new Folder({
      name,
      client,
      year,
      code,
      location,
      companyId,
    });

    await newFolder.save();
    res.status(201).json(newFolder);
  } catch (error) {
    res.status(500).json({ message: "error creating folder", error });
  }
};

exports.getAllFolders = async (req, res) => {
  try {
    const { companyId } = req.user;
    const folders = await Folder.find({ companyId });

    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching folders", error });
  }
};

exports.getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) res.status(404).json({ message: "Folder not found" });
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: "error fetching folder", error });
  }
};

exports.updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFolder = await Folder.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedFolder)
      return res.status(404).json({ message: "Folder not found" });

    res.status(200).json(updatedFolder);
  } catch (error) {
    res.status(500).json({ message: "Error updating folder", error });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFolder = await Folder.findByIdAndDelete(id);

    if (!deletedFolder)
      return res.status(404).json({ message: "Folder not found" });

    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting folder", error });
  }
};

exports.searchFolders = async (req, res) => {
  try {
    const { name, client, year } = req.query;
    const { companyId } = req.user;

    const query = { companyId };
    if (name) query.name = { $regex: name, $options: "i" };
    if (client) query.client = { $regex: client, $options: "i" };
    if (year) query.year = year;

    const folders = await Folder.find(query);
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: "Error searching folders", error });
  }
};
