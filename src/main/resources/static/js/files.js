import createPolicy from './utils/policy-creator.js';

document.addEventListener("DOMContentLoaded", async () => {
    const policy = await createPolicy();
    // --- 1. CONFIG & UTILS ---
    const fileGrid = document.getElementById('file-grid');
    const folderList = document.getElementById('folder-list');

    // Regex to get CSRF token (Important for non-GET requests, kept for consistency)
    const regex = /(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/;
    function getCsrfToken() { return document.cookie.replace(regex, '$1'); }

    // Icon Mapper: Maps backend extensions to Emojis (or SVGs in future)
    const getIcon = (type) => {
        const map = {
            'folder': '📁',
            'pdf': '📕',
            'xls': '📗', 'xlsx': '📗',
            'ppt': '📙', 'pptx': '📙',
            'doc': '📘', 'docx': '📘',
            'txt': '📄',
            'jpg': '🖼️', 'png': '🖼️', 'jpeg': '🖼️', 'svg': '🖼️',
            'zip': '📦', 'rar': '📦'
        };
        return map[type] || '📄'; // Default icon
    };

    // --- 2. DATA LOADING ---
    function loadFiles() {
        fetch('/api/files', {
            method: 'GET',
            headers: {
                // GET requests usually don't need CSRF, but good habit
                'Accept': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken()
            }
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to load files");
                return response.json();
            })
            .then(data => renderData(data))
            .catch(err => console.error("Error loading files:", err));
    }

    function renderData(files) {
        // Clear current view
        fileGrid.innerHTML = '';
        folderList.innerHTML = '';

        // 1. Grid: Show Files (Not folders), limit to Top 4 recent
        const recentFiles = files
            .filter(f => !f.isFolder)
            .slice(0, 4); // Already sorted by date in backend

        // 2. List: Show Folders
        const folders = files.filter(f => f.isFolder);

        // Render Grid
        recentFiles.forEach(file => {
            fileGrid.appendChild(createGridCard(file.name, file.type));
        });

        // Render List
        folders.forEach(folder => {
            folderList.appendChild(createListRow(folder.name, folder.type, folder.lastUpdated, folder.size));
        });
    }

    // HTML Generators
    function createGridCard(name, type) {
        const card = document.createElement('div');
        card.className = 'file-card';
        card.innerHTML = `
            <div class="file-card-icon">${getIcon(type)}</div>
            <div class="file-card-name">${name}</div>
        `;
        return card;
    }

    function createListRow(name, type, date, size) {
        const row = document.createElement('li');
        row.className = 'list-row';
        row.innerHTML = `
            <span class="folder-name-cell">
               ${getIcon(type)} 
               <span class="text">${name}</span>
            </span>
            <span style="color: #6b7280; font-size: 0.85rem;">${date}</span>
            <span style="color: #6b7280; font-size: 0.85rem;">${size}</span>
        `;
        return row;
    }

    // --- 3. UPLOAD LOGIC ---
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-bar-container');

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    ['dragenter', 'dragover'].forEach(evt => {
        dropZone.addEventListener(evt, (e) => { e.preventDefault(); dropZone.classList.add('drag-active'); });
    });
    ['dragleave', 'drop'].forEach(evt => {
        dropZone.addEventListener(evt, (e) => { e.preventDefault(); dropZone.classList.remove('drag-active'); });
    });

    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        if (!files.length) return;
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append("file", file));

        progressContainer.style.display = 'block';
        progressBar.style.width = '30%';

        fetch('/api/files/upload', {
            method: 'POST',
            headers: { 'X-XSRF-TOKEN': getCsrfToken() },
            body: formData
        })
            .then(response => {
                if (!response.ok) throw new Error(response.status);
                return response.json();
            })
            .then(data => {
                progressBar.style.width = '100%';

                setTimeout(() => {
                    alert('Upload Complete!');
                    progressBar.style.width = '0%';
                    progressContainer.style.display = 'none';

                    // REFRESH DATA to show the new file
                    loadFiles();
                }, 500);
            })
            .catch(err => {
                console.error(err);
                progressBar.style.backgroundColor = 'red';
                alert("Upload Failed");
            });
    }

    // INITIAL LOAD
    loadFiles();
});