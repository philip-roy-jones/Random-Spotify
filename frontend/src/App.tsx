import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import HomePage from "./pages/HomePage.tsx";
import AuthProvider from "./components/AuthProvider.tsx";

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path={"/"} element={<HomePage/>}/>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
