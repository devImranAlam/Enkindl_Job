import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/routes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Navbar />
        <div className="p-4">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;