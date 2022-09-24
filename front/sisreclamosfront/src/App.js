import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Auth from './Auth/Auth';
import Personal from './Personal/Personal';
import Cliente from './Cliente/Cliente';
import DocumentosCliente from './Cliente/DocumentosCliente';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/cliente" element={<Cliente />} />
        <Route path="/personal" element={<Personal />} />
        <Route path="/documentosCliente" element={<DocumentosCliente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;