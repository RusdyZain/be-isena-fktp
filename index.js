import express from "express";
import db from "./config/Database.js";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import PasienRoute from "./routes/PasienRoute.js";
import AuthPasienRoute from "./routes/AuthPasienRoute.js";
import KeadaanfisikRoute from "./routes/kajiawal_pasien/KeadaanfisikRoute.js";
import PengajuanRoute from "./routes/kajiawal_pasien/PengajuanRoute.js";
import TekanandarahRoute from "./routes/kajiawal_pasien/TekanandarahRoute.js";
import DiagnosaRoute from "./routes/datakunjungan_dokter/DiagnosaRoute.js";
import PemeriksaanRoute from "./routes/datakunjungan_dokter/PemeriksaanRoute.js";
import PelayananRoute from "./routes/datakunjungan_dokter/PelayananRoute.js";
import ObatRoute from "./routes/datakunjungan_dokter/ObatRoute.js";
import RiwayatalergiRoute from "./routes/datakunjungan_dokter/RiwayatalergiRoute.js";
import TandatanganRoute from "./routes/datakunjungan_dokter/TandatanganRoute.js";
import DataobatRoute from "./routes/itemobat_apoteker/DataobatRoute.js";
import PegawaiRoute from "./routes/PegawaiRoute.js";
import AuthPegawaiRoute from "./routes/AuthPegawaiRoute.js";
import DatasakitRoute from "./routes/datasakit_pegawai/DatasakitRoute.js";
import HomevisitRoute from "./routes/datasakit_pegawai/HomevisitRoute.js";
import TotalPenyakitRoute from "./routes/data_statistik/TotalPenyakitRoute.js";
import DeletedataobatModel from "./routes/itemobat_apoteker/DeletedataobatRoute.js";

dotenv.config();
const app = express();

// SequelizeStore initialization
const SequelizeSessionStore = SequelizeStore(session.Store);

const store = new SequelizeSessionStore({
  db: db, // Ensure db is the Sequelize instance
});

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: false, // Set to true if using HTTPS
      sameSite: "lax", // Consider "lax" or "none" if secure: true
      httpOnly: true,
    },
  })
);

(async () => {
  await db.sync(); // Sync database models
  await store.sync(); // Sync session store
})();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(UserRoute);
app.use(AuthRoute);
app.use(PasienRoute);
app.use(AuthPasienRoute);
app.use(KeadaanfisikRoute);
app.use(PengajuanRoute);
app.use(TekanandarahRoute);
app.use(DiagnosaRoute);
app.use(PemeriksaanRoute);
app.use(PelayananRoute);
app.use(ObatRoute);
app.use(RiwayatalergiRoute);
app.use(TandatanganRoute);
app.use(DataobatRoute);
app.use(PegawaiRoute);
app.use(AuthPegawaiRoute);
app.use(DatasakitRoute);
app.use(HomevisitRoute);
app.use(TotalPenyakitRoute);
app.use(DeletedataobatModel);

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});
