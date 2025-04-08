# File Size Visualizer

This tool helps you visualize file sizes in a directory structure using interactive D3 visualizations. It supports both circle packing and treemap layouts for understanding the size distribution of files in a project.

## Features

- Multiple visualization options:
  - Interactive circle packing layout
  - Interactive treemap layout
  - Easy switching between visualizations
- Common features for both visualizations:
  - Depth control for exploring the directory hierarchy
  - Label visibility control
  - Responsive design that adapts to window size
  - Color-coded blocks/circles based on directory depth
  - Size information displayed in human-readable format
  - Directory visibility control
  - File list view with hierarchical navigation
  - Resizable panels

## Requirements

- Python 3.6 or higher (for scanning directories)
- Modern web browser (for viewing the visualization)

## Usage

1. First, scan your directory to generate the data:

```bash
python scan_files.py <directory> [--extension EXTENSION] [--output OUTPUT_FILE]
```

Arguments:
- `directory`: The directory to scan
- `--extension` or `-e`: (Optional) Filter by file extension (e.g., `.py`, `.js`)
- `--output` or `-o`: (Optional) Output JSON file name (default: `file_data.json`)

Example:
```bash
python scan_files.py ./my_project --extension .py --output project_data.json
```

2. Open the visualization:
   - Open `circle_pack.html` in a web browser
   - The visualization will automatically load the data from `file_data.json` (or your specified output file)

## Interactive Features

- **Visualization Toggle**: Switch between circle packing and treemap layouts
- **Depth Slider**: Adjust how deep into the directory structure you want to view
- **Show/Hide Labels**: Toggle visibility of file/directory labels
- **Directory Visibility**: 
  - Use Ctrl+Click on directories to toggle their visibility
  - Use the directory list to control visibility
  - Reset or invert visibility with the control buttons
- **Selection**: Click on any file or directory to see its details
- **Resizable Panels**: Drag the handles to adjust panel widths

## Notes

- The visualization is completely client-side and portable
- File sizes are displayed in human-readable format (B, KB, MB, GB, TB)
- Colors are assigned based on the directory depth
- The layout automatically adjusts to window size
- Directory visibility controls are limited to second-level directories for clarity 