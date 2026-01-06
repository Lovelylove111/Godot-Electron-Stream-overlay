/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject, useEffect, useRef, useState } from "react";
import "../App.css";

const startingState: GlobalTTSState = {
  enabled: false,
};
function GlobalChatReader() {
  const [state, setState] = useState(startingState);
  const module: RefObject<gModule_mappings["GlobalTTS"] | null> = useRef(null);
  useEffect(() => {
    window.api.getModule("GlobalTTS").then((m) => {
      module.current = m;
    });
  });

  function handleOnEnableButton() {
    const nstate = structuredClone(state);
    nstate.enabled = !state.enabled;
    module.current?.sendState(nstate);
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
