import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import router from "./routes";
import cors from "cors";
import { jwtStrategy } from './config/passport';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000; // Provide a default port if not set
app.use(cors({
  origin: '*', // You can restrict this to specific domains for more security
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use('jwt', jwtStrategy);

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Your SERVER is RUNNING at ${PORT}`);
});
