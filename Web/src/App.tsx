import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { HomePage } from "./pages/HomePage";
import { RecommendedCarsPage } from "./pages/RecommendedCarsPage";
import { ShortlistPage } from "./pages/ShortlistPage";
import { ShortlistProvider } from "./context/ShortlistProvider";
import { RecommendationProvider } from "./context/RecommendationProvider";

function App() {
  return (
    <BrowserRouter>
      <ShortlistProvider>
        <RecommendationProvider>
          <NavBar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recommended" element={<RecommendedCarsPage />} />
              <Route path="/shortlist" element={<ShortlistPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </RecommendationProvider>
      </ShortlistProvider>
    </BrowserRouter>
  );
}

export default App;
