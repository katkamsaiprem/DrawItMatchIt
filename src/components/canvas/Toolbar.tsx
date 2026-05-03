type ToolbarProps = {
  lineSize: number;
  lineColor: string;
  mode: "draw" | "erase";
  onLineSizeChange: (value: number) => void;
  onLineColorChange: (value: string) => void;
  onToggleMode: () => void;
  onUndo: () => void;

  onClear: () => void;
  onDownload: () => void;

};

//color picker , brush size, eraser, undo
const Toolbar = ({
  lineSize,
  lineColor,
  mode,
  onLineSizeChange,
  onLineColorChange,
  onToggleMode,
  onUndo,

  onClear,
  onDownload,

}: ToolbarProps) => {


  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2">
        Size
        <input
          type="range"
          min="1"
          max="40"
          value={lineSize}
          onChange={(e) => onLineSizeChange(Number(e.target.value))}
        />
      </label>

      <label className="flex items-center gap-2">
        Color
        <input
          type="color"
          value={lineColor}
          onChange={(e) => onLineColorChange(e.target.value)}
        />
      </label>

      <button type="button" onClick={onToggleMode}>
        {mode === "draw" ? "Eraser" : "Draw"}
      </button>

      <button type="button" onClick={onUndo}>Undo</button>

      <button type="button" onClick={onClear}>Clear</button>
      <button type="button" onClick={onDownload}>Download PNG</button>
    </div>
  );
};

export default Toolbar;