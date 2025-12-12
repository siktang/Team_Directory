import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MemberProfile from './pages/MemberProfile'
import PageNotFound from './pages/PageNotFound'

function App() {
    return(
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/members' element={<HomePage />}></Route>
          <Route path="/member/:id" element={<MemberProfile />} />
          <Route path="/page-not-found" element={<PageNotFound />}></Route>
          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>
      </BrowserRouter>
    )
}

export default App
