const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// chemin vers dist Angular
app.use(express.static(path.join(__dirname, "dist/yakalma-frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/yakalma-frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Frontend running on port ${PORT}`);
});
