import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import cookieParser from "cookie-parser";
import path from "path";

import mainRouter from "./routes/mainRouter";
import "./utils/tokenExpirationCheckerUtil";
import { Answers } from "./answers";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const cookieMaxAge = process.env.cookieMaxAge ? parseInt(process.env.cookieMaxAge) : 0;
if (cookieMaxAge === 0) throw new Error(Answers.ERROR.COOKIE_MAX_AGE_NOT_PROVIDED);
const SESSION_SECRET = process.env.Session_Secret;
if (!SESSION_SECRET) throw new Error(Answers.ERROR.SESSION_SECRET_NOT_PROVIDED);
const hstsMaxAge = process.env.hstsMaxAge ? parseInt(process.env.hstsMaxAge) : 0;
if (hstsMaxAge === 0) throw new Error(Answers.ERROR.HSTS_MAX_AGE);

app.use(cookieParser());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: cookieMaxAge, // 10 days
      secure: true // cookie is only accessible over HTTP, requires HTTPS
    }
  })
);

app.use(
  helmet({
    hsts: {
      maxAge: hstsMaxAge, // 1 year
      includeSubDomains: true,
      preload: true // in supported browsers
    }
  })
);
app.options("*", cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", mainRouter);

app.set("views", path.join("views"));
app.set("view engine", "ejs");

app.listen(port, () => {
  console.log(`Server is listening at port:${port}`);
});
