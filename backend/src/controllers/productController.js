  const db = require("../models");
  const Product = db.Product;
  const cloudinary = require("../config/cloudinary");
  const { promisify } = require("util");

  // Fetch all products
  exports.getProducts = async (req, res) => {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      res.status(500).json({ error: "Server Error", details: error.message });
    }
  };

  // Fetch single product by ID
  exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });

      res.json(product);
    } catch (error) {
      console.error("❌ Error fetching product:", error);
      res.status(500).json({ error: "Server Error", details: error.message });
    }
  };

  // Create a new product with image upload
  exports.createProduct = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image file is required." });
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        async (error, result) => {
          if (error) {
            console.error("❌ Cloudinary Upload Error:", error);
            return res.status(500).json({ error: "Cloudinary Upload Error", details: error.message });
          }

          if (!result || !result.secure_url) {
            return res.status(500).json({ error: "Cloudinary failed to provide an image URL." });
          }

          const { name, description, category, brand, color, size, material, price, rating, reviews } = req.body;
          if (!name || !price) {
            return res.status(400).json({ error: "Name and price are required" });
          }

          const product = await Product.create({
            name,
            description,
            category,
            brand,
            color,
            size,
            material,
            price,
            image: result.secure_url,
          });
          res.status(201).json(product);
        }
      );

      uploadStream.end(req.file.buffer);
    } catch (error) {
      console.error("❌ Error creating product:", error);
      res.status(500).json({ error: "Server Error", details: error.message });
    }
  };

  // Update a product - FIXED implementation
  exports.updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const protectedFields = ["id", "productId", "rating", "reviews"];
      const updateData = {};

      // Process non-file data first
      for (const key in req.body) {
        if (!protectedFields.includes(key)) {
          updateData[key] = key === "price" ? parseFloat(req.body[key]) : req.body[key];
        }
      }

      // Handle file upload if present
      if (req.file) {
        try {
          // Convert the cloudinary upload to a promise
          const uploadPromise = promisify((buffer, options, callback) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              options,
              (error, result) => callback(error, result)
            );
            uploadStream.end(buffer);
          });

          // Upload the image
          const result = await uploadPromise(req.file.buffer, { resource_type: "image" });
          
          if (result && result.secure_url) {
            updateData.image = result.secure_url;
          }
        } catch (uploadError) {
          console.error("❌ Cloudinary upload error:", uploadError);
          return res.status(500).json({ error: "Image upload failed", details: uploadError.message });
        }
      }

      // Apply the updates to the product
      await product.update(updateData);
      
      // Return the updated product
      const updatedProduct = await Product.findByPk(id);
      res.status(200).json({ message: "✅ Product updated successfully", product: updatedProduct });
    } catch (error) {
      console.error("❌ Update product error:", error);
      res.status(500).json({ message: "Internal server error", details: error.message });
    }
  };

  // Delete a product
  exports.deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
        
      await product.destroy();
      res.status(200).json({ message: "✅ Product deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      res.status(500).json({ error: "Server Error", details: error.message });
    }
  };