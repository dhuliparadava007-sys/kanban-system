import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await api.get("/boards");
      setBoards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createBoard = async () => {
    if (!newBoardName.trim()) return;

    try {
      const res = await api.post("/boards", { name: newBoardName });
      setBoards([...boards, res.data]);
      setNewBoardName("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBoard = async (id) => {
    try {
      await api.delete(`/boards/${id}`);
      setBoards(boards.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const colors = ["#0079bf", "#519839", "#d29034", "#b04632", "#89609e"];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/*  Navbar */}
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

        
      </div>

      {/* 📋 Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>

        {/* Show button only when boards exist */}
        {boards.length > 0 && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              marginTop: "10px",
              padding: "10px 15px",
              background: "#0079bf",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            + Create Board
          </button>
        )}

        {/*  Conditional UI */}
        {boards.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
              textAlign: "center",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No boards"
              style={{ width: "150px", opacity: 0.7 }}
            />

            <h3 style={{ marginTop: "15px" }}>No boards yet</h3>
            <p>Create your first board to get started</p>

            <button
              onClick={() => setShowModal(true)}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                background: "#0079bf",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              + Create Board
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {boards.map((board, index) => (
              <div
                key={board.id}
                onClick={() => navigate(`/boards/${board.id}`)}
                style={{
                  width: "180px",
                  height: "100px",
                  background: colors[index % colors.length],
                  color: "white",
                  borderRadius: "8px",
                  padding: "15px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                }}
              >
                <span>{board.name}</span>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!window.confirm("Delete this board?")) return;
                    deleteBoard(board.id);
                  }}
                  style={{
                    alignSelf: "flex-end",
                    background: "red",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#f4f5f7",
          padding: "10px",
          textAlign: "center",
        }}
      >
        © 2026 Kanban App
      </div>

      {/*  Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
            }}
          >
            <h3>Create Board</h3>

            <input
              type="text"
              placeholder="Board name"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "10px",
              }}
            />

            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
              <button
                onClick={createBoard}
                style={{
                  flex: 1,
                  padding: "8px",
                  background: "#0079bf",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Create
              </button>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "8px",
                  background: "gray",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}