class VisualizationManager {
    constructor(containerId, dataManager) {
        this.container = document.getElementById(containerId);
        this.dataManager = dataManager;
        this.svg = d3.select(this.container)
            .append("svg");
        this.updateColorScheme();
        
        // Listen for theme changes using a MutationObserver
        const themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                    this.updateColorScheme();
                    this.update();
                }
            });
        });

        // Observe the dark theme stylesheet for changes
        const darkTheme = document.getElementById('dark-theme');
        themeObserver.observe(darkTheme, { attributes: true });
    }

    updateColorScheme() {
        const isDarkMode = !document.getElementById('dark-theme').disabled;
        if (isDarkMode) {
            // Light mode color scheme (when dark theme is enabled)
            this.color = d3.scaleSequential([8, 0], d3.interpolateMagma);
            this.textColor = "#333333";
            this.emptyMessageColor = "#666666";
        } else {
            // Dark mode color scheme (when dark theme is disabled)
            this.color = d3.scaleSequential()
                .domain([8, 0])
                .interpolator(d3.interpolateRgbBasis([
                    "#1a0f2e", // Deepest purple
                    "#241a3a", // Very dark purple
                    "#2e2546", // Dark purple
                    "#383052", // Medium-dark purple
                    "#423b5e", // Medium purple
                    "#4c456a", // Medium-light purple
                    "#564f76", // Light purple
                    "#605982", // Very light purple
                    "#6a638e", // Lightest purple
                    "#746d9a"  // Almost white purple
                ]));
            this.textColor = "#ffffff";
            this.emptyMessageColor = "#a0a0a0";
        }
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
            .style("fill", this.emptyMessageColor)
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