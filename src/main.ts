import App from "./view/App.svelte";
import "beercss";
import "material-dynamic-colors";
import "material-icons/iconfont/material-icons.css";
import "./view/style/main.scss";

declare global {
  interface Window {
    sendNotification: any;
  }
}

const app = new App({
  target: document.getElementById("app"),
});

export default app;
