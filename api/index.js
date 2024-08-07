import express from "express";
import dotenv from "dotenv";
import "../db_connect.js";
import cors from "cors";
import authRouter from "./routers/auth.router.js";
import { userRoute } from "./routers/user.router.js";
import { listingRoute } from "./routers/listing.router.js";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT_NUMBER || 3000;
const app = express();

// app.use(
//   cors({
//     // origin: "http://localhost:5173",
//     origin: "https://express-react-frontend-flame.vercel.app/",
//     credentials: true,
//   })
// );

app.use(cors())

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => console.log(`server runnig at port number ${PORT}`));

app.get("/", (req, res) => {
  res.send("server is running");
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRouter);
app.use("/api/listings", listingRoute);
