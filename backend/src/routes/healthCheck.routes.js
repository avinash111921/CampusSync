import Router from 'express';
import healthCheck from "../controllers/healthcheck.controllers.js"

const router = Router();

router.route("/").get(healthCheck);

export default router;

// {
//     "statusCode": 200,
//     "data": "OK",
//     "message": "Health check successful",
//     "success": true
// }