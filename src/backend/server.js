const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "dch_test_export",
});

// Load Inventory API
app.get("/load_Inventory", (req, res) => {
  const { location, search, brand, category, area } = req.query;

  let sql = "SELECT * FROM inventory_merge WHERE 1=1 AND isDelete=0";
  let params = [];

  if (location && location !== "All") {
    sql += " AND location = ?";
    params.push(location === "Warehouse" ? "AREA A" : location);
  }

  if (search) {
    sql += " AND (itemCode LIKE ? OR CONCAT(IFNULL(itemDesc_1, ''), IFNULL(itemDesc_2, '')) LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (brand) {
    sql += " AND brand = ?";
    params.push(brand);
  }

  if (category) {
    sql += " AND category = ?";
    params.push(category);
  }

  if (area) {
    sql += " AND storage_area = ?";
    params.push(area);
  }

  sql += " ORDER BY inventory_id DESC LIMIT 100";

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching inventory:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
