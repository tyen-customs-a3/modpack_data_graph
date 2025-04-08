class DataManager {
    constructor(data) {
        this.originalData = data;
        this.hiddenDirectories = new Set();
        this.currentDepth = 1;
        this.showLabels = true;
        this.selectedNode = null;
        this.totalSize = this.calculateDirectorySize(data);
    }

    // Calculate total size of a directory recursively
    calculateDirectorySize(node) {
        if (!node.children) return node.value || 0;
        return node.children.reduce((sum, child) => sum + this.calculateDirectorySize(child), 0);
    }

    // Get the visible size of data
    getVisibleSize() {
        const filteredData = this.getFilteredData();
        return this.calculateDirectorySize(filteredData);
    }

    // Get visible percentage (0-100)
    getVisiblePercentage() {
        if (this.totalSize === 0) return 0;
        return (this.getVisibleSize() / this.totalSize) * 100;
    }

    // Filter out hidden directories from the data
    getFilteredData() {
        const copyData = JSON.parse(JSON.stringify(this.originalData));
        
        if (copyData.children) {
            copyData.children = copyData.children.filter(child => {
                if (child.children) {
                    return !this.hiddenDirectories.has(child.name);
                }
                return true;
            });
        }
        
        return copyData;
    }

    // Toggle directory visibility (only for second-level directories)
    toggleDirectory(name) {
        const isSecondLevel = this.originalData.children.some(child => child.name === name);
        if (!isSecondLevel) return;

        if (this.hiddenDirectories.has(name)) {
            this.hiddenDirectories.delete(name);
        } else {
            this.hiddenDirectories.add(name);
        }
    }

    // Reset all directories to visible
    resetVisibility() {
        this.hiddenDirectories.clear();
    }

    // Invert visibility of second-level directories only
    invertVisibility() {
        this.originalData.children.forEach(child => {
            if (child.children) {
                if (this.hiddenDirectories.has(child.name)) {
                    this.hiddenDirectories.delete(child.name);
                } else {
                    this.hiddenDirectories.add(child.name);
                }
            }
        });
    }

    // Set depth
    setDepth(depth) {
        this.currentDepth = depth;
    }

    // Toggle labels
    toggleLabels() {
        this.showLabels = !this.showLabels;
        return this.showLabels;
    }

    // Set selected node
    setSelectedNode(node) {
        this.selectedNode = node;
    }

    // Format size for display with unit
    formatSizeWithUnit(bytes) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return {
            value: size.toFixed(1),
            unit: units[unitIndex],
            formatted: `${size.toFixed(1)} ${units[unitIndex]}`
        };
    }

    // Format size for display
    formatSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)}${units[unitIndex]}`;
    }

    // Format size in MB
    formatSizeMB(bytes) {
        const sizeMB = bytes / (1024 * 1024);
        return `${sizeMB.toFixed(2)}MB`;
    }
} 