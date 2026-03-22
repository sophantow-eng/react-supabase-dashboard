import { supabase } from "../supabase";

export default function ProductTable({
  products,
  reload,
  setEditing,
  lang,
  text,
}) {
  const t = text[lang];

  async function deleteProduct(id) {
    if (
      !window.confirm(
        lang === "th"
          ? "คุณแน่ใจหรือไม่ว่าต้องการลบ?"
          : "Are you sure you want to delete?"
      )
    )
      return;
    await supabase.from("products").delete().eq("id", id);
    reload();
  }

  if (products.length === 0)
    return (
      <div className="empty-state">
        <p>No data available / ไม่มีข้อมูล</p>
      </div>
    );

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th width="70">{t.table_img}</th>
            <th>{t.table_name}</th>
            <th>{t.table_cat}</th>
            <th className="text-right">{t.table_price}</th>
            <th className="text-center">{t.table_stock}</th>
            <th className="text-center" width="120">
              {t.table_action}
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img
                  className="product-img"
                  src={p.image || "https://placehold.co/100x100?text=IMG"}
                  alt={p.name}
                />
              </td>
              <td className="font-medium text-dark">{p.name}</td>
              <td>
                <span className="badge">{p.category}</span>
              </td>
              <td className="text-right font-medium text-primary">
                {p.price.toLocaleString()} ฿
              </td>
              <td className="text-center">
                <span
                  className={`stock-badge ${
                    p.stock > 0 ? "in-stock" : "out-stock"
                  }`}
                >
                  {p.stock}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-icon edit"
                    onClick={() => setEditing(p)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => deleteProduct(p.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
