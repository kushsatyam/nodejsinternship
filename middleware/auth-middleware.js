const jwt = require("jsonwebtoken");

const authMiddleware = async (req,res,next)=>{
    const headerToken = req.header("Authorization");

    try {
        const token = headerToken.replace("Bearer","").trim();
        const user = await jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({msg:error});
    }
}

module.exports = authMiddleware;