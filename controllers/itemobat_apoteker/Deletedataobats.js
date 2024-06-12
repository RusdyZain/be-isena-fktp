import Dataobats from "../../models/itemobat_apoteker/DataobatModel.js";
import Deletedataobats from "../../models/itemobat_apoteker/DeletedataobatModel.js";
import Users from "../../models/UserModel.js";

export const getDeletedataobats = async (req, res) => {
    try {
        let response;
        if (req.role === "statistik") {
            response = await Deletedataobats.findAll({
                attributes: ['uuid', 'namaobat', 'jumlahobat', 'tglkadaluarsa', 'nobatch', 'jenisobat', 'hargaobat', 'kategori', 'userId', 'deletedAt'],
                include: [{
                    model: Users,
                    attributes: ['username', 'email']
                }]
            });
        } else {
            response = await Deletedataobats.findAll({
                attributes: ['uuid', 'namaobat', 'jumlahobat', 'tglkadaluarsa', 'nobatch', 'jenisobat', 'hargaobat', 'kategori', 'userId', 'deletedAt'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: Users,
                    attributes: ['username', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
