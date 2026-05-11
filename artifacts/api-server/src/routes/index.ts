import { Router, type IRouter } from "express";
import healthRouter from "./health";
import cyclesRouter from "./cycles";
import subjectsRouter from "./subjects";
import resourcesRouter from "./resources";
import newsRouter from "./news";
import paymentsRouter from "./payments";
import usersRouter from "./users";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(cyclesRouter);
router.use(subjectsRouter);
router.use(resourcesRouter);
router.use(newsRouter);
router.use(paymentsRouter);
router.use(usersRouter);
router.use(statsRouter);

export default router;
