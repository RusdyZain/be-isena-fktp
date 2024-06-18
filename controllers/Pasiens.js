import Pasiens from "../models/PasienModel.js";
import Users from "../models/UserModel.js";

export const getPasiens = async (req, res) => {
  try {
    let pasiens;
    if (
      req.role === "admin" ||
      req.role === "dokter" ||
      req.role === "apoteker"
    ) {
      pasiens = await Pasiens.findAll({
        attributes: [
          "uuid",
          "nobpjs",
          "nama",
          "statuspeserta",
          "tgllahir",
          "gender",
          "ppkumum",
          "nohp",
          "norm",
          "createdAt",
        ],
        include: [
          {
            model: Users,
            attributes: ["username", "email"],
          },
        ],
      });
    } else {
      pasiens = await Pasiens.findAll({
        attributes: [
          "uuid",
          "nobpjs",
          "nama",
          "statuspeserta",
          "tgllahir",
          "gender",
          "ppkumum",
          "nohp",
          "norm",
          "createdAt",
        ],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email"],
          },
        ],
      });
    }
    res.status(200).json(pasiens);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPasienById = async (req, res) => {
  try {
    const pasien = await Pasiens.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!pasien) return res.status(404).json({ msg: "Data not found!" });

    let response;
    if (
      req.role === "admin" ||
      req.role === "dokter" ||
      req.role === "apoteker"
    ) {
      response = await Pasiens.findOne({
        attributes: [
          "uuid",
          "nobpjs",
          "nama",
          "statuspeserta",
          "tgllahir",
          "gender",
          "ppkumum",
          "nohp",
          "norm",
          "createdAt",
        ],
        where: {
          id: pasien.id,
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email"],
          },
        ],
      });
    } else {
      response = await Pasiens.findOne({
        attributes: [
          "uuid",
          "nobpjs",
          "nama",
          "statuspeserta",
          "tgllahir",
          "gender",
          "ppkumum",
          "nohp",
          "norm",
          "createdAt",
        ],
        where: {
          [Op.and]: [{ id: pasien.id }, { userId: req.userId }],
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPasienByNoBPJS = async (req, res) => {
  console.log("Nomor BPJS:", req.params.nobpjs);
  try {
    const pasien = await Pasiens.findOne({
      where: {
        nobpjs: req.params.nobpjs,
      },
      include: [
        {
          model: Users,
          attributes: ["username", "email"],
        },
      ],
    });
    if (!pasien) {
      return res
        .status(404)
        .json({ msg: "Pasien dengan nomor BPJS ini tidak ditemukan." });
    }
    res.status(200).json(pasien);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createPasien = async (req, res) => {
  const {
    nobpjs,
    nama,
    statuspeserta,
    tgllahir,
    gender,
    ppkumum,
    nohp,
    norm,
    role,
  } = req.body;

  try {
    await Pasiens.create({
      nobpjs: nobpjs,
      nama: nama,
      statuspeserta: statuspeserta,
      tgllahir: tgllahir,
      gender: gender,
      ppkumum: ppkumum,
      nohp: nohp,
      norm: norm,
      role: role,
      userId: req.userDbId,
    });
    res.status(201).json({ msg: "Data Pasien Berhasil Dimasukan!" });
  } catch (error) {
    console.error(
      "Error menambahkan pasien:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ msg: error.response ? error.response.data : error.message });
  }
};

export const updatePasien = async (req, res) => {
  try {
    const pasien = await Pasiens.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!pasien) return res.status(404).json({ msg: "Data not found!" });
    const {
      nobpjs,
      nama,
      statuspeserta,
      tgllahir,
      gender,
      ppkumum,
      nohp,
      norm,
    } = req.body;
    if (req.role === "admin") {
      await Pasiens.update(
        { nobpjs, nama, statuspeserta, tgllahir, gender, ppkumum, nohp, norm },
        {
          where: {
            id: pasien.id,
          },
        }
      );
    } else {
      if (req.userId !== pasien.userId)
        return res.status(403).json({ msg: "Access X" });
      await Pasiens.update(
        { nobpjs, nama, statuspeserta, tgllahir, gender, ppkumum, nohp, norm },
        {
          where: {
            [Op.and]: [{ id: pasien.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Data Pasien berhasil di perbaharui!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deletePasien = async (req, res) => {
  try {
    const pasien = await Pasiens.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!pasien) return res.status(404).json({ msg: "Data not found!" });
    const {
      nobpjs,
      nama,
      statuspeserta,
      tgllahir,
      gender,
      ppkumum,
      nohp,
      norm,
    } = req.body;
    if (req.role === "admin") {
      await Pasiens.destroy({
        where: {
          id: pasien.id,
        },
      });
    } else {
      if (req.userId !== pasien.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Pasiens.destroy({
        where: {
          [Op.and]: [{ id: pasien.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Data Pasien berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
