import express from "express";
import jwtCheck from "../config/auth0Config.js";
import {
  createResidency,
  getAllResidencies,
  getResidency,
} from "../controllers/residencycntrl.js";

const router = express.Router(); //send and retrieve data from back-end
router.post("/create", jwtCheck, createResidency);
router.get("/allresd", getAllResidencies); // no jwt because if user is not authenticated still they can see these
router.get("/:id", getResidency);

export { router as residencyRoute };
