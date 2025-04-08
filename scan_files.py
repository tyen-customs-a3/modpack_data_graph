import os
import json
from pathlib import Path
import argparse

def scan_directory(directory, file_extension=None):
    """Scan a directory and collect file information."""
    root = Path(directory)
    data = {
        "name": root.name,
        "children": []
    }
    
    # Helper function to build the tree structure
    def build_tree(path):
        if path.is_file():
            if file_extension and not path.suffix.lower() == file_extension.lower():
                return None
            return {
                "name": path.name,
                "value": path.stat().st_size
            }
        
        children = []
        for item in path.iterdir():
            if item.is_dir() or (file_extension and item.suffix.lower() == file_extension.lower()):
                child = build_tree(item)
                if child:
                    children.append(child)
        
        if children:
            return {
                "name": path.name,
                "children": children
            }
        return None
    
    # Build the tree starting from the root
    tree = build_tree(root)
    if tree:
        data = tree
    
    return data

def main():
    parser = argparse.ArgumentParser(description='Scan directory and generate file size data for D3 treemap')
    parser.add_argument('directory', help='Directory to scan')
    parser.add_argument('--extension', '-e', default='.pbo', help='File extension to filter (e.g., .py, .js)')
    parser.add_argument('--output', '-o', default='file_data.json', help='Output JSON file')
    
    args = parser.parse_args()
    
    data = scan_directory(args.directory, args.extension)
    
    with open(args.output, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"Data written to {args.output}")

if __name__ == '__main__':
    main() 