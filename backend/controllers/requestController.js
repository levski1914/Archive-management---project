const Request = require("../models/Request");
const Folder = require("../models/Folder");

exports.createRequest = async (req, res) => {
  try {
    const { documentId, reason } = req.body;
    const { id: userId } = req.user;

    console.log("Received data:", { documentId, reason, userId });
    if (!documentId || !reason || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newRequest = new Request({
      documentId,
      reason,
      userId,
      status: "Pending",
    });

    // console.log("details", newRequest);
    await newRequest.save();
    const populatedRequest = await Request.findById(newRequest._id).populate(
      "documentId"
    );

    console.log(populatedRequest);
    req.io.emit("new_request", populatedRequest);
    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(500).json({ message: "Error creating request", error });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate("documentId");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all requests", error });
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

exports.reminderHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    const request = await Request.findById(id).populate("documentId");
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.reminders.push({ sentAt: new Date(), by: userId });
    await request.save();

    req.io.emit("reminder", {
      documentId: request.documentId.name || "Unknown Document",
      userId: request.userId.toString(),
      message: `Напомняне: Върнете документа "${request.documentId.name}"!`,
    });

    console.log("Reminder emitted for user:", request.userId.toString());
    res.status(200).json({ message: "Reminder sent" });
  } catch (error) {
    console.error("Error sending reminder:", error);
    res.status(500).json({ message: "Error sending reminder", error });
  }
};
exports.returnHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findById(id).populate("documentId");
    if (!request) {
      res.status(404).json({ message: "Request not found" });
    }

    if (request.isReturned) {
      return res.status(400).json({ message: "Document is already returned" });
    }

    request.isReturned = true;
    await request.save();
    req.io.emit("document_returned", {
      documentId: request.documentId._id,
      requestId: request._id,
      userId: request.userId,
    });
    res.status(200).json({ message: "Document marked as returned" });
  } catch (error) {
    res.status(500).json({ message: "error marking document ", error });
  }
};
