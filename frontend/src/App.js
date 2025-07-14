import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import RedirectPage from './RedirectPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:shortCode" element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

