import {Router} from "express"
import {validateRegisterUser, validateLoginUser} from "../validator/auth.validator.js";
import {googleCallback, login, register} from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";

const router = Router();

router.post("/register", validateRegisterUser, register);

router.post("/login", validateLoginUser, login);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", (req, res, next) => {
  console.log("Callback route reached");

  passport.authenticate(
    "google",
    { session: false },
    (err, user, info) => {
      console.log("ERR:", err);
      console.log("USER:", user);
      console.log("INFO:", info);

      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      if (!user) {
        return res.status(401).json({
          message: "User not found",
          info,
        });
      }

      req.user = user;
      next();
    }
  )(req, res, next);
}, googleCallback);

export default router;