const express = require("express");
const fs = require("fs");
const ImageKit = require("imagekit");
const upload = require("./utils/multerConfig"); // Mengimpor konfigurasi Multer

const app = express();

// Konfigurasi ImageKit
const imagekit = new ImageKit({
  publicKey: "your_public_api_key",
  privateKey: "your_private_api_key",
  urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/",
});

// Rute untuk mengunggah file
app.post("/upload", upload.single("myImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Tidak ada file yang diunggah.");
  }

  // Path file yang diunggah
  const filePath = req.file.path;

  // Unggah file ke ImageKit
  imagekit.upload(
    {
      file: fs.readFileSync(filePath), // File yang akan diunggah
      fileName: req.file.filename, // Nama file
      useUniqueFileName: false, // Gunakan nama file yang sudah ditentukan
    },
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Gagal mengunggah file ke ImageKit.");
      }

      // Hapus file dari direktori lokal setelah berhasil diunggah ke ImageKit
      fs.unlinkSync(filePath);

      // Kirim respons dengan URL gambar yang diunggah
      res.send({
        message: "File berhasil diunggah.",
        url: result.url,
      });
    }
  );
});

// Penanganan kesalahan
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(400).send(err.message);
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
