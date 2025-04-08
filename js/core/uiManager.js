class UIManager {
    constructor(dataManager, visualization) {
        this.dataManager = dataManager;
        this.visualization = visualization;
        this.currentVisualization = 'circlePack';
        this.setupEventListeners();
        this.updateProgressBar();
    }

    setupEventListeners() {
        // Depth slider
        document.getElementById("depth-slider").addEventListener("input", (e) => {
            this.dataManager.setDepth(parseInt(e.target.value));
            document.getElementById("depth-value").textContent = this.dataManager.currentDepth;
            this.visualization.update();
        });

        // Labels toggle
        document.getElementById("toggle-labels").addEventListener("click", () => {
            const showLabels = this.dataManager.toggleLabels();
            this.updateLabelButton(showLabels);
            this.visualization.update();
        });

        // Visualization toggle
        document.getElementById("toggle-visualization").addEventListener("click", () => {
            this.toggleVisualization();
        });

        // Window resize
        window.addEventListener("resize", () => this.visualization.update());

        // Resize handles
        this.setupResizeHandles();
    }

    setupResizeHandles() {
        const leftHandle = document.querySelector('.resize-handle.left');
        const rightHandle = document.querySelector('.resize-handle.right');
        const directorySidebar = document.getElementById('directory-sidebar');
        const sidepanel = document.getElementById('sidepanel');
        const visualization = document.getElementById('visualization');

        let isResizing = false;
        let startX, startWidth, currentHandle;

        const startResize = (e) => {
            isResizing = true;
            startX = e.clientX;
            currentHandle = e.target;
            startWidth = currentHandle.classList.contains('left') ? 
                directorySidebar.offsetWidth : 
                sidepanel.offsetWidth;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        };

        const resize = (e) => {
            if (!isResizing) return;
            
            const delta = e.clientX - startX;
            if (currentHandle.classList.contains('left')) {
                const newWidth = Math.max(200, Math.min(400, startWidth + delta));
                directorySidebar.style.width = `${newWidth}px`;
            } else {
                const newWidth = Math.max(200, Math.min(600, startWidth - delta));
                sidepanel.style.width = `${newWidth}px`;
            }
            
            // Only update the visualization if the middle panel is being resized
            if (currentHandle.classList.contains('left') && e.clientX > directorySidebar.offsetWidth + 8) {
                this.visualization.update();
            } else if (currentHandle.classList.contains('right') && e.clientX < window.innerWidth - sidepanel.offsetWidth - 8) {
                this.visualization.update();
            }
        };

        const stopResize = () => {
            if (!isResizing) return;
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            this.visualization.update();
        };

        leftHandle.addEventListener('mousedown', startResize);
        rightHandle.addEventListener('mousedown', startResize);
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        document.addEventListener('mouseleave', stopResize);
    }

    updateLabelButton(showLabels) {
        document.getElementById("toggle-labels").textContent = 
            showLabels ? "Hide Labels" : "Show Labels";
    }

    toggleVisualization() {
        const container = document.getElementById('visualization');
        const button = document.getElementById('toggle-visualization');
        
        // Clear the container first
        container.innerHTML = '';
        
        // Re-add the legend
        const legend = document.createElement('div');
        legend.id = 'legend';
        legend.innerHTML = `
            <h4>Controls</h4>
            <ul>
                <li><kbd>Ctrl</kbd> + Click: Toggle directory visibility</li>
                <li>Click: Select directory/file</li>
                <li>Click outside: Clear selection</li>
            </ul>
        `;
        container.appendChild(legend);
        
        if (this.currentVisualization === 'circlePack') {
            this.currentVisualization = 'treemap';
            button.textContent = 'Switch to Circle Pack';
            this.visualization = new TreemapVisualization('visualization', this.dataManager);
        } else {
            this.currentVisualization = 'circlePack';
            button.textContent = 'Switch to Treemap';
            this.visualization = new CirclePackVisualization('visualization', this.dataManager);
        }
        
        // Update the visualization and ensure references are correct
        this.visualization.update();
        this.updateProgressBar();
        
        // Update directory list references
        if (window.directoryList) {
            window.directoryList.visualization = this.visualization;
        }
    }

    // Update progress bar based on visible vs total size
    updateProgressBar() {
        const visibleSize = this.dataManager.getVisibleSize();
        const totalSize = this.dataManager.totalSize;
        const percentage = this.dataManager.getVisiblePercentage();
        
        // Format sizes
        const visibleSizeFormatted = this.dataManager.formatSizeWithUnit(visibleSize);
        const totalSizeFormatted = this.dataManager.formatSizeWithUnit(totalSize);
        
        // Update DOM elements
        document.getElementById('visible-size').textContent = visibleSizeFormatted.formatted;
        document.getElementById('total-size').textContent = totalSizeFormatted.formatted;
        document.getElementById('size-progress').style.width = `${percentage}%`;
    }
} 