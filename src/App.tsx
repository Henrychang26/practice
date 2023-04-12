import { Route, Routes } from "react-router";
import Layout from "./pages/Layout";
import Swap from "./pages/Swap";
import Pool from "./pages/Pool";
import "./App.css";

const App: React.FC = (): JSX.Element => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="pool" element={<Pool />} />
          <Route path="*" element={<Swap />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
