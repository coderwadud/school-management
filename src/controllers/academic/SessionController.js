import Session from "../../models/academic/SessionModel.js";
import School from "../../models/academic/SchoolModel.js";

export const createSession = async (req, res) => {
  try {
    const schoolId = req.schoolId;
    const { name, startDate, endDate, status } = req.body;
    // Check if the school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    const newSession = new Session({
      name,
      startDate,
      endDate,
      schoolId,
      status,
    });
    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSession = async (req, res) => {
  try {
    const schoolId = req.schoolId;
    const { name, startDate, endDate, status } = req.body;
    // Check if the school exists
    if (schoolId) {
      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
    }
    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      { name, startDate, endDate, schoolId, status },
      { new: true },
    );
    if (!updatedSession) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate("schoolId", "name");
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate(
      "schoolId",
      "name",
    );
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const deletedSession = await Session.findByIdAndDelete(req.params.id);
    if (!deletedSession) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSessionsOptions = async (req, res) => {
  try {
    const sessions = await Session.find().select("name");
    const options = sessions.map((session) => ({
      label: session.name,
      value: session._id,
    }));
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleSessionStatus = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    session.status = !session.status;
    const updatedSession = await session.save();
    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
