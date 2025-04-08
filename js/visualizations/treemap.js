class TreemapVisualization extends VisualizationManager {
    constructor(containerId, dataManager) {
        super(containerId, dataManager);
        this.createShadowFilter();
    }

    createShadowFilter() {
        // Create shadow filter for the treemap
        this.svg.append("defs")
            .append("filter")
            .attr("id", "shadow")
            .append("feDropShadow")
            .attr("flood-opacity", 0.3)
            .attr("dx", 0)
            .attr("stdDeviation", 3);
    }

    applyLayout(root, g, filteredNodes) {
        const { width, height } = this.getContainerDimensions();
        
        // Reset transform to use full container
        g.attr("transform", "translate(0,0)");
        
        // Create treemap layout
        const treemap = d3.treemap()
            .tile(d3.treemapSquarify)
            .size([width, height])
            .paddingOuter(3)
            .paddingTop(19)
            .paddingInner(1)
            .round(true);

        // Apply the layout
        treemap(root);

        // Create nodes for each element
        const nodes = g.selectAll("g.node")
            .data(filteredNodes)
            .join("g")
            .attr("class", "node")
            .attr("id", d => `node-${d.data.id || Math.random().toString(36).substr(2, 9)}`)
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        // Add rectangles
        nodes.append("rect")
            .attr("fill", d => this.color(d.height))
            .attr("width", d => Math.max(0, d.x1 - d.x0))
            .attr("height", d => Math.max(0, d.y1 - d.y0))
            .on("click", (event, d) => {
                event.stopPropagation();
                if (event.ctrlKey && d.children && d.depth === 1) {
                    this.dataManager.toggleDirectory(d.data.name);
                    this.update();
                    if (window.directoryList) {
                        window.directoryList.buildList();
                    }
                } else {
                    this.dataManager.setSelectedNode(d);
                    this.updateSidePanel();
                    this.updateFileList();
                }
            });
    }

    addTooltips(nodes) {
        const format = d3.format(",d");
        nodes.forEach(node => {
            const nodeId = node.data.id || Math.random().toString(36).substr(2, 9);
            const tooltip = `${node.ancestors().reverse().map(d => d.data.name).join("/")}\n${format(node.value)}`;
            d3.select(`#node-${nodeId}`)
                .append("title")
                .text(tooltip);
        });
    }

    addLabels(nodes) {
        const nodeSelection = d3.selectAll("g.node");
        
        nodeSelection.append("text")
            .attr("class", "treemap-label")
            .attr("x", 3)
            .attr("y", 13)
            .append("tspan")
            .text(d => d.data.name);

        nodeSelection.select("text")
            .append("tspan")
            .text(d => this.dataManager.formatSize(d.value))
            .attr("x", 3)
            .attr("dy", "1.2em");
    }
} 