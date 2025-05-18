// ProductList.js
import React, { useEffect, useState } from "react"; // Import core React features
import axios from "axios"; // For making HTTP requests
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@mui/material"; // Importing MUI components for UI design

const ProductList = () => {
  // State to hold all products fetched from API
  const [allProducts, setAllProducts] = useState([]);
  // State for currently displayed products (after filtering/pagination)
  const [displayedProducts, setDisplayedProducts] = useState([]);
  // State for search input value
  const [search, setSearch] = useState("");
  // State for product categories
  const [categories, setCategories] = useState([]);
  // State for currently selected category
  const [selectedCategory, setSelectedCategory] = useState("");
  // State for current page number (used in infinite scroll)
  const [page, setPage] = useState(1);
  // Loading state to control spinner visibility
  const [loading, setLoading] = useState(true);
  // Limit of products to display per scroll/page
  const limit = 10;

  // Fetch product and category data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Show loader
      const productRes = await axios.get("https://dummyjson.com/products");
      const categoryRes = await axios.get("https://dummyjson.com/products/categories");

      // Store full product list
      setAllProducts(productRes.data.products);
      // Show only first set (pagination start)
      setDisplayedProducts(productRes.data.products.slice(0, limit));
      // Store categories
      setCategories(categoryRes.data);
      setLoading(false); // Hide loader
    };
    fetchData();
  }, []);

  // Run filtering logic when search or category changes
  useEffect(() => {
    const timer = setTimeout(() => {
      // Filter products based on search input
      const filtered = allProducts
        .filter((item) =>
          item.title.toLowerCase().includes(search.toLowerCase())
        )
        // Filter based on selected category (if selected)
        .filter((item) =>
          selectedCategory ? item.category === selectedCategory : true
        );
      // Display first page of filtered products
      setDisplayedProducts(filtered.slice(0, limit));
      setPage(1); // Reset page to 1
    }, 500); // Debounce: 500ms delay after user stops typing

    return () => clearTimeout(timer); // Clear timeout on unmount or re-run
  }, [search, selectedCategory, allProducts]);

  // Add scroll event listener for infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      // If user scrolled near the bottom, load more items
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
  });

  // Load next batch of filtered products (infinite scroll logic)
  const loadMore = () => {
    const filtered = allProducts
      .filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((item) =>
        selectedCategory ? item.category === selectedCategory : true
      );

    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * limit;
    const more = filtered.slice(startIndex, startIndex + limit);

    // If there are more products to load, append them
    if (more.length) {
      setDisplayedProducts((prev) => [...prev, ...more]);
      setPage(nextPage); // Update page number
    }
  };

  return (
    <Box p={2}>
      {/* Search input and category filter */}
      <Box display="flex" gap={2} mb={2}>
        <InputBase
          placeholder="🔍 Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ border: "1px solid #ccc", borderRadius: "6px", px: 2, py: 1, width: "60%" }}
        />
        <FormControl>
          <Select
            value={selectedCategory}
            displayEmpty
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) =>
              typeof cat === "string" ? (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ) : (
                <MenuItem key={cat.slug} value={cat.slug}>{cat.name}</MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Box>

      {/* Show loading spinner or product grid */}
      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {displayedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={product.thumbnail}
                  alt={product.title}
                />
                <CardContent>
                  <Typography variant="h6">{product.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {product.category}
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    ₹ {product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProductList; // Exporting component
