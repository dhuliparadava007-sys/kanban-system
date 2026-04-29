import Card from "./Card";
import { useState } from "react";

export default function List({ list, onAddCard, onAddList }) {
  const [newCard, setNewCard] = useState("");

  return (
    <div
      style={{
        width: "250px",
        background: "#f4f4f4",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <h3>{list.name}</h3>

      {/* CARDS */}
      {list.cards &&
        list.cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}

      {/* ADD CARD */}
      <input
        placeholder="Add card..."
        value={newCard}
        onChange={(e) => setNewCard(e.target.value)}
      />

      <button
        onClick={() => {
          onAddCard(list.id, newCard);
          setNewCard("");
        }}
      >
        Add Card
      </button>
    </div>
  );
}