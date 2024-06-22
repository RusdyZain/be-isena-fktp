import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.headers["authorization"];

    if (!refreshToken) {
      console.log("No refresh token provided");
      return res.sendStatus(401);
    }

    const token = refreshToken.replace("Bearer ", "");

    // Verifikasi refresh token
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          console.log("Failed to verify refresh token", err);
          return res.sendStatus(403);
        }

        // Refresh token valid, continue to generate new access token
        const user = await Users.findOne({
          where: {
            jwt_token: token,
          },
        });

        if (!user) {
          console.log("Refresh token not found in database");
          return res.sendStatus(401);
        }

        const { uuid, username, email, satuankerja, role } = user;

        // Generate new access token
        const newAccessToken = jwt.sign(
          { uuid, username, email, satuankerja, role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1h",
          }
        );

        // Send new access token back to the client
        res.json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    console.error("Error in refreshToken handler", error);
    res.sendStatus(500);
  }
};
