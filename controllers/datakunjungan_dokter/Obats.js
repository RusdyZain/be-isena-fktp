import Obats from "../../models/datakunjungan_dokter/ObatModel.js";
import Pasiens from "../../models/PasienModel.js";
// import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const getObats = async (req, res) => {
    try {
        let response;
        if (req.role === "pasien") {
            response = await Obats.findAll({
                include: [{
                    model: Pasiens,
                    attributes: ['uuid', 'nama', 'nobpjs'] 
                }]
            });
        } else {
            response = await Obats.findAll({
                where: {
                    pasienId: req.pasienId
                },
                include: [{
                    model: Pasiens,
                    attributes: ['uuid', 'nama', 'nobpjs'] 
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const getObatById = async (req, res) => {
    try {
        const itemobat = await Obats.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!itemobat) return res.status(404).json({ msg: "Data not found!" });

        let response;
        if (req.role === "pasien") {
            response = await Obats.findOne({
                where: {
                    id: itemobat.id
                },
                include: [{
                    model: Pasiens,
                    attributes: ['uuid', 'nama', 'nobpjs']
                }]
            });
        } else {
            response = await Obats.findOne({
                where: {
                    [Op.and]: [{ id: itemobat.id }, { pasienId: req.pasienId }]
                },
                include: [{
                    model: Pasiens,
                    attributes: ['uuid', 'nama', 'nobpjs']
                }]
            });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const createObat = async (req, res) => {
    const { jenisobat1, jenisobat2, jenisobat3, jenisobat4, jenisobat5, BMHP } = req.body;
    try {
        const itemobat = await Obats.create({
            jenisobat1: jenisobat1,
            jenisobat2: jenisobat2,
            jenisobat3: jenisobat3,
            jenisobat4: jenisobat4,
            jenisobat5: jenisobat5,
            BMHP: BMHP,
            pasienId: req.pasienId 
        });

        res.status(201).json({ msg: "Data Obat Berhasil Ditambahkan", itemobat });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateObat = async (req, res) => {
    try {
        const itemobat = await Obats.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!itemobat) return res.status(404).json({ msg: "Data not found!" });
        const allowedFields = [
            'jenisobat1', 'jenisobat2', 'jenisobat3', 'jenisobat4', 'jenisobat5', 'BMHP'
        ];
        const updateFields = {};
        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key)) {
                updateFields[key] = req.body[key];
            }
        });

        await Obats.update(updateFields, {
            where: {
                uuid: req.params.id
            }
        });

        res.status(200).json({ msg: "Data Obat berhasil diperbaharui!" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const deleteObat = async(req, res) =>{
    try {
        const itemobat = await Obats.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!itemobat) return res.status(404).json({msg: "Data not found!"});
        const { jenisobat1, jenisobat2, jenisobat3, jenisobat4, jenisobat5, BMHP } = req.body;
        if(req.role === "pasien"){
            await Obats.destroy({
                where:{
                    id: itemobat.id
                }
            });
        }else{
            if(req.pasienId !== itemobat.pasienId) return res.status(403).json({msg: "Akses terlarang"});
            await Obats.destroy({
                where:{
                    [Op.and]:[{id: itemobat.id}, {pasienId: req.pasienId}]
                }
            });
        }
        res.status(200).json({msg: "Data Obat berhasil dihapus!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}