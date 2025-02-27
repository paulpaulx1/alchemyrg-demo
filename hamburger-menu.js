document.querySelector('.menu-overlay').style.display = 'none';

// Wait for everything to be fully loaded before setting up interactions
window.addEventListener('load', function() {
    const menuButton = document.querySelector('.menu-button');
    const menuOverlay = document.querySelector('.menu-overlay');
    const body = document.body;
    
    // Make sure overlay is hidden initially
    menuOverlay.style.display = 'none';
    menuOverlay.style.opacity = '0';
    menuOverlay.style.visibility = 'hidden';

    // Restore display for interaction when needed
    menuButton.addEventListener('click', function() {
        // Toggle menu visibility
        if (menuOverlay.style.display === 'none' || menuOverlay.style.display === '') {
            menuOverlay.style.display = 'flex';
            // Force reflow to ensure transition works
            menuOverlay.offsetWidth;
            menuOverlay.style.opacity = '1';
            menuOverlay.style.visibility = 'visible';
            this.classList.add('active');
            body.style.overflow = 'hidden';
        } else {
            menuOverlay.style.opacity = '0';
            menuOverlay.style.visibility = 'hidden';
            this.classList.remove('active');
            
            // Use a timeout to hide display after transition
            setTimeout(() => {
                menuOverlay.style.display = 'none';
                body.style.overflow = '';
            }, 400); // Match the CSS transition time
        }
    });
    
    // Close menu when clicking on a link (just for demo purposes)
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent actual navigation for demo
            e.preventDefault();
            
            menuButton.classList.remove('active');
            menuOverlay.style.opacity = '0';
            menuOverlay.style.visibility = 'hidden';
            
            // Use a timeout to hide display after transition
            setTimeout(() => {
                menuOverlay.style.display = 'none';
                body.style.overflow = '';
            }, 400);
        });
    });
});