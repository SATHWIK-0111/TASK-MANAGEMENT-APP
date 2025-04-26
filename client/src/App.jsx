import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom';

import Login from './components/login'
import Register from './components/register'
import Tasklist from './components/tasklist'
import Landing from './components/landing'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/tasklist" element={<Tasklist/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
