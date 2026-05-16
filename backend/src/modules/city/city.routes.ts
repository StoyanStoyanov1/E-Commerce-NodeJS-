import { Router } from "express";
import * as CityController from "./city.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { CreateCitySchema, CreateCountrySchema } from "./city.schema.js";

const router = Router();

router.get("/", CityController.getCities);
router.get("/:id", CityController.getCityById);
router.post("/", authenticate, authorize("ADMIN"), validate(CreateCitySchema), CityController.createCity);
router.delete("/:id", authenticate, authorize("ADMIN"), CityController.deleteCity);

router.get("/countries/all", CityController.getCountries);
router.post("/countries", authenticate, authorize("ADMIN"), validate(CreateCountrySchema), CityController.createCountry);
router.delete("/countries/:id", authenticate, authorize("ADMIN"), CityController.deleteCountry);

export default router;