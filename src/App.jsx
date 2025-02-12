import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import Homepage from './pages/Homepage';
import DetailPage from './pages/DetailPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap the homepage inside Layout */}
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Homepage />} />
          <Route path="properties/:slug" element={<DetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;