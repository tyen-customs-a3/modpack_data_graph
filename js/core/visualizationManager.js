class VisualizationManager {
    constructor(containerId, dataManager) {
        this.container = document.getElementById(containerId);
        this.dataManager = dataManager;
        this.svg = d3.select(this.container)
            .append("svg");
        this.color = d3.scaleSequential([8, 0], d3.interpolateMagma);
    }

    // Get container dimensions
    getContainerDimensions() {
        return {
            width: this.container.clientWidth,
            height: this.container.clientHeight
        };
    }

    // Update the visualization
    update() {
        const { width, height } = this.getContainerDimensions();
        
        // Update SVG dimensions
        this.svg.attr("width", width)
               .attr("height", height);
        
        // Clear previous visualization
        this.svg.selectAll("*").remove();

        // Get filtered data
        const filteredData = this.dataManager.getFilteredData();
        
        // If all directories are hidden, show a message
        if (!filteredData || !filteredData.children || filteredData.children.length === 0) {
            this.showEmptyMessage();
            return;
        }

        // Create a group for the visualization
        const g = this.svg.append("g")
            .attr("transform", `translate(${width/2},${height/2})`);

        // Compute the layout
        const root = d3.hierarchy(filteredData)
            .sum(d => d.value || 0)
            .sort((a, b) => b.value - a.value);

        // Filter nodes based on depth
        const filteredNodes = [];
        root.each(d => {
            if (d.depth <= this.dataManager.currentDepth) {
                filteredNodes.push(d);
            }
        });

        // Apply the layout
        this.applyLayout(root, g, filteredNodes);

        // Add tooltips
        this.addTooltips(filteredNodes);

        // Add labels if enabled
        if (this.dataManager.showLabels) {
            this.addLabels(filteredNodes);
        }

        // Handle click outside
        this.svg.on("click", () => {
            this.dataManager.setSelectedNode(null);
            this.updateSidePanel();
            this.updateFileList();
        });
    }

    // Show empty message
    showEmptyMessage() {
        const g = this.svg.append("g")
            .attr("transform", `translate(${this.container.clientWidth/2},${this.container.clientHeight/2})`);
            
        g.append("text")
            .attr("class", "empty-message")
            .attr("text-anchor", "middle")
            .attr("dy", "0.3em")
            .text("No directories visible");
    }

    // Update side panel
    updateSidePanel() {
        const hoverInfo = d3.select("#hover-info");
        const node = this.dataManager.selectedNode;
        
        if (!node) {
            hoverInfo.html("<p>Click on a file or directory to see details</p>");
            return;
        }

        const path = node.ancestors().reverse().map(d => d.data.name).join("/");
        const size = this.dataManager.formatSizeMB(node.value);
        const isDirectory = node.children !== undefined;

        hoverInfo.html(`
            <p><strong>${isDirectory ? 'Directory' : 'File'}:</strong> ${node.data.name}</p>
            <p class="path">Path: ${path}</p>
            <p class="size">Size: ${size}</p>
            ${isDirectory ? `<p>Contains: ${node.children.length} items</p>` : ''}
        `);
    }

    // Update file list
    updateFileList() {
        const fileListContent = d3.select("#file-list-content");
        const node = this.dataManager.selectedNode;
        
        if (!node || !node.children) {
            fileListContent.html("<p>Select a directory to view its contents</p>");
            return;
        }

        const buildHierarchy = (node, level = 0) => {
            const container = document.createElement('div');
            container.className = 'directory-level';
            container.style.marginLeft = `${level * 20}px`;

            const sortedChildren = [...node.children].sort((a, b) => b.value - a.value);

            sortedChildren.forEach(child => {
                const item = document.createElement('div');
                item.className = 'file-item';

                const name = document.createElement('div');
                name.className = 'name';
                name.textContent = child.data.name;
                item.appendChild(name);

                const size = document.createElement('div');
                size.className = 'size';
                size.textContent = this.dataManager.formatSizeMB(child.value);
                item.appendChild(size);

                container.appendChild(item);

                if (child.children) {
                    container.appendChild(buildHierarchy(child, level + 1));
                }
            });

            return container;
        };

        fileListContent.html("");
        fileListContent.node().appendChild(buildHierarchy(node));
    }

    // Abstract methods to be implemented by specific visualizations
    applyLayout(root, g, filteredNodes) {
        throw new Error("applyLayout must be implemented by subclass");
    }

    addTooltips(nodes) {
        throw new Error("addTooltips must be implemented by subclass");
    }

    addLabels(nodes) {
        throw new Error("addLabels must be implemented by subclass");
    }
} 