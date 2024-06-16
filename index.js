import express from "express";
import db from "./config/Database.js";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import SequelizeStore from "connect-session-sequelize";
import helmet from "helmet";
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
import DeletedataobatRoute from "./routes/itemobat_apoteker/DeletedataobatRoute.js";

dotenv.config();
const app = express();

const SequelizeSessionStore = SequelizeStore(session.Store);

const store = new SequelizeSessionStore({
  db: db,
});

// 1. Enable CORS middleware before defining routes
app.use(
  cors({
    credentials: true,
    origin: "https://isena-fktp.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Add this line to handle OPTIONS requests
app.options(
  "*",
  cors({
    credentials: true,
    origin: "https://isena-fktp.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 2. Set up helmet middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// 3. Set CORS headers manually
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://isena-fktp.vercel.app");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  console.log("CORS headers set for:", req.method, req.url); // Logging for debugging
  next();
});

// 4. Set up session middleware
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      httpOnly: true,
    },
  })
);

// 5. Sync database and session store
(async () => {
  await db.sync();
  await store.sync();
})();

// 6. Use JSON and cookie parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// 7. Use routes - make sure this comes after the middleware setup
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
app.use(DeletedataobatRoute);

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});
