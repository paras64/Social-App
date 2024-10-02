import jwt from 'jsonwebtoken'

export const verifyToken = async (req,res,next) => {
    try {
        let token = req.header("Authorization");
        if(!token){
            return res.status(403).sind("Access Denid");
        }
        if (token.startswith("Beare ")){
            token = token.slice(7, token.length).trimleft();
        }
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}