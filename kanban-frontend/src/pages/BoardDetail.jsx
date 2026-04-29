import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

export default function BoardDetail() {
  const { id } = useParams();

  const [lists, setLists] = useState([]);
  const [newCard, setNewCard] = useState({});
  const [newList, setNewList] = useState("");

  const [editingCard, setEditingCard] = useState(null);
  const [editText, setEditText] = useState("");

  // FETCH LISTS
  const fetchData = async () => {
    try {
      const res = await api.get(`/lists/${id}`);
      setLists(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // ADD LIST
  const handleAddList = async () => {
    if (!newList.trim()) return;

    await api.post(`/lists/${id}`, {
      name: newList,
    });

    setNewList("");
    fetchData();
  };

  // ADD CARD
  const handleAddCard = async (listId) => {
    const title = newCard[listId];
    if (!title?.trim()) return;

    await api.post(`/cards/list/${listId}`, {
      title,
      description: "",
    });

    setNewCard((prev) => ({ ...prev, [listId]: "" }));
    fetchData();
  };

  // DELETE CARD
  const handleDeleteCard = async (cardId) => {
    try {
      await api.delete(`/cards/${cardId}`);
      fetchData();
    } catch (err) {
      console.log(err.message);
    }
  };

  // OPEN EDIT
  const openEdit = (card) => {
    setEditingCard(card);
    setEditText(card.title);
  };

  // SAVE EDIT
  const saveEdit = async () => {
    if (!editText.trim()) return;

    await api.put(`/cards/${editingCard.id}`, {
      title: editText,
      description: editingCard.description || "",
    });

    setEditingCard(null);
    setEditText("");
    fetchData();
  };

  // DRAG
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const newLists = JSON.parse(JSON.stringify(lists));

    const source = newLists.find(
      (l) => l.id.toString() === result.source.droppableId
    );

    const dest = newLists.find(
      (l) => l.id.toString() === result.destination.droppableId
    );

    const [moved] = source.cards.splice(result.source.index, 1);
    dest.cards.splice(result.destination.index, 0, moved);

    setLists(newLists);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* NAVBAR */}
      <div
        style={{
          background: "#172b4d",
          color: "white",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h3>Kanban App</h3>
        <div>👤 Profile</div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "25px", background: "#f4f5f7" }}>

        {/* ADD LIST */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            value={newList}
            onChange={(e) => setNewList(e.target.value)}
            placeholder="Add new list..."
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={handleAddList}
            style={{
              background: "#0079bf",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            + Add List
          </button>
        </div>

        {/* LISTS */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {lists.map((list) => (
              <Droppable key={list.id} droppableId={list.id.toString()}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      width: "280px",
                      background: "#ebecf0",
                      padding: "10px",
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      maxHeight: "75vh",
                    }}
                  >
                    <h4 style={{ marginBottom: "10px" }}>{list.name}</h4>

                    {/* CARDS */}
                    <div style={{ flex: 1 }}>
                      {list.cards?.map((card, index) => (
                        <Draggable
                          key={card.id}
                          draggableId={card.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                background: "white",
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "8px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "90%",
                                minWidth: 0,
                                overflow: "hidden",
                                ...provided.draggableProps.style,
                              }}
                            >
                              <span
                                style={{
                                  flex: 1,
                                  minWidth: 0,
                                  fontSize: "15px",
                                  fontWeight: 500,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {card.title}
                              </span>

                              <div style={{ display: "flex", gap: "8px" }}>
                                <span onClick={() => openEdit(card)} style={{ cursor: "pointer" }}>
                                  ✏️
                                </span>

                                <span
                                  onClick={() => handleDeleteCard(card.id)}
                                  style={{ cursor: "pointer", color: "red" }}
                                >
                                  ✕
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>

                    {/* ADD CARD */}
                    <input
                      value={newCard[list.id] || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          [list.id]: e.target.value,
                        })
                      }
                      placeholder="Add card..."
                      style={{
                        width: "90%",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        marginTop: "8px",
                        fontSize: "13px",
                      }}
                    />

                    <button
                      onClick={() => handleAddCard(list.id)}
                      style={{
                        marginTop: "8px",
                        width: "100%",
                        background: "#5aac44",
                        color: "white",
                        border: "none",
                        padding: "8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      + Add Card
                    </button>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* EDIT MODAL */}
      {editingCard && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
            <h3>Edit Card</h3>

            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{ width: "250px", padding: "8px" }}
            />

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditingCard(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ background: "#f4f5f7", padding: "10px", textAlign: "center" }}>
        © 2026 Kanban App
      </div>
    </div>
  );
}