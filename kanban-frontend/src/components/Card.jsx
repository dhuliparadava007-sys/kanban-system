export default function Card({ card }) {
  return (
    <div
      style={{
        background: "white",
        padding: "8px",
        marginBottom: "8px",
        borderRadius: "6px",
        border: "1px solid #ddd",
      }}
    >
      <strong>{card.title}</strong>
      <p style={{ fontSize: "12px" }}>{card.description}</p>
    </div>
  );
}