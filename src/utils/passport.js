import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { AppDataSource } from "../config/database.js";
import { UserEntity } from "../entities/user.js";
import jwt from "jsonwebtoken";
const { JWT_SECRET } = process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3005/api/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        let user = await userRepository.findOne({
          where: { username: profile.emails[0].value },
        });

        if (!user) {
          user = userRepository.create({
            username: profile.emails[0].value,
            // googleId: profile.id,
            isVerified: true,
          });
          await userRepository.save(user);
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
          expiresIn: "1h",
        });
        done(null, { user, token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
