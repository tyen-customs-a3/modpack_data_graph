# System Patterns

## Architecture

### Component Structure
1. Data Layer
   - JSON file structure
   - Hierarchical data model
   - Size formatting utilities
   - Directory visibility state

2. Presentation Layer
   - HTML structure
   - CSS styling
   - D3.js visualization
   - Directory list sidebar

3. Control Layer
   - Event handlers
   - State management
   - Update triggers
   - Directory visibility control

## Design Patterns

### Visualization Patterns
1. Circle Pack Layout
   - Hierarchical representation
   - Dynamic sizing
   - Padding control
   - Shadow effects
   - Visibility filtering

2. Color System
   - Sequential color scale
   - Depth-based variations
   - Consistent color mapping

3. Label System
   - Conditional visibility
   - Size formatting
   - Position management
   - Text styling

### Interaction Patterns
1. State Management
   - Depth control
   - Visibility toggles
   - Label state
   - Window resize handling
   - Directory visibility state

2. Event Handling
   - Slider input
   - Checkbox changes
   - Button clicks
   - Window events
   - Directory toggle events

## Implementation Patterns

### Code Organization
1. Modular Structure
   - HTML/CSS/JS separation
   - Clear file responsibilities
   - External resource management
   - State management classes

2. Data Flow
   - JSON loading
   - Data transformation
   - State updates
   - Visualization updates
   - Directory filtering

3. Performance Considerations
   - Efficient DOM updates
   - Responsive design
   - Event debouncing
   - Memory management
   - Filtered data processing

## Component Relationships
```
Directory Scanner (Python) ──> JSON Data ──> Visualization (D3.js)
                                         └─> Directory List ──> Visibility Control
```

## Key Technical Decisions

### 1. Data Structure
- Hierarchical tree structure for directory representation
- JSON format for data exchange
- Size values stored in bytes for precision
- Directory visibility state in Set

### 2. Directory Scanning
- Recursive depth-first traversal
- Path-based filtering for file extensions
- Efficient file size collection using `pathlib`

### 3. Visualization
- D3.js circle pack layout
- Client-side data processing
- Responsive SVG rendering
- Directory visibility filtering

## Design Patterns

### 1. Data Processing
- **Tree Builder Pattern**: Recursive construction of directory tree
- **Visitor Pattern**: Traversal of file system structure
- **Data Transfer Object**: JSON structure for visualization
- **State Pattern**: Directory visibility management

### 2. Visualization
- **Observer Pattern**: Event handling for interactive controls
- **Strategy Pattern**: Different layout algorithms
- **Composite Pattern**: Hierarchical visualization elements
- **Filter Pattern**: Directory visibility control

## Implementation Paths

### 1. Directory Scanning
```python
def build_tree(path):
    if path.is_file():
        return FileNode(path)
    return DirectoryNode(path, [build_tree(child) for child in path.iterdir()])
```

### 2. Data Processing
```python
def process_node(node):
    if node.is_file():
        return {"name": node.name, "value": node.size}
    return {"name": node.name, "children": [process_node(child) for child in node.children]}
```

### 3. Visualization
```javascript
const pack = d3.pack()
    .size([size, size])
    .padding(3);
```

## Critical Implementation Details

1. **File System Access**
   - Use `pathlib` for cross-platform compatibility
   - Handle permission errors gracefully
   - Support symbolic links appropriately

2. **Data Transformation**
   - Maintain hierarchical structure
   - Preserve file sizes accurately
   - Handle large directories efficiently
   - Filter directories based on visibility

3. **Visualization Performance**
   - Optimize SVG rendering
   - Implement efficient updates
   - Handle large datasets gracefully
   - Process filtered data efficiently 