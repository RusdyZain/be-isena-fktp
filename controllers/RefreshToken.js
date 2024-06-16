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

        const authHeader = req.headers["authorization"];
        const accessToken = authHeader && authHeader.split(" ")[1];

        if (!accessToken) {
          console.log("No access token in header");
          return res.sendStatus(401);
        }

        jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET,
          (err, accessDecoded) => {
            if (err && err.name === "TokenExpiredError") {
              const { uuid, username, email, satuankerja, role } = user;

              const newAccessToken = jwt.sign(
                { uuid, username, email, satuankerja, role },
                process.env.ACCESS_TOKEN_SECRET,
                {
                  expiresIn: "3600s",
                }
              );

              return res.json({ accessToken: newAccessToken });
            } else if (err) {
              console.log("Failed to verify access token", err);
              return res.sendStatus(403);
            } else {
              console.log("Access token is still valid");
              return res.json({ accessToken });
            }
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in refreshToken handler", error);
    res.sendStatus(500);
  }
};
