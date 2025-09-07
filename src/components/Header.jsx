import Switch from "./base/Switch";

function Header({ onChangeKey, screenMode, autoStop, setAutoStop, showWebcam, setShowWebcam }) {
  return (
    <header className="p-4 border-b bg-white/60 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          {screenMode === "to"
            ? "Text-Only Virtual Assistant (TOVA)"
            : "Voice-Only Virtual Assistant (VOVA)"}
        </h1>
        
        <Switch
          id="webcamToggle"
          checked={showWebcam}
          onChange={() => setShowWebcam(prev => !prev)}
          leftLabel="Off"
          rightLabel="Cam"
        />

        {screenMode === "vo" && (
        <Switch
          id="autoStopSwitch"
          checked={autoStop}
          onChange={() => setAutoStop((prev) => !prev)}
          leftLabel={"Normal"}
          rightLabel={"Auto"}
        />
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={onChangeKey}
            className="px-3 py-1 rounded-md border text-sm hover:bg-gray-100 cursor-pointer"
          >
            Open Dialog
          </button>
        </div>
      </div>
    </header>
  );
}


export default Header;
