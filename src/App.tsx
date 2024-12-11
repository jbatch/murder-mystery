import "./App.css";
import { ConfigProvider } from "./configContext";
import MysteryGenerator from "./MysteryGenerator";
import MysteryPlannerPage from "./MysteryPlannerPage";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <div className="container mx-auto">
          <nav className="flex gap-4 p-4 border-b">
            <Link to="/">
              <Button variant="ghost">Generator</Button>
            </Link>
            <Link to="/planner">
              <Button variant="ghost">Planner</Button>
            </Link>
          </nav>

          <Routes>
            <Route path="/" element={<MysteryGenerator />} />
            <Route path="/planner" element={<MysteryPlannerPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
