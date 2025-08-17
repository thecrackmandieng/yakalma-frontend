const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// chemin vers dist Angular (attention au sous-dossier "browser" avec Angular 18 SSR/prerender)
app.use(express.static(path.join(__dirname, "dist/yakalma-frontend/browser")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/yakalma-frontend/browser/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Frontend running on port ${PORT}`);
});
