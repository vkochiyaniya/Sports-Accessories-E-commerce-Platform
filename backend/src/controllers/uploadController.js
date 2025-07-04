const cloudinary = require("../config/cloudinary");
const { Pool } = require("pg");
const streamifier = require("streamifier"); // ✅ Import for buffer streaming

// ✅ PostgreSQL Connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "sportx",
  password: "123456789",
  port: 5432,
});

// ✅ Upload Image to Cloudinary & Update PostgreSQL
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ Stream the image buffer to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "product_images" },
      async (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Error:", error);
          return res.status(500).json({ error: "Failed to upload image" });
        }

        // ✅ Extract product ID
        const { productId } = req.body;
        if (!productId) {
          return res.status(400).json({ error: "Product ID is required" });
        }

        const imageUrl = result.secure_url;

        // ✅ Update PostgreSQL `Products` Table
        const updateImageQuery = `
          UPDATE "Products"
          SET "image" = $1
          WHERE "id" = $2
          RETURNING *;
        `;

        const { rows } = await pool.query(updateImageQuery, [imageUrl, productId]);

        if (rows.length === 0) {
          return res.status(404).json({ error: "Product not found" });
        }

        return res.status(200).json({
          message: "✅ Product image uploaded successfully",
          product: rows[0],
        });
      }
    );

    // ✅ Pipe the image buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ error: "Server error during upload" });
  }
};
