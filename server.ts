import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

// Serve static assets from the assets folder under /assets prefix
app.use("/assets", express.static(path.join(process.cwd(), "assets")));

// Serve all other static files directly from root (HTML, icons, config)
app.use(express.static(process.cwd()));

// Map clean URL paths to HTML files (e.g., /about to about.html)
app.get("/:page", (req, res, next) => {
  const page = req.params.page;
  // If requesting a file extension or an api route, skip this mapper
  if (page.includes(".") || page.startsWith("api/")) {
    return next();
  }
  const filePath = path.join(process.cwd(), `${page}.html`);
  res.sendFile(filePath, (err) => {
    if (err) {
      next();
    }
  });
});

// Fallback to 404 page for any unhandled routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(process.cwd(), "404.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Server] Premium Digital Agency server running at http://0.0.0.0:${PORT}`);
});
