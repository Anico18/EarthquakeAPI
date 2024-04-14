import Home from './pages/Home';
import CreateComment from './pages/CreateComment';
import CommentIndex from './pages/CommentIndex';
import Err404 from './pages/Err404.jsx';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>} />
        <Route path="/Home" element={<Home/>} />
        <Route path="/Comments" element={<CommentIndex/>} />
        <Route path="/Comments/Create/:id" element={<CreateComment/>} />
        <Route path="*" element={<Err404/>} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
