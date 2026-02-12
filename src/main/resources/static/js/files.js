'use strict';

import createPolicy from './utils/policy-creator.js';
import FileExplorer from './file-utils/FileExplorer.js';
import Utils from './file-utils/Utils.js';
import UploadWidget from './file-utils/UploadWidget.js';
import UploadQueue from './file-utils/UploadQueue.js';
import CONFIG from "./file-utils/MainConfig.js";


createPolicy();


/**
 * --------------------------------------------------------------------------
 * CLASS: FolderManager
 * Handles backend folder creation and ID caching.
 * --------------------------------------------------------------------------
 */
const FolderManager = {
    cache: {},

    async ensureFolderExists(name, parentId) {
        const key = `${parentId}/${name}`;

        // If a request is already in progress or finished, return that promise
        if (this.cache[key]) {
            return await this.cache[key];
        }

        // Store the promise itself in the cache immediately
        this.cache[key] = (async () => {
            const formData = new FormData();
            formData.append("folderName", name);
            if (parentId) formData.append("parentId", parentId);

            try {
                const res = await fetch(CONFIG.ENDPOINTS.CREATE_FOLDER, {
                    method: 'POST',
                    headers: { 'X-XSRF-TOKEN': Utils.getCsrfToken() },
                    body: formData
                });

                if (!res.ok) throw new Error(`Failed to create folder: ${name}`);
                const data = await res.json();

                const currentViewId = Utils.getCurrentFolderId();
                if (String(parentId) === String(currentViewId)) {
                    UploadQueue.scheduleRefresh(parentId, data.id);
                }

                return data.id;
            } catch (err) {
                delete this.cache[key];
                throw err;
            }
        })();

        return await this.cache[key];
    },

    async resolvePathToId(relativePath, rootId) {
        if (!relativePath) return rootId;

        const folders = relativePath.split('/');

        let currentParentId = rootId;

        for (const name of folders) {
            if (!name) continue;
            currentParentId = await this.ensureFolderExists(name, currentParentId);
        }

        return currentParentId;
    }
};

/**
 * --------------------------------------------------------------------------
 * DIRECTORY SCANNER (Recursive - Drag & Drop)
 * --------------------------------------------------------------------------
 */
// Recursively scans, creates folders in backend, and adds files to queue
async function traverseEntry(entry, parentId, currentPath = '') {
    if (entry.isFile) {
        const file = await new Promise((resolve) => entry.file(resolve));
        UploadQueue.add(file, parentId, currentPath);
    }
    else if (entry.isDirectory) {
        try {

            const newFolderId = await FolderManager.ensureFolderExists(entry.name, parentId);

            UploadQueue.scheduleRefresh(Utils.getCurrentFolderId(), newFolderId);

            const newPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;

            const dirReader = entry.createReader();
            const entries = await readAllEntries(dirReader);

            for (const child of entries) {
                await traverseEntry(child, newFolderId, newPath);
            }
        } catch (err) {
            console.error(`Skipping folder ${entry.name}`, err);
        }
    }
}

function readAllEntries(dirReader) {
    return new Promise((resolve, reject) => {
        let entries = [];
        const read = () => {
            dirReader.readEntries(result => {
                if (result.length === 0) resolve(entries);
                else {
                    entries = entries.concat(result);
                    read(); // Chrome req: recursion for >100 files
                }
            }, reject);
        };
        read();
    });
}

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    UploadWidget.init();
    FileExplorer.init();

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const folderInput = document.getElementById('folder-input');
    const rootId = Utils.getCurrentFolderId();

    // 1. CLICK TRIGGERS
    document.getElementById('trigger-file').addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    document.getElementById('trigger-folder').addEventListener('click', (e) => {
        e.stopPropagation();
        folderInput.click();
    });

    // 2. FILE INPUT (Simple)
    fileInput.addEventListener('change', (e) => {
        const currentRootId = Utils.getCurrentFolderId();
        for (const file of e.target.files) {
            UploadQueue.add(file, currentRootId, ''); // No subpath
        }
        fileInput.value = '';
    });

    // 3. FOLDER INPUT (webkitdirectory)
    folderInput.addEventListener('change', async (e) => {
        const currentRootId = Utils.getCurrentFolderId()

        const files = Array.from(e.target.files);

        for (const file of files) {
            const parts = file.webkitRelativePath.split('/');
            parts.pop();
            const folderPath = parts.join('/');

            try {
                // Ensure backend folders exist
                const targetId = await FolderManager.resolvePathToId(folderPath, currentRootId);
                UploadQueue.add(file, targetId, folderPath);
            } catch (err) {
                console.error("Path resolution failed", err);
            }
        }
        folderInput.value = '';
    });

    // 4. DRAG & DROP
    ['dragenter', 'dragover'].forEach(evt => {
        dropZone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-active');
        });
    });

    ['dragleave', 'drop'].forEach(evt => {
        dropZone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-active');
        });
    });

    dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        const currentRootId = Utils.getCurrentFolderId();

        const items = e.dataTransfer.items;
        if (!items) return;

        const entries = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].webkitGetAsEntry) {
                const entry = items[i].webkitGetAsEntry();
                if (entry) entries.push(entry);
            }
        }

        if (entries.length > 0) {
            for (const entry of entries) {
                await traverseEntry(entry, currentRootId, '');
            }
        } else {
            // Fallback for simple file drag
            for (const file of e.dataTransfer.files) {
                UploadQueue.add(file, currentRootId, '');
            }
        }
    });
});