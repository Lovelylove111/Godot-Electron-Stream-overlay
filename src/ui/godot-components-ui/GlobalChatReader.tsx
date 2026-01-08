import { RefObject, useEffect, useRef, useState } from "react";
import "../App.css";

const startingState: GlobalTTSState = {
  enabled: false,
};
function GlobalChatReader() {
  const [state, setState] = useState(startingState);
  const module = window.api.getModule("GlobalTTS");

  function handleOnEnableButton() {
    const nstate = structuredClone(state);
    nstate.enabled = !state.enabled;
    module.sendState(nstate);
    setState(nstate);
  }

  return (
    <>
      <div className="godot-component-card">
        <p>test</p>
        <button onClick={handleOnEnableButton}>
          {state.enabled ? "Enabled" : "Disabled"}
        </button>
      </div>
    </>
  );
}

export default GlobalChatReader;
