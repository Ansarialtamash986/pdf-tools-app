import express from "express";
import multer from "multer";
import fs from "fs";
import { PDFDocument } from "pdf-lib";

const app = express();
const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 3000;

// Merge PDF endpoint
app.post("/merge", upload.array("pdfs"), async (req, res) => {
  try {
    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfFile = await mergedPdf.save();
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(mergedPdfFile));
  } catch (err) {
    res.status(500).send("Error merging PDFs");
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("PDF Tools API is running 🚀");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
