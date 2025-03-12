import { AppDataSource } from "../config/database.js";
import { UserEntity } from "../entities/user.js";
import { TokenEntity } from "../entities/token.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js";
const { JWT_SECRET } = process.env;
import { validationResult } from "express-validator";
import passport from "../utils/passport.js";

class UserRepository {
  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
    this.tokenRepository = AppDataSource.getRepository(TokenEntity);
  }

  validateLoginData(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return {
        status: false,
        message: "Validation failed",
        errors: errors.array(),
      };
    }
    return null;
  }

  async create(req, res) {
    const { username, password, roleId } = req.body;
    const findData = await this.repository.findOne({
      where: { username: username },
    });

    if (findData) {
      return res.status(409).json({
        status: false,
        message: "Data user already exist!",
        data: null,
      });
    }

    if (password.length < 8) {
      return {
        status: false,
        message: "Password must be 8 or more characters",
        data: null,
      };
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = this.repository.create({
      username,
      password: hashPassword,
      roleId,
    });
    await this.repository.save(user);

    console.log(user);

    // Generate a verification token
    const verificationToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Save the token in the TokenEntity
    const token = this.tokenRepository.create({
      userId: user.id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    });
    await this.tokenRepository.save(token);

    // Send the verification email
    const emailData = {
      from: process.env.EMAIL,
      to: user.username,
      subject: "Verify Your Email",
      text: `Please click the following link to verify your email: http://yourdomain.com/verify-email?token=${verificationToken}`,
      html: `<p>Please click the following link to verify your email: <a href="http://yourdomain.com/verify-email?token=${verificationToken}">Verify Email</a></p>`,
    };

    try {
      await sendEmail(emailData);
      return res.status(201).json({
        status: true,
        message:
          "User registered successfully. Please check your email to verify your account.",
        data: user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: `Failed to send verification email. ${error}`,
        data: null,
      });
    }
  }

  async activateUser(req, res) {
    const { token } = req.params;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      const user = await this.repository.findOne({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found.",
        });
      }

      if (user.isVerified) {
        return res.status(409).json({
          status: false,
          message: "User is already activated.",
        });
      }

      user.isVerified = true;
      const updateData = await this.repository.save(user);

      await this.tokenRepository.update({ where: token }, { isExpired: true });

      return res.status(200).json({
        status: true,
        message: "User activated successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Invalid or expired token.",
      });
    }
  }

  async login(req, res) {
    const validationError = this.validateLoginData(req);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: false,
        message: "Username and password are required!",
        data: null,
      });
    }

    const user = await this.repository.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid username or password",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid username or password",
        data: null,
      });
    }

    // Generate JWT token and return user data
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({
      status: true,
      message: "Login successful",
      data: { user, token },
    });
  }

  async googleLogin(req, res, next) {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  }

  async googleCallback(req, res, next) {
    passport.authenticate("google", (err, user, info) => {
      console.log("Error:", err);
      console.log("User:", user);
      console.log("Info:", info);

      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Authentication failed",
          data: null,
        });
      }
      return res.status(200).json({
        status: true,
        message: "Login successful",
        data: { user: user.user, token: user.token },
      });
    })(req, res, next);
  }

  async findAll(req, res) {
    // Mengambil parameter page dan pageSize dari query
    let page = parseInt(req.query.page, 10) || 1;
    let pageSize = parseInt(req.query.pageSize, 10) || 10;

    // Validasi nilai page dan pageSize
    if (page < 1) page = 1;
    if (pageSize < 1) pageSize = 10;

    // Menghitung offset
    const offset = (page - 1) * pageSize;

    // Menggunakan createQueryBuilder untuk paginasi
    const [data, totalCount] = await this.repository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.comments", "comments")
      .leftJoinAndSelect("user.posts", "posts")
      .leftJoinAndSelect("user.role", "role")
      .skip(offset)
      .take(pageSize)
      .getManyAndCount();

    // Mengembalikan respons JSON dengan data paginasi
    return res.status(200).json({
      status: true,
      message: "Get data successfully!",
      data: {
        items: data,
        totalCount,
        currentPage: page,
        pageSize,
      },
    });
  }

  async findById(req, res) {
    const { id } = req.params;

    const findData = await this.repository.findOne({ where: { id } });

    if (!findData) {
      return res.status(404).json({
        status: false,
        message: "Data not found!",
      });
    }

    return this.repository.findOne({ where: { id } });
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { username, roleId } = req.body;

      const findData = await this.repository.findOne({ where: { id } });

      if (!findData) {
        return res.status(404).json({
          status: false,
          message: "Data not found!",
        });
      }

      const updateData = await this.repository.update(id, { username, roleId });

      return res.status(200).json({
        status: true,
        message: "Update data successfuly",
        data: updateData,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    const findData = await this.repository.findOne({ where: { id } });

    if (!findData) {
      return res.status(404).json({
        status: false,
        message: "Data not found!",
      });
    }

    const deleteData = await this.repository.delete(id);

    return res.status(200).json({
      status: true,
      message: "Delete data successfully",
      data: deleteData,
    });
  }
}

export default UserRepository;
