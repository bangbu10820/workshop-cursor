import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HandsOnPage from "./pages/hands-on";
import DemoPage from "./pages/demo";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <ul className="flex space-x-7 py-4">
                <li>
                  <Link to="/" className="text-gray-700 hover:text-blue-600">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link
                    to="/hands-on"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Hands On
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto mt-6 px-4">
          <Routes>
            <Route path="/" element={<DemoPage />} />
            <Route path="/hands-on" element={<HandsOnPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
