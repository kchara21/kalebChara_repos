import { Router } from "express";
import DataController from "../controllers/data.controller";
;

const router = Router();

//Create organization
router.post("/organizations", DataController.createOrganization);

//Create tribu
router.post("/tribes", DataController.createTribu);

//Create tribu
router.post("/repositories", DataController.createRepository);

//Create tribu
router.post("/metrics", DataController.createMetric);

//Create organization
router.get("/watchAll", DataController.watchAll);

export default router;
