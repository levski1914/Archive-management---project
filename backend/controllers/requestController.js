const Request = require("../models/Request");
const Folder = require("../models/Folder");

exports.createRequest = async (req, res) => {
  try {
    const { documentId, reason } = req.body;
    const { id: userId } = req.user;

    const newRequest = new Request({
      documentId,
      reason,
      userId,
      status: "Pending",
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: "Error creating request", error });
  }
};

exports.getRequestsByUser = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user._id }).populate(
      "documentId"
    ); // Увери се, че полето е "documentId", ако е различно, смени го
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Проверка дали заявката вече е обработена
    if (request.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Request has already been processed" });
    }

    request.status = status;
    request.history.push({ status, updatedAt: Date.now() });
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: "Error updating request status", error });
  }
};
