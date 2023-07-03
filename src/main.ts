import App from "./view/App.svelte";

import "beercss";
import "material-dynamic-colors";
import "@fontsource/noto-sans-jp";

import "./view/style/main.scss";

const app = new App({
  target: document.getElementById("app"),
});

document.addEventListener("contextmenu", (event) =>
  !(
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement
  )
    ? event.preventDefault()
    : ""
);

export default app;
