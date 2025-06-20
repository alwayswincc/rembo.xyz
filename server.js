const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3000;

const UPLOADS = path.join(__dirname, "../frontend/uploads");
if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/uploads", express.static(UPLOADS));

const bioFile = path.join(__dirname, "bios.json");
let bios = fs.existsSync(bioFile) ? JSON.parse(fs.readFileSync(bioFile)) : {};

app.get("/api/bio/:user", (req, res) => {
  const user = req.params.user.toLowerCase();
  res.json({ bio: bios[user] || "" });
});

app.post("/api/bio/:user", (req, res) => {
  const user = req.params.user.toLowerCase();
  bios[user] = req.body.bio;
  fs.writeFileSync(bioFile, JSON.stringify(bios, null, 2));
  res.json({ status: "saved" });
});

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  res.json({ url: "/uploads/" + req.file.filename });
});

app.get("/u/:user", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => console.log(`Rembo Bio Editor running at http://localhost:${PORT}`));
