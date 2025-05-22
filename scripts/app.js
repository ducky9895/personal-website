// Function to load HTML partials
async function loadPartial(elementId, filePath) {
    try {
        // Remove leading slash if present
        const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
        console.log(`Loading partial: ${cleanPath} into element: ${elementId}`);
        
        const response = await fetch(cleanPath);
        if (!response.ok) {
            throw new Error(`Error loading ${cleanPath}: ${response.status}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            console.log(`Found element ${elementId}, setting content`);
            element.innerHTML = html;
        } else {
            console.warn(`Element with id "${elementId}" not found`);
        }
    } catch (error) {
        console.error(`Failed to load partial: ${error}`);
    }
}

// Function to load head content
async function loadHeadContent() {
    try {
        console.log('Loading head content');
        const response = await fetch('layouts/partials/head.html');
        if (!response.ok) {
            throw new Error(`Error loading head content: ${response.status}`);
        }
        const html = await response.text();
        
        // Create a temporary div to parse the HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Get all elements from the head content
        const elements = temp.children;
        
        // Add each element to the document head
        while (elements.length > 0) {
            document.head.appendChild(elements[0]);
        }
        console.log('Head content loaded successfully');
    } catch (error) {
        console.error('Error loading head content:', error);
    }
}

// Function to update the footer date information
function updateFooterDates() {
    // Update copyright year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        const currentYear = new Date().getFullYear();
        currentYearElement.textContent = currentYear;
    }
    
    // Update last modified date
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        // Option 1: Use document last modified date
        const lastModified = new Date(document.lastModified);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        lastUpdatedElement.textContent = lastModified.toLocaleDateString('en-US', options);
        
        // Option 2: Use current date (uncomment if you prefer this)
        // const today = new Date();
        // const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // lastUpdatedElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

// Initialize dark mode
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) {
        console.log('Dark mode toggle button not found');
        return;
    }
    
    const htmlElement = document.documentElement;
    console.log('Initial dark mode state:', htmlElement.classList.contains('dark'));
    
    // Check for saved theme preference or respect OS theme settings
    if (localStorage.getItem('darkMode') === 'true' || 
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && 
         localStorage.getItem('darkMode') === null)) {
        console.log('Enabling dark mode on init');
        enableDarkMode();
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        console.log('Dark mode toggle clicked');
        console.log('Current dark mode state:', htmlElement.classList.contains('dark'));
        if (htmlElement.classList.contains('dark')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
    
    function enableDarkMode() {
        console.log('Enabling dark mode');
        htmlElement.classList.add('dark');
        document.body.classList.add('bg-gray-900');
        document.body.classList.remove('bg-white');
        localStorage.setItem('darkMode', 'true');
        
        const icon = darkModeToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('ri-moon-line');
            icon.classList.add('ri-sun-line');
        }
    }
    
    function disableDarkMode() {
        console.log('Disabling dark mode');
        htmlElement.classList.remove('dark');
        document.body.classList.remove('bg-gray-900');
        document.body.classList.add('bg-white');
        localStorage.setItem('darkMode', 'false');
        
        const icon = darkModeToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('ri-sun-line');
            icon.classList.add('ri-moon-line');
        }
    }
}

// Smooth scroll for anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenuToggle || !mobileMenu) return;
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    }
    
    // Close mobile menu when clicking a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = '';
        });
    });
}

// Load all partials when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM Content Loaded');
    
    // Load head content first if we're not on the index page
    if (!window.location.pathname.endsWith('index.html')) {
        console.log('Loading head content for non-index page');
        await loadHeadContent();
    }

    // Load header for all pages
    const headerId = window.location.pathname.endsWith('index.html') ? 'header-placeholder' : 'header-container';
    console.log(`Loading header into element: ${headerId}`);
    await loadPartial(headerId, 'layouts/partials/header.html');
    
    // Load other partials for index page
    if (window.location.pathname.endsWith('index.html')) {
        console.log('Loading index page partials');
    try {
        await Promise.all([
            loadPartial('hero-placeholder', 'layouts/partials/hero.html'),
            loadPartial('handles-placeholder', 'layouts/partials/handles.html'),
            loadPartial('timeline-placeholder', 'layouts/partials/timeline.html'),
            loadPartial('changelog-placeholder', 'layouts/partials/changelog.html'),
            loadPartial('impact-placeholder', 'layouts/partials/impact.html'),
            loadPartial('footer-placeholder', 'layouts/partials/footer.html')
        ]);
        } catch (error) {
            console.error('Error loading index page partials:', error);
        }
    }
        
        // Initialize after partials are loaded
        setTimeout(() => {
        console.log('Initializing components');
            initializeDarkMode();
            initializeSmoothScroll();
            initializeMobileMenu();
            updateFooterDates();
        }, 100);
        
        // Hide loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = 0;
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);
    }
});