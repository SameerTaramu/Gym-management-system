// import express from "express";
// import Class from "../model/classModel.js"; 

// const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const classes = await Class.find()
//       .populate("trainer", "name")
//       .sort({ createdAt: -1 }); 

//     res.json(classes);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch classes" });
//   }
// });

// export default router;
