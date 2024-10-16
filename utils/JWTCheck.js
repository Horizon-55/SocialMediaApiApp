import env from "dotenv";
import jwt from "jsonwebtoken";
env.config();
const SecretToken = process.env.JWTSecret;

//створення токена!
export function creatingToken(UserId, UserEmail) {
  const token = jwt.sign(
    {
      UserId: UserId,
      UserEmail: UserEmail,
    },
    SecretToken,
    { expiresIn: "1h" }
  );
  return token;
}

export const authMiddleware = (req, res, next) => {
  console.log("Headers:", req.headers);
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Extracted token:", token);
  if (!token) {
    console.log("Decoded token:", decoded);
    return res.status(401).json({ message: "Необхідна авторизація!" });
  }

  try {
    const decoded = jwt.verify(token, SecretToken);
    req.user = { id: decoded.UserId, email: decoded.UserEmail };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Недійсний токен!" });
  }
};
