import Users from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  console.log("Verifying user with UUID:", req.userId);

  if (!req.userId) {
    return res.status(401).json({ msg: "Please login in your account!" });
  }

  try {
    const user = await Users.findOne({
      where: {
        uuid: req.userId,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update JWT token jika diperlukan
    const newToken = jwt.sign(
      {
        uuid: user.uuid,
        username: user.username,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Simpan token baru ke database
    await user.update({ jwt_token: newToken });

    req.userId = user.id;
    req.role = user.role;
    next();
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const klinikOnly = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  if (user.role !== "admin" && user.role !== "dokter")
    return res
      .status(403)
      .json({ msg: "Silahkan Login Menggunakan User Admin atau Dokter" });
  next();
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
