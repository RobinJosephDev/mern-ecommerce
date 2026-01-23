import { useEffect, useState } from "react";
import "./css/ShopCategory.css";
import Item from "../Components/Item/Item";
import { Link } from "react-router-dom";

const ShopCategory = (props) => {
  const [allproducts, setAllProducts] = useState([]);
  const [sortMethod, setSortMethod] = useState("price-asc"); // default sort by price (ascending)

  const fetchInfo = () => {
    fetch("http://localhost:4000/all_products")
      .then((res) => res.json())
      .then((data) => setAllProducts(data));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // Sorting logic
  const sortedProducts = allproducts
    .filter((item) => item.category === props.category) // Filter by category
    .sort((a, b) => {
      if (sortMethod === "price-asc") {
        return a.new_price - b.new_price; // Sort by price (ascending)
      } else if (sortMethod === "price-desc") {
        return b.new_price - a.new_price; // Sort by price (descending)
      } else if (sortMethod === "name-asc") {
        return a.name.localeCompare(b.name); // Sort by name (ascending)
      } else if (sortMethod === "name-desc") {
        return b.name.localeCompare(a.name); // Sort by name (descending)
      }
      return 0; // Default (no sorting)
    });

  const handleSortChange = (e) => {
    setSortMethod(e.target.value); // Update the sort method
  };

  return (
    <div className="shopcategory">
      <img src={props.banner} className="shopcategory-banner" alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1 - 12</span> out of 54 Products
        </p>

        <select
          className="shopcategory-sort-dropdown"
          value={sortMethod}
          onChange={handleSortChange}
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>
      <div className="shopcategory-products">
        {sortedProducts.map((item, i) => {
          return (
            <Item
              id={item.id}
              key={i}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
      <div className="shopcategory-loadmore">
        <Link to="/" style={{ textDecoration: "none" }}>
          Explore More
        </Link>
      </div>
    </div>
  );
};

export default ShopCategory;
