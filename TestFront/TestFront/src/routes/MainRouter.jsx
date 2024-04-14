import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import NavBarComponent from '../components/NavBarComponent/NavBarComponent'

const MainRouter = () => {
    
    return (
        <Router>
            <NavBarComponent />
            <Routes>
                {/* HOC -> High Order Components */}
                <Route path="/" element={<Home />} />
                <Route path="/comments/" element={<CommentIndex />} />
                <Route path="/comments/create" element={<CreateComment />} />
            </Routes>
        </Router>
    )
}

export default MainRouter