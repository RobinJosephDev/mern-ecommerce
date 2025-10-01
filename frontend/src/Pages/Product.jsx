import { useContext, useEffect, useState } from "react";
import Breadcrumbs from "../Components/Breadcrumbs/Breadcrumbs";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import Description from "../Components/Description/Description";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";

// console.log("Breadcrumbs:", Breadcrumbs);
// console.log("ProductDisplay:", ProductDisplay);
// console.log("Description:", Description);

const Product = () => {
  const { products } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(false);

  useEffect(() => {
    setProduct(products.find((e) => e.id === Number(productId)));
  }, [products, productId]);

  return product ? (
    <div>
      <Breadcrumbs product={product} />
      <ProductDisplay product={product} />
      <Description />
    </div>
  ) : null;
};

export default Product;
