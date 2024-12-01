import "./App.css";
import { ConfigProvider } from "./configContext";
import MysteryGenerator from "./MysteryGenerator";

function App() {
  return (
    <ConfigProvider>
      <MysteryGenerator />
    </ConfigProvider>
  );
}

export default App;
