import jwt from "jsonwebtoken";
const { JWT_SECRET } = process.env;

export default {
  mustLogin: (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          status: false,
          message:
            "Anda tidak memiliki otorisasi, silahkan login terlebih dahulu",
          data: null,
        });
      }

      const token = authHeader.split("Bearer ")[1];

      if (!token) {
        return res.status(401).json({
          status: false,
          message:
            "Anda tidak memiliki otorisasi, silahkan login terlebih dahulu",
          data: null,
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      next();
    } catch (err) {
      if (err.message == "Jwt malformed") {
        return res.status(401).json({
          status: false,
          message: err.message,
          data: null,
        });
      }

      next(err);
    }
  },

  mustAdmin: (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          status: false,
          message:
            "Anda tidak memiliki otorisasi, silahkan login terlebih dahulu",
          data: null,
        });
      }

      const token = authHeader.split("Bearer ")[1];
      if (!token) {
        return res.status(401).json({
          status: false,
          message:
            "Anda tidak memiliki otorisasi, silahkan login terlebih dahulu",
          data: null,
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      if (decoded.role !== 1 && decoded.role !== 2) {
        return res.status(403).json({
          status: false,
          message:
            "Anda tidak memiliki otorisasi, hanya admin yang dapat mengakses",
          data: null,
        });
      }
      next();
    } catch (err) {
      if (err.message == "Jwt malformed") {
        return res.status(401).json({
          status: false,
          message: err.message,
          data: null,
        });
      }
      next(err);
    }
  },
};
