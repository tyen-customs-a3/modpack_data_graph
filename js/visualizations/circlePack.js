class CirclePackVisualization extends VisualizationManager {
    constructor(containerId, dataManager) {
        super(containerId, dataManager);
    }

    applyLayout(root, g, filteredNodes) {
        const { width, height } = this.getContainerDimensions();
        const size = Math.min(width, height);
        
        // Create circle packing layout
        const pack = d3.pack()
            .size([size, size])
            .padding(3);

        // Apply the layout
        pack(root);
        
        // Center the layout within the container
        g.attr("transform", `translate(${width/2 - size/2},${height/2 - size/2})`);

        // Create circles
        const node = g.selectAll("g")
            .data(filteredNodes)
            .join("g")
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .attr("id", d => `node-${d.data.id || Math.random().toString(36).substr(2, 9)}`);

        // Add circles
        node.append("circle")
            .attr("class", "circle")
            .attr("r", d => d.r)
            .attr("fill", d => this.color(d.depth))
            .attr("stroke", this.textColor)
            .attr("stroke-width", 0.5)
            .on("click", (event, d) => {
                event.stopPropagation();
                if (event.ctrlKey && d.children && d.depth === 1) {
                    this.dataManager.toggleDirectory(d.data.name);
                    this.update();
                    if (window.directoryList) {
                        window.directoryList.buildList();
                    }
                    // Update progress bar
                    if (window.uiManager) {
                        window.uiManager.updateProgressBar();
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
        const nodeSelection = d3.selectAll("g[id^='node-']");
        
        nodeSelection.append("text")
            .attr("class", "circle-label")
            .attr("dy", "0.3em")
            .style("fill", this.textColor)
            .style("font-weight", "bold")
            .append("tspan")
            .text(d => d.data.name)
            .attr("x", 0);

        nodeSelection.select("text")
            .append("tspan")
            .text(d => this.dataManager.formatSize(d.value))
            .attr("x", 0)
            .attr("dy", "1.2em")
            .style("font-size", "0.9em")
            .style("fill", this.textColor);

        // Show background only when hovering
        nodeSelection.on("mouseover", function() {
            d3.select(this).select(".label-bg").style("display", "block");
        }).on("mouseout", function() {
            d3.select(this).select(".label-bg").style("display", "none");
        });
    }
} 