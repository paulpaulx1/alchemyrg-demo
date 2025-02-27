// hamburger-menu.js
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.menu-button');
    const menuOverlay = document.querySelector('.menu-overlay');
    const body = document.body;
    
    menuButton.addEventListener('click', function() {
        console.log('hi hi hi hi')
      this.classList.toggle('active');
      menuOverlay.classList.toggle('active');
      
      // Prevent scrolling when menu is open
      if (menuOverlay.classList.contains('active')) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });
    
    // Close menu when clicking on a link (just for demo purposes)
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Prevent actual navigation for demo
        e.preventDefault();
        
        menuButton.classList.remove('active');
        menuOverlay.classList.remove('active');
        body.style.overflow = '';
      });
    });
  });