import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await Users.findOne({
      where: {
        uuid: decoded.uuid,
      },
    });
    if (!user) return res.status(404).json({ msg: "User not found" });

    req.userId = user.id;
    req.role = user.role;
    next();
  } catch (error) {
    console.log("Token verification error:", error);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export const dokterOnly = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  if (user.role !== "dokter")
    return res
      .status(403)
      .json({ msg: "Silahkan Login Menggunakan User Dokter" });
  next();
};

export const adminOnly = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  if (user.role !== "admin")
    return res
      .status(403)
      .json({ msg: "Silahkan Login Menggunakan User Admin" });
  next();
};

export const apotekerOnly = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  if (user.role !== "apoteker")
    return res
      .status(403)
      .json({ msg: "Silahkan Login Menggunakan User Apoteker" });
  next();
};

export const pawasOnly = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  if (user.role !== "pawas")
    return res.status(403).json({
      msg: "Silahkan Login Menggunakan User Perwira Pengawas (PAWAS)",
    });
  next();
};

export const statistikOnly = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  if (user.role !== "statistik")
    return res
      .status(403)
      .json({ msg: "Silahkan Login Menggunakan User Statistik" });
  next();
};

export const apotekOnly = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  if (user.role !== "apoteker" && user.role !== "dokter")
    return res
      .status(403)
      .json({ msg: "Silahkan Login Menggunakan User Dokter dan Apoteker" });
  next();
};
