const express = require("express");
const router = express.Router();

const controller = require("../controllers/incidentsController");
const validateIncident = require("../validation/validateIncident");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);

router.post("/", validateIncident, controller.create);
router.put("/:id", validateIncident, controller.update);

router.delete("/:id", controller.delete);

module.exports = router;
