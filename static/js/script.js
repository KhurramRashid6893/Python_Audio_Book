document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Theme Toggle ---
    const themeToggle = document.querySelector('.toggle-theme');

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            let theme = 'light';
            if (document.body.classList.contains('dark')) {
                theme = 'dark';
            }
            localStorage.setItem('theme', theme);
        });
    }


    // --- 2. Logic for index.html ---
    const form = document.querySelector('form');
    const fileInput = document.getElementById('pdfFile');
    const browseBtn = document.getElementById('browseBtn');
    const uploadArea = document.getElementById('uploadArea');
    const fileNameDisplay = document.getElementById('fileName');
    const convertBtn = document.getElementById('convertBtn'); // Get the button

    // --- CORRECT LOGIC: Listen for CLICK on the button ---
    if (convertBtn) {
        convertBtn.addEventListener('click', (event) => { 
            event.preventDefault(); // Explicitly stop any default action

            if (fileInput.files.length > 0) {
                // A file is selected, show progress and submit
                const progress = document.getElementById('progress');
                if (progress) {
                    progress.style.display = 'block';
                }
                if (form) {
                    form.submit(); // Manually submit the form
                }
            } else {
                // No file is selected! Show the alert.
                alert('plz upload a pdf');
            }
        });
    }
    // --- END OF CORRECT LOGIC ---


    // Trigger file input click when "Browse" is clicked
    if (browseBtn) {
        browseBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default button behavior
            fileInput.click();
        });
    }

    // Also trigger on the whole upload area, but not the button itself
    if (uploadArea) {
        uploadArea.addEventListener('click', (e) => {
            if (e.target.id !== 'browseBtn' && !e.target.closest('#browseBtn')) {
                fileInput.click();
            }
        });
    }

    // Show selected file name
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileNameDisplay.textContent = fileInput.files[0].name;
            } else {
                fileNameDisplay.textContent = '';
            }
        });
    }

    // --- 3. Dynamic Header/Footer Padding (Moved from index.html) ---
    // This script now runs on all pages that include script.js
    const adjustSpacing = () => {
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        
        if (header) {
            const headerHeight = header.offsetHeight + 20; // add breathing room
            document.body.style.paddingTop = headerHeight + 'px';
        }

        if(footer) {
            const footerHeight = footer.offsetHeight + 20; // add breathing room
            document.body.style.paddingBottom = footerHeight + 'px';
        }
    };

    // Run on load and resize
    adjustSpacing();
    window.addEventListener('resize', adjustSpacing);
    window.addEventListener('load', adjustSpacing); 

});