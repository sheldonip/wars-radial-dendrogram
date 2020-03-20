import React from "react";
import ReactDOM from "react-dom";

import "./reset.css";
import "./styles.css";
import Diagram from "./Diagram";

function App() {
  return (
    <Diagram />
  );
}

const rootElement = document.getElementById("diagram-container");
ReactDOM.render(<App />, rootElement);
