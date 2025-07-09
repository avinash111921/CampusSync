import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const healthCheck = AsyncHandler(async (_,res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "OK",
        "Health check successful"
    ))
})

export default healthCheck;