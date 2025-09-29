import "./Admin.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import AddProduct from "../../Components/AddProduct/AddProduct";
import { Route, Routes } from "react-router-dom";
import ListProduct from "../../Components/ListProduct/ListProduct";

const Admin = () => {

  return (
    <div className="admin">
      <Sidebar />
      <Routes>
        <Route path="/add_product" element={<AddProduct />} />
        <Route path="/all_products" element={<ListProduct />} />
      </Routes>
    </div>
  );
};

export default Admin;
