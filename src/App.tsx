import { Globe } from "./components/Globe";

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
