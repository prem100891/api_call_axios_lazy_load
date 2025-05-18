// ProductList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
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
} from "@mui/material";

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const productRes = await axios.get("https://dummyjson.com/products");
      const categoryRes = await axios.get("https://dummyjson.com/products/categories");
      setAllProducts(productRes.data.products);
      setDisplayedProducts(productRes.data.products.slice(0, limit));
      setCategories(categoryRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = allProducts
        .filter((item) =>
          item.title.toLowerCase().includes(search.toLowerCase())
        )
        .filter((item) =>
          selectedCategory ? item.category === selectedCategory : true
        );
      setDisplayedProducts(filtered.slice(0, limit));
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, allProducts]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

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
    if (more.length) {
      setDisplayedProducts((prev) => [...prev, ...more]);
      setPage(nextPage);
    }
  };

  return (
    <Box p={2}>
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

export default ProductList;
