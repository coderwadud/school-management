import Event from "../../models/event/EventModel.js";

export const createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    eventData.organizer = req.user._id;

    const event = new Event(eventData);
    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate("schoolId", "name")
      .populate("organizer", "name");

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: populatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create event",
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const { eventType, status, month, year } = req.query;

    const query = {};
    if (eventType) query.eventType = eventType;
    if (status) query.status = status;

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query.startDate = { $gte: start, $lte: end };
    }

    const events = await Event.find(query)
      .populate("schoolId", "name")
      .populate("organizer", "name")
      .sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch events",
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("schoolId", "name")
      .populate("organizer", "name");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch event",
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update event",
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete event",
    });
  }
};
