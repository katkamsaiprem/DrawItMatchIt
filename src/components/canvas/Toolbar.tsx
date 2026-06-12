import type { ToolbarProps } from "@/types/toolBar.ts"

const SIZES = [4, 8, 14, 20];

const COLORS = [
  "#000000", "#9ca3af", "#f9a8d4",
  "#ef4444", "#f97316", "#eab308",
  "#22c55e", "#06b6d4", "#6366f1",
  "#a855f7", "#84cc16", "#92400e",
];

const Toolbar = ({
  lineSize,
  lineColor,
  mode,
  onLineSizeChange,
  onLineColorChange,
  onToggleMode,
  onClear,
  onUndo,
  onDownload,
}: ToolbarProps) => {

  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border-2 border-foreground/10 bg-white px-3 py-2 shadow-sm">


      <div className="flex items-center gap-2">


        <button
          type="button"
          title="Draw"
          onClick={() => mode === "erase" && onToggleMode()}
          className={[
            "flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all",
            mode === "draw"
              ? "border-foreground bg-foreground/10 shadow-[0_3px_0_0_rgba(0,0,0,0.25)]"
              : "border-foreground/20 bg-white hover:bg-muted",
          ].join(" ")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </button>


        <button
          type="button"
          title="Erase"
          onClick={() => mode === "draw" && onToggleMode()}
          className={[
            "flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all",
            mode === "erase"
              ? "border-foreground bg-foreground/10 shadow-[0_3px_0_0_rgba(0,0,0,0.25)]"
              : "border-foreground/20 bg-white hover:bg-muted",
          ].join(" ")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
            <path d="M22 21H7" />
            <path d="m5 11 9 9" />
          </svg>
        </button>

        <button
          type="button"
          title="Clear canvas"
          onClick={onClear}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-foreground/20 bg-white transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>

        <button
          type="button"
          title="Undo"
          onClick={onUndo}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-foreground/20 bg-white transition-all hover:border-foreground/40 hover:bg-muted"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 14 4 9l5-5" />
            <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
          </svg>
        </button>

        <button
          type="button"
          title="Download PNG"
          onClick={onDownload}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-foreground/20 bg-white transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>

      </div>


      <div className="flex items-center gap-3 px-1">
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            title={`Size ${s}`}
            onClick={() => onLineSizeChange(s)}
            className={[
              "rounded-full bg-foreground transition-all",
              lineSize === s
                ? "ring-2 ring-offset-2 ring-primary scale-110"
                : "opacity-30 hover:opacity-60",
            ].join(" ")}
            style={{ width: s + 4, height: s + 4 }}
          />
        ))}
      </div>


      <div className="flex flex-wrap gap-1">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            onClick={() => onLineColorChange(color)}
            style={{ backgroundColor: color }}
            className={[
              "h-6 w-6 rounded-md border border-black/10 transition-all",
              lineColor === color
                ? "ring-2 ring-offset-1 ring-foreground scale-110"
                : "hover:scale-105",
            ].join(" ")}
          />
        ))}
      </div>

    </div>
  );
};

export default Toolbar;