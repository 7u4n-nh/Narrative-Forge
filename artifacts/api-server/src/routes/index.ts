import { Router, type IRouter } from "express";
import healthRouter from "./health";
import narrativeRouter from "./narrative";

const router: IRouter = Router();

router.use(healthRouter);
router.use(narrativeRouter);

export default router;
