import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

export const postLogin = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "Akun tidak terdaftar" });
    }

    const match = await argon2.verify(user.password, req.body.password);
    if (!match) {
      return res
        .status(400)
        .json({ msg: "Password Salah. Silahkan Masukan Lagi!" });
    }

    req.session.userId = user.uuid;
    req.session.userData = {
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      satuankerja: user.satuankerja,
      role: user.role,
    };

    const { uuid, username, email, satuankerja, role } = user;

    const accessToken = jwt.sign(
      { uuid, username, email, satuankerja, role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "360s",
      }
    );

    const refreshToken = jwt.sign(
      { uuid, username, email, satuankerja, role },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "3600s",
      }
    );

    await Users.update(
      { jwt_token: refreshToken },
      {
        where: {
          uuid: user.uuid,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      partitioned: true,
    });

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
      }

      res.json({ accessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const deleteLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const user = await Users.findAll({
      where: {
        jwt_token: refreshToken,
      },
    });

    if (!user[0]) return res.sendStatus(204);

    const userId = user[0].id;
    await Users.update(
      { jwt_token: null },
      {
        where: {
          id: userId,
        },
      }
    );

    res.clearCookie("refreshToken", {
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      partitioned: true,
    });

    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ msg: "Logout Failed!" });
      }
      res.status(200).json({ msg: "Successfully logged out" });
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
