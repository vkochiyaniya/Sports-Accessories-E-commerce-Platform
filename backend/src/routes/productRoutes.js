const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { Product } = require("../models"); // ✅ Add this line

// ✅ Product CRUD routes (Admin protected)
router.post("/createproduct", upload.single("image"), require("../controllers/productController").createProduct);
router.put("/:id", upload.single("image"), require("../controllers/productController").updateProduct);
router.delete("/:id", require("../controllers/productController").deleteProduct);

// ✅ Public product routes
router.get("/fetch", require("../controllers/productController").getProducts);
router.get("/getdetail/:id", require("../controllers/productController").getProductById);

// ✅ Add review to product
router.post('/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { review, rating } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Initialize reviews array if undefined
    if (!product.reviews) {
      product.reviews = [];
    }

    product.reviews.push(review);

    const currentTotal = product.rating * product.reviews.length;
    const newRating = (currentTotal + parseFloat(rating)) / (product.reviews.length + 1);
    product.rating = newRating.toFixed(1);

    await product.save();

    res.json({ message: "Review added", product });
  } catch (error) {
    console.error("Review Error:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

module.exports = router;
