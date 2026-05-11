export type ToolbarProps = {//used to describe components props
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
