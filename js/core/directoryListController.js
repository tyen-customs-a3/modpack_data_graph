class DirectoryListController {
    constructor(containerId, dataManager, visualization, uiManager) {
        this.container = document.getElementById(containerId);
        this.dataManager = dataManager;
        this.visualization = visualization;
        this.uiManager = uiManager;
        this.controlsContainer = document.createElement('div');
        this.controlsContainer.className = 'directory-controls';
        this.container.parentNode.insertBefore(this.controlsContainer, this.container);
        this.createControls();
    }

    createControls() {
        const resetButton = document.createElement('button');
        resetButton.className = 'control-button';
        resetButton.textContent = 'Reset Visibility';
        resetButton.addEventListener('click', () => {
            this.dataManager.resetVisibility();
            this.visualization.update();
            this.buildList();
            this.uiManager.updateProgressBar();
        });

        const invertButton = document.createElement('button');
        invertButton.className = 'control-button';
        invertButton.textContent = 'Invert Visibility';
        invertButton.addEventListener('click', () => {
            this.dataManager.invertVisibility();
            this.visualization.update();
            this.buildList();
            this.uiManager.updateProgressBar();
        });

        this.controlsContainer.appendChild(resetButton);
        this.controlsContainer.appendChild(invertButton);
    }

    buildList() {
        this.container.innerHTML = '';
        // Only show immediate children of the root
        this.dataManager.originalData.children.forEach(child => {
            if (child.children && child.children.length > 0) {
                this.createDirectoryItem(child);
            }
        });
    }

    createDirectoryItem(node) {
        const item = document.createElement('div');
        item.className = 'directory-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = !this.dataManager.hiddenDirectories.has(node.name);
        checkbox.addEventListener('change', () => {
            this.dataManager.toggleDirectory(node.name);
            this.visualization.update();
            this.uiManager.updateProgressBar();
        });

        const name = document.createElement('div');
        name.className = 'name';
        name.textContent = node.name;

        const size = document.createElement('div');
        size.className = 'size';
        const totalSize = this.dataManager.calculateDirectorySize(node);
        size.textContent = this.dataManager.formatSizeMB(totalSize);

        item.appendChild(checkbox);
        item.appendChild(name);
        item.appendChild(size);
        this.container.appendChild(item);
    }
} 