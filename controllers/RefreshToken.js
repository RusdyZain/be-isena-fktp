import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      console.log("No refresh token in cookies");
      return res.sendStatus(401);
    }

    const user = await Users.findOne({
      where: {
        jwt_token: refreshToken,
      },
    });

    if (!user) {
      console.log("Refresh token not found in database");
      return res.sendStatus(401);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          console.log("Failed to verify refresh token", err);
          return res.sendStatus(403);
        }

        const { uuid, username, email, satuankerja, role } = user;

        const accessToken = jwt.sign(
          { uuid, username, email, satuankerja, role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "3600s",
          }
        );

        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.error("Error in refreshToken handler", error);
    res.sendStatus(500);
  }
};
