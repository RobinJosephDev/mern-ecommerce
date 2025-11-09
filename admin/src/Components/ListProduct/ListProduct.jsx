import { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const fetchInfo = () => {
    fetch(`http://localhost:4000/all_products`)
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setFilteredProducts(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // 🔍 Filter logic
  useEffect(() => {
    let filtered = allProducts;

    if (categoryFilter !== "All") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (p) => p.new_price >= priceRange[0] && p.new_price <= priceRange[1]
    );

    setFilteredProducts(filtered);
  }, [allProducts, categoryFilter, searchTerm, priceRange]);

  const removeProduct = async (id) => {
    await fetch(`http://localhost:4000/delete_product`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    fetchInfo();
  };

  return (
    <div className="listproduct">
      <h1>All Products List</h1>

      {/* 🔹 Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>

        <label>
          Price Range:
          <input
            type="number"
            placeholder="Min"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
          />
        </label>
      </div>

      {/* Table */}
      <div className="listproduct-format-main">
        <p>Products</p> <p>Title</p> <p>Old Price</p> <p>New Price</p>
        <p>Category</p> <p>Remove</p>
      </div>

      <div className="listproduct-allproducts">
        <hr />
        {filteredProducts.map((e, index) => (
          <div key={index}>
            <div className="listproduct-format-main listproduct-format">
              <img className="listproduct-product-icon" src={e.image} alt="" />
              <p className="cartitems-product-title">{e.name}</p>
              <p>₹{e.old_price}</p>
              <p>₹{e.new_price}</p>
              <p>{e.category}</p>
              <img
                className="listproduct-remove-icon"
                onClick={() => removeProduct(e.id)}
                src={cross_icon}
                alt="Remove"
              />
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
