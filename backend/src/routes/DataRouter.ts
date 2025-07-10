import express from "express"
import { postmistakes , fetchprofile} from "../controllers/DataController";
import { isAuthenticated } from "../middlewares/index";
const router = express.Router();
router.post("/postdata", isAuthenticated, postmistakes);
router.get("/getdata", isAuthenticated, fetchprofile);
export default router;