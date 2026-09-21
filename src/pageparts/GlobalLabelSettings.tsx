import { useContextSelector } from "use-context-selector";
import { AppContext } from "../AppContextWrapper";
import NumberInput from "../components/NumberInput";
import { useCallback } from "react";

export default function GlobalLabelSettings() {
  const { setAppState, labelConfig } = useContextSelector(
    AppContext,
    ({ setAppState, appState: { labelConfig } }) => ({
      setAppState,
      labelConfig,
    }),
  );

  const updateLabelConfig = useCallback(
    (key: keyof typeof labelConfig, value: number | boolean) => {
      setAppState((prev) => ({
        ...prev,
        labelConfig: {
          ...prev.labelConfig,
          [key]: value,
        },
      }));
    },
    [setAppState],
  );

  const applyPreset = useCallback(
    (preset: "a4" | "roll") => {
      const base = { ...labelConfig };
      if (preset === "a4") {
        updateLabelConfig("paperWidth", 210);
        updateLabelConfig("paperHeight", 297);
        updateLabelConfig("marginLeft", 10);
        updateLabelConfig("marginRight", 10);
        updateLabelConfig("marginTop", 10);
        updateLabelConfig("marginBottom", 10);
        updateLabelConfig("gapX", 3);
        updateLabelConfig("gapY", 3);
        updateLabelConfig("columns", 0);
        updateLabelConfig("rows", 0);
        return;
      }

      // 122mm wide continuous roll: as many labels as fit per row (3 for
      // 34mm labels), one strip per page. Columns are computed from the
      // label width with 10mm margins on each side.
      const usableWidth = 102;
      const cols = Math.max(1, Math.floor(usableWidth / base.width));
      updateLabelConfig("paperWidth", 122);
      updateLabelConfig("marginLeft", 10);
      updateLabelConfig("marginRight", 10);
      updateLabelConfig("marginTop", 5);
      updateLabelConfig("marginBottom", 5);
      updateLabelConfig("gapX", 0);
      updateLabelConfig("gapY", 1);
      updateLabelConfig("columns", cols);
      updateLabelConfig("rows", 6);
      updateLabelConfig("paperHeight", Math.max(10, 6 * (base.height + 1) + 9));
    },
    [labelConfig, updateLabelConfig],
  );

  const numberInput = (
    label: string,
    key: keyof typeof labelConfig,
    min: number,
    hint?: string,
  ) => (
    <div className="col-md-3 mb-2" title={hint}>
      <label className="form-label">{label}</label>
      <NumberInput
        className="form-control"
        defaultValue={labelConfig[key] as number}
        min={min}
        onValueChange={(value) => {
          if (!(typeof value === "number")) return;
          updateLabelConfig(key, value);
        }}
      />
    </div>
  );

  return (
    <section className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Global Label Settings</h5>
      </div>
      <div className="card-body">
        <p className="small text-muted">
          These settings apply to all labels. Font sizes are in pt, everything
          else in mm.
        </p>
        <div className="row">
          {numberInput("Width (mm)", "width", 4)}
          {numberInput("Height (mm)", "height", 4)}
          {numberInput("Corner Radius (mm)", "cornerRadius", 0)}
          {numberInput("Logo Size (mm)", "logoSize", 2)}
          {numberInput("Brand Font Size (pt)", "brandFontSize", 4)}
          {numberInput("Filament Font Size (pt)", "filamentFontSize", 4)}
        </div>

        <div className="mt-3">
          <h6 className="mb-2">Print Layout</h6>
          <p className="small text-muted">
            This controls how labels are placed on the printed page. Set
            columns/rows to 0 to fill the page automatically. For a continuous
            roll, the page height is the length of one printed strip.
          </p>
          <div className="d-flex gap-2 mb-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => applyPreset("a4")}
            >
              A4 sheet preset
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => applyPreset("roll")}
            >
              122mm roll preset (3 per row)
            </button>
          </div>
          <div className="row">
            {numberInput("Paper Width (mm)", "paperWidth", 10)}
            {numberInput("Paper Height (mm)", "paperHeight", 10)}
            {numberInput("Margin Left (mm)", "marginLeft", 0)}
            {numberInput("Margin Top (mm)", "marginTop", 0)}
            {numberInput("Margin Right (mm)", "marginRight", 0)}
            {numberInput("Margin Bottom (mm)", "marginBottom", 0)}
            {numberInput("Gap Horizontal (mm)", "gapX", 0)}
            {numberInput("Gap Vertical (mm)", "gapY", 0)}
            <div
              className="col-md-3 mb-2"
              title="Number of labels per row. 0 = compute automatically from the paper width."
            >
              <label className="form-label">Columns (0 = auto)</label>
              <NumberInput
                className="form-control"
                defaultValue={labelConfig.columns}
                min={0}
                onValueChange={(value) => {
                  if (!(typeof value === "number")) return;
                  updateLabelConfig("columns", value);
                }}
              />
            </div>
            <div
              className="col-md-3 mb-2"
              title="Number of label rows per page. 0 = compute automatically from the paper height."
            >
              <label className="form-label">Rows (0 = auto)</label>
              <NumberInput
                className="form-control"
                defaultValue={labelConfig.rows}
                min={0}
                onValueChange={(value) => {
                  if (!(typeof value === "number")) return;
                  updateLabelConfig("rows", value);
                }}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={labelConfig.centerOnPage}
                  onChange={(e) =>
                    updateLabelConfig("centerOnPage", e.target.checked)
                  }
                  id="centerOnPage"
                />
                <label
                  className="form-check-label"
                  htmlFor="centerOnPage"
                  title="Centers the row of labels on the paper width, ignoring the left/right margins"
                >
                  Center horizontally on page
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={labelConfig.printBorder}
                  onChange={(e) => updateLabelConfig("printBorder", e.target.checked)}
                  id="printBorder"
                />
                <label className="form-check-label" htmlFor="printBorder">
                  Print label border
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={labelConfig.printBackground}
                  onChange={(e) =>
                    updateLabelConfig("printBackground", e.target.checked)
                  }
                  id="printBackground"
                />
                <label
                  className="form-check-label"
                  htmlFor="printBackground"
                  title="Fills each label with white so label content never runs together"
                >
                  White label background
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={labelConfig.cutGuides}
                  onChange={(e) =>
                    updateLabelConfig("cutGuides", e.target.checked)
                  }
                  id="cutGuides"
                />
                <label
                  className="form-check-label"
                  htmlFor="cutGuides"
                  title="Prints dashed cut lines at the boundary of each label"
                >
                  Cut guides
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
