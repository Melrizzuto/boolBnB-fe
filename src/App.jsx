import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import Homepage from './pages/Homepage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap the homepage inside Layout */}
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Homepage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;