import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function ProductForm({
  reload,
  lang,
  text,
  editingProduct,
  setEditingProduct,
}) {
  const t = text[lang]; // ดึงคำแปลมาใช้
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price);
      setCategory(editingProduct.category);
      setStock(editingProduct.stock);
      setImage(editingProduct.image);
    }
  }, [editingProduct]);

  function resetForm() {
    setName("");
    setPrice("");
    setCategory("");
    setStock("");
    setImage("");
    setEditingProduct(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !price) return;

    setIsLoading(true);
    const productData = {
      name,
      price: parseFloat(price),
      category: category || "-",
      stock: parseInt(stock) || 0,
      image,
    };

    if (editingProduct) {
      await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);
    } else {
      await supabase.from("products").insert([productData]);
    }

    resetForm();
    reload();
    setIsLoading(false);
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="input-group">
          <label>
            {t.form_name} <span className="req">*</span>
          </label>
          <input
            required
            placeholder="e.g.Notebook"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>
            {t.form_price} <span className="req">*</span>
          </label>
          <input
            required
            type="number"
            min="0"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>{t.form_cat}</label>
          <input
            placeholder="e.g.Electronics"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>{t.form_stock}</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <div className="input-group full-width">
          <label>{t.form_img}</label>
          <input
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions">
        {editingProduct && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetForm}
          >
            {t.form_cancel}
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "..." : editingProduct ? t.form_update : t.form_add}
        </button>
      </div>
    </form>
  );
}
