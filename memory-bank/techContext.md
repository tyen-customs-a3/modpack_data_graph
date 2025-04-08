# Technical Context

## Technologies Used
1. Frontend
   - HTML5
   - CSS3
   - JavaScript (ES6+)
   - D3.js v7
   - Modern Browser APIs

2. Data Processing
   - JSON data format
   - Hierarchical data structures
   - Size calculations
   - Dynamic formatting

## Development Setup
1. File Structure
   ```
   project/
   ├── circle_pack.html
   ├── circle_pack.css
   ├── circle_pack.js
   ├── file_data.json
   └── memory-bank/
       ├── activeContext.md
       ├── progress.md
       ├── systemPatterns.md
       └── techContext.md
   ```

2. Dependencies
   - D3.js v7 (CDN)
   - Modern browser support
   - No build tools required

## Technical Constraints
1. Browser Support
   - Modern browsers required
   - SVG support needed
   - CSS Flexbox support
   - ES6+ JavaScript support

2. Performance
   - Memory usage with large hierarchies
   - Rendering performance
   - Update efficiency
   - Event handling

## Implementation Details
1. Circle Packing
   - D3.js hierarchy
   - Size-based layout
   - Depth filtering
   - Color scaling

2. User Interface
   - Flexbox layout
   - Resizable components
   - Dynamic updates
   - Event handling

3. Data Processing
   - JSON parsing
   - Size calculations
   - Hierarchy traversal
   - Format conversion

## Tool Usage Patterns
1. D3.js
   - Hierarchy construction
   - Circle packing layout
   - Event handling
   - Data binding

2. CSS
   - Flexbox layout
   - Responsive design
   - Animation/transitions
   - Styling components

3. JavaScript
   - Event handling
   - State management
   - DOM manipulation
   - Data processing

## Development Practices
1. Code Organization
   - Modular structure
   - Clear separation
   - Consistent style
   - Documentation

2. Performance
   - Efficient updates
   - Memory management
   - Event optimization
   - Rendering control

3. Maintenance
   - Code documentation
   - Error handling
   - State management
   - Update patterns

## Project Structure
```
.
├── visualization.html    # Main HTML file
├── styles.css           # CSS styles
├── script.js            # JavaScript logic
└── file_data.json       # Generated file size data
```

## Key Components

### HTML Structure
- Header section with controls
- Main visualization container
- External resource links (D3.js, styles.css, script.js)

### CSS Organization
- Responsive layout using flexbox
- SVG positioning and sizing
- Interactive element styling
- Label and text formatting

### JavaScript Implementation
1. Data Handling
   - JSON data loading
   - Size formatting utilities
   - Hierarchical data processing

2. Visualization
   - D3 treemap layout
   - Dynamic SVG creation
   - Color scaling
   - Label management
   - Shadow effects

3. Interactivity
   - Depth slider control
   - File visibility toggle
   - Label visibility toggle
   - Window resize handling

## Dependencies
- D3.js v7 (CDN)
- Modern browser with ES6 support

## Development Setup
1. Local development
   - Serve files through local web server
   - Generate file_data.json using scan_files.py
   - Open visualization.html in browser

2. File Structure
   - Modular separation of concerns
   - Clean code organization
   - Responsive design patterns

## Development Setup

### Environment Requirements
- Python 3.6 or higher
- Modern web browser
- Text editor or IDE

### File Structure
```
.
├── scan_files.py      # Directory scanning script
├── visualization.html # D3 visualization
└── file_data.json    # Generated data file
```

### Dependencies
No external Python packages required. The only external dependency is D3.js, which is loaded from CDN.

## Technical Constraints

### File System
- Cross-platform compatibility (Windows, macOS, Linux)
- Permission handling
- Symbolic link support
- Large directory handling

### Browser Support
- Modern web browsers
- SVG support required
- JavaScript enabled

### Performance Considerations
- Memory usage for large directories
- SVG rendering performance
- Data processing efficiency

## Tool Usage Patterns

### Directory Scanning
```bash
python scan_files.py <directory> [--extension EXTENSION] [--output OUTPUT_FILE]
```

### Visualization
- Open `visualization.html` in browser
- Loads `file_data.json` automatically
- Interactive controls for exploration

## Data Flow
1. Directory scanning → JSON data
2. JSON data → D3 visualization
3. User interaction → Visual updates

## Security Considerations
- Local file system access only
- No network operations
- No sensitive data collection
- Self-contained visualization 