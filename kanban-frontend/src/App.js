import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Boards from "./pages/Boards";
import BoardDetail from "./pages/BoardDetail";
import Signup from "./pages/Signup";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/boards/:id" element={<BoardDetail />} />  
         </Routes>
    </BrowserRouter>
  );
}

export default App;