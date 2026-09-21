# 3D Filament Label Generator

Do note that this code was mainly created by AI and I did only fix what was broken and instructed the AI a bit. The code is probably shit but for such a small project this was a quick and working solution.

This project was created to solve a very practical problem: keeping track of a large and growing collection of 3D printing filaments.

I print a lot of **filament swatches** to show colors and material properties. Friends can then look through these swatches and choose a color they like for their prints. With many different **brands**, **materials**, and **color names**, it quickly becomes impossible to remember which filament is which.

This tool generates **uniform, print-accurate labels** that can be attached to filament swatches, making the collection easy to understand and use. I use this model for my swatches: https://makerworld.com/en/models/639266-bambu-lab-filament-swatch-with-12x22r2-label?from=search#profileId-565048

---

## Features

- Manage filament **brands** (with optional logos)
- Manage filament **material types** (PLA, PETG, ABS, etc.)
- Create individual labels with:
  - Brand name
  - Material type
  - Filament name
  - Optional brand logo
- Fully configurable label dimensions:
  - Width and height (mm)
  - Corner radius
  - Font sizes
  - Logo size
- **Label-printer-ready PDF output:**
  - Configurable paper/roll size, margins, gaps, and labels per row/page
  - Presets for A4 sheets and 122mm wide continuous rolls (3 labels per row by default)
  - One strip (row of labels) per page for roll printing
  - Convert all brand logos to pure black for single-color printers
  - Adjustable to any label printer by setting the label size and print layout

---

## Printing on a label printer

The PDF export places labels on a page you define in **Global Label Settings → Print Layout**:

- **Paper Width / Height (mm):** the size of one printed page. For a continuous roll, set the
  width to your roll width and the height to the length of one printed strip
  (e.g. `rows × (label height + vertical gap) + top/bottom margins`).
- **Margins (mm):** distance from the page edge to the first label.
- **Gap Horizontal / Vertical (mm):** space between labels. Set to `0` for die-cut labels.
- **Columns / Rows:** number of labels per row / rows per page. Set to `0` to compute them
  automatically from the paper size, label size, margins, and gaps.

For a 122mm wide thermal ribbon printer with 34×15mm labels, use the
**"122mm roll preset (3 per row)"** button, which sets up a 122mm wide strip with 3 labels per
row. Print the resulting PDF at 100% scale (fit/actual size, no scaling).

---

## Workflow

1. Add filament brands (optionally with logos)
2. Add filament material types
3. Configure global label dimensions and typography
4. Create labels for each filament swatch
5. Export a PDF
6. Print, laminate, and attach labels to swatches

---

## Contributing

Please consider sharing brands that are not added by default for others

---

## License

Personal project. Use, modify, and adapt as needed.
All brand images are property of the corresponding company
