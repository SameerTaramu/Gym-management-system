import Class from "../model/classModel.js";

export const checkClassOwnership = async (req, res, next) => {
  const classId = req.body.classId || req.params.classId;
  if (!classId) return res.status(400).json({ message: "Class ID is required" });

  const gymClass = await Class.findById(classId);
  if (!gymClass) return res.status(404).json({ message: "Class not found" });

  if (gymClass.trainer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized for this class" });
  }

  req.gymClass = gymClass;
  next();
};
