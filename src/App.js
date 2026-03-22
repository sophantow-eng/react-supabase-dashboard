import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./styles.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [lang, setLang] = useState("en"); // ตั้งค่าเริ่มต้นเป็นภาษาอังกฤษตามภาพ
  const [activeTab, setActiveTab] = useState("products"); // ให้เปิดหน้า Products เป็นหน้าแรก
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const text = {
    th: {
      app_name: "ระบบจัดการร้านค้า",
      menu_dashboard: "📊 ภาพรวม",
      menu_products: "📦 สินค้า",
      menu_reports: "📈 รายงาน",
      products_total: "สินค้าทั้งหมด",
      value_total: "มูลค่าคลังสินค้า",
      items: "รายการ",
      search: "ค้นหาชื่อสินค้า...",
      add_product: "เพิ่มสินค้าใหม่",
      table_img: "รูปภาพ",
      table_name: "ชื่อสินค้า",
      table_cat: "หมวดหมู่",
      table_price: "ราคา",
      table_stock: "คงเหลือ",
      table_action: "จัดการ",
      form_name: "ชื่อสินค้า",
      form_price: "ราคา (฿)",
      form_cat: "หมวดหมู่",
      form_stock: "จำนวน",
      form_img: "ลิงก์รูปภาพ",
      form_add: "+ เพิ่มสินค้า",
      form_update: "บันทึกการแก้ไข",
      form_cancel: "ยกเลิก",
      chart_title: "กราฟแสดงจำนวนสินค้าคงเหลือ",
    },
    en: {
      app_name: "Store Manager",
      menu_dashboard: "📊 Dashboard",
      menu_products: "📦 Products",
      menu_reports: "📈 Sales Report",
      products_total: "Total Products",
      value_total: "Total Value",
      items: "items",
      search: "Search products...",
      add_product: "Add New Product",
      table_img: "Image",
      table_name: "Product Name",
      table_cat: "Category",
      table_price: "Price",
      table_stock: "Stock",
      table_action: "Action",
      form_name: "Product Name",
      form_price: "Price (฿)",
      form_cat: "Category",
      form_stock: "Stock",
      form_img: "Image URL",
      form_add: "+ Add Product",
      form_update: "Save Changes",
      form_cancel: "Cancel",
      chart_title: "Inventory Stock Level",
    },
  };

  const t = text[lang];

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });
    if (data) setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>🛍️ {t.app_name}</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            {t.menu_dashboard}
          </button>
          <button
            className={`nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            {t.menu_products}
          </button>
          <button
            className={`nav-item ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            {t.menu_reports}
          </button>
        </nav>

        <div className="sidebar-footer">
          <p className="lang-label">Language / ภาษา</p>
          <div className="lang-switch-container">
            <button
              className={`lang-btn ${lang === "th" ? "active" : ""}`}
              onClick={() => setLang("th")}
            >
              TH
            </button>
            <button
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === "dashboard" && (
          <div className="fade-in">
            <h1 className="page-title">{t.menu_dashboard}</h1>
            <div className="summary-cards">
              <div className="card stat-card shadow-sm">
                <div className="stat-icon bg-blue">📦</div>
                <div>
                  <h3>{t.products_total}</h3>
                  <p className="stat-value">
                    {totalProducts} <span className="stat-unit">{t.items}</span>
                  </p>
                </div>
              </div>
              <div className="card stat-card shadow-sm">
                <div className="stat-icon bg-green">💰</div>
                <div>
                  <h3>{t.value_total}</h3>
                  <p className="stat-value text-green">
                    {totalValue.toLocaleString()}{" "}
                    <span className="stat-unit">฿</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="card shadow-sm chart-container">
              <h3 className="chart-title">{t.chart_title}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={products}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b" }}
                  />
                  <Tooltip cursor={{ fill: "#f8fafc" }} borderRadius={8} />
                  <Bar dataKey="stock" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="fade-in">
            <h1 className="page-title">{t.menu_products}</h1>

            <div className="card shadow-sm form-card">
              <ProductForm
                reload={loadProducts}
                lang={lang}
                text={text}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
              />
            </div>

            <div className="card shadow-sm table-card">
              <div className="table-toolbar">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    className="search-input"
                    placeholder={t.search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <ProductTable
                products={filtered}
                reload={loadProducts}
                setEditing={setEditingProduct}
                lang={lang}
                text={text}
              />
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="fade-in empty-state card shadow-sm">
            <h2>🚧 {t.menu_reports}</h2>
            <p className="text-muted">กำลังพัฒนาระบบนี้...</p>
          </div>
        )}
      </main>
    </div>
  );
}
