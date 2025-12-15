import { BrowserRouter, Routes, Route } from 'react-router';
import { Home } from './pages/Home.jsx';
import { CoinDetail } from './pages/CoinDetail.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/coin/:id' element={<CoinDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
