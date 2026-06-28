const dns = require("dns");
const path = require("path");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const articleRoutes = require("./routes/articles");
const adRoutes = require("./routes/ads");

const app = express();

app.use(cors());
app.use(express.json());

const clientBuildPath = path.join(__dirname, "..", "client", "build");
app.use(express.static(clientBuildPath));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/ads", adRoutes);

app.get("/", (req, res) => {
  return res.json({ message: "Welcome to the News API" });
});

app.get(/^(?!\/api).*/, (req, res, next) => {
  if (req.method !== "GET") return next();
  res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
    if (err) next();
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/newsdb")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
