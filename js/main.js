// Initialize the application
fetch('file_data.json')
    .then(response => response.json())
    .then(data => {
        // Create data manager
        const dataManager = new DataManager(data);
        
        // Create initial visualization (circle pack)
        const visualization = new CirclePackVisualization('visualization', dataManager);
        
        // Create UI manager
        const uiManager = new UIManager(dataManager, visualization);
        window.uiManager = uiManager;  // Expose to window object
        
        // Create directory list controller
        const directoryList = new DirectoryListController('directory-list', dataManager, visualization, uiManager);
        window.directoryList = directoryList;  // Expose to window object
        
        // Build initial directory list
        directoryList.buildList();
        
        // Initial update
        visualization.update();
        
        // Update progress bar initially
        uiManager.updateProgressBar();
    })
    .catch(error => console.error("Error loading data:", error)); 