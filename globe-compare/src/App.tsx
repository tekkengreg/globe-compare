import { Globe } from "./components/Globe";
import background from "./assets/gregorypetit_dark_blue_background_e846c7b6-f13e-4fac-829a-f88bd730277f.png";

function App() {
  return (
    <div
      style={{
        // background: `url(${background})`,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <nav>
        <p>Globe Compare</p>
      </nav>
      <Globe />
    </div>
  );
}

export default App;
