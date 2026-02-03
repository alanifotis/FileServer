'use strict';

import createPolicy from './utils/policy-creator.js';

createPolicy();

// // --- CONFIGURATION ---
// const CONFIG = {
//     CHUNK_SIZE: 5 * 1024 * 1024,
//     MAX_PARALLEL_UPLOADS: 3,
//     MAX_RETRIES: 5,
//     RETRY_DELAY: 2000,
//     ENDPOINTS: {
//         UPLOAD: '/api/files',
//         CREATE_FOLDER: '/api/files/folder'
//     }
// };

// // --- HELPERS ---
// const Utils = {
//     getCsrfToken: () => document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1'),
    
//     getCurrentFolderId: () => {
//         const path = window.location.pathname;
//         const segments = path.split('/').filter(Boolean);
//         // Assuming URL is /drive/folder/123. If root, return null.
//         const id = parseInt(segments.pop()); 
//         return isNaN(id) ? null : id;
//     },

//     formatBytes: (bytes, decimals = 2) => {
//         if (!+bytes) return '0 Bytes';
//         const k = 1024;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
//     },

//     generateUUID: () => {
//         if (typeof crypto !== 'undefined' && crypto.randomUUID) {
//             return crypto.randomUUID();
//         }
//         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
//             const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
//             return v.toString(16);
//         });
//     }
// };


// class FileUploader {
//     constructor(file, parentId, callbacks) {
//         this.file = file;
//         this.parentId = parentId;
//         this.totalChunks = Math.ceil(file.size / CONFIG.CHUNK_SIZE);
//         this.uploadId = Utils.generateUUID();
//         this.abortController = new AbortController();
//         this.isAborted = false;
//         this.callbacks = callbacks || {};
//     }

//     async start() {
//         try {
//             console.log(`🚀 Starting: ${this.file.name} | ${this.totalChunks} chunks`);
            
//             // Chunk Loop
//             for (let i = 0; i < this.totalChunks; i++) {
//                 if (this.isAborted) throw new Error("Upload Cancelled");
//                 await this._uploadChunk(i);
//             }

//             // Finish
//             if (this.callbacks.onSuccess) this.callbacks.onSuccess(this.file);
            
//         } catch (error) {
//             if (this.isAborted) {
//                 console.warn(`🛑 Cancelled: ${this.file.name}`);
//             } else {
//                 console.error(`❌ Failed: ${this.file.name}`, error);
//                 if (this.callbacks.onError) this.callbacks.onError(error, this.file);
//             }
//         }
//     }

//     abort() {
//         this.isAborted = true;
//         this.abortController.abort();
//     }

//     async _uploadChunk(chunkIndex) {
//         const start = chunkIndex * CONFIG.CHUNK_SIZE;
//         const end = Math.min(start + CONFIG.CHUNK_SIZE, this.file.size);
//         const chunkBlob = this.file.slice(start, end);

//         const formData = new FormData();
//         formData.append("file", chunkBlob, this.file.name); 
//         formData.append("chunkIndex", chunkIndex);
//         formData.append("totalChunks", this.totalChunks);
        
//         if (this.parentId) formData.append("parentId", this.parentId);
        
//         if (this.uploadId) formData.append("uploadId", this.uploadId);

//         let attempt = 0;
        
//         while (attempt < CONFIG.MAX_RETRIES) {
//             try {
//                 if (this.isAborted) return;
                
//                 const response = await this._sendXhr(formData, chunkIndex);
                
//                 // Capture the server-generated UUID from the partial response
//                 if (response.status === 'partial' && response.uploadId) {
//                     this.uploadId = response.uploadId;
//                 }
                
//                 return; // Chunk success
//             } catch (err) {
//                 attempt++;
//                 if (this.isAborted) throw new Error("Cancelled");
//                 if (attempt >= CONFIG.MAX_RETRIES) throw err;
                
//                 console.warn(`⚠️ Retrying chunk ${chunkIndex} (${attempt}/${CONFIG.MAX_RETRIES})...`);
//                 await new Promise(r => setTimeout(r, CONFIG.RETRY_DELAY * attempt)); 
//             }
//         }
//     }

//     _sendXhr(formData, chunkIndex) {
//         return new Promise((resolve, reject) => {
//             const xhr = new XMLHttpRequest();
//             xhr.open('POST', CONFIG.ENDPOINTS.UPLOAD);
//             xhr.setRequestHeader('X-XSRF-TOKEN', Utils.getCsrfToken());

//             // ⚡ Progress Calculation
//             xhr.upload.onprogress = (e) => {
//                 if (e.lengthComputable && this.callbacks.onProgress) {
//                     // Global Progress = (Completed Chunks * ChunkSize) + Current Chunk Loaded Bytes
//                     const uploadedBytes = (chunkIndex * CONFIG.CHUNK_SIZE) + e.loaded;
//                     const totalPercent = Math.min(100, (uploadedBytes / this.file.size) * 100);
//                     this.callbacks.onProgress(totalPercent, this.file);
//                 }
//             };

//             this.abortController.signal.addEventListener('abort', () => xhr.abort());

//             xhr.onload = () => {
//                 if (xhr.status >= 200 && xhr.status < 300) {
//                     try {
//                         resolve(JSON.parse(xhr.responseText));
//                     } catch (e) {
//                         reject(new Error("Invalid JSON response from server"));
//                     }
//                 } else {
//                     reject(new Error(`HTTP ${xhr.status} - ${xhr.statusText}`));
//                 }
//             };

//             xhr.onerror = () => reject(new Error("Network connection lost"));
//             xhr.onabort = () => reject(new Error("Aborted"));

//             xhr.send(formData);
//         });
//     }
// }

// /**
//  * --------------------------------------------------------------------------
//  * CLASS: UploadQueue
//  * The Orchestrator. Prevents browser freeze on bulk drops.
//  * --------------------------------------------------------------------------
//  */
// const UploadQueue = {
//     queue: [],
//     activeUploads: 0,
//     activeInstances: {}, 

//     add(file, parentId) {
//         UI.createProgressBar(file);
//         this.queue.push({ file, parentId });
//         this.process();
//     },

//     async process() {
//         if (this.activeUploads >= CONFIG.MAX_PARALLEL_UPLOADS || this.queue.length === 0) {
//             return;
//         }

//         const task = this.queue.shift();
//         this.activeUploads++;

//         const callbacks = {
//             onProgress: (percent) => UI.updateProgress(task.file, percent),
//             onSuccess: () => {
//                 UI.markSuccess(task.file);
//                 this.finalizeTask(task.file.name);
//             },
//             onError: (err) => {
//                 UI.markError(task.file, err);
//                 this.finalizeTask(task.file.name);
//             }
//         };

//         const uploader = new FileUploader(task.file, task.parentId, callbacks);
//         this.activeInstances[task.file.name] = uploader;

//         // Fire and forget (don't await, let parallelism work)
//         uploader.start().catch(console.error);
        
//         // Try to start another one immediately
//         this.process(); 
//     },

//     finalizeTask(fileName) {
//         delete this.activeInstances[fileName];
//         this.activeUploads--;
//         this.process();
//     },

//     cancelAll() {
//         Object.values(this.activeInstances).forEach(u => u.abort());
//         this.queue = [];
//         this.activeUploads = 0;
//     }
// };

// // --- DIRECTORY SCANNER ---
// async function traverseFileTree(entry, parentId) {
//     if (entry.isFile) {
//         const file = await new Promise((resolve, reject) => entry.file(resolve, reject));
//         UploadQueue.add(file, parentId);
//     } 
//     else if (entry.isDirectory) {
//         try {
//             const newFolderId = await createFolder(entry.name, parentId);
//             const dirReader = entry.createReader();
//             const entries = await readAllEntries(dirReader);
//             for (const child of entries) {
//                 await traverseFileTree(child, newFolderId);
//             }
//         } catch (err) {
//             console.error(`Skipping folder ${entry.name}:`, err);
//         }
//     }
// }

// async function createFolder(name, parentId) {
//     const formData = new FormData();
//     formData.append("folderName", name);
//     if (parentId) formData.append("parentId", parentId);

//     const res = await fetch(CONFIG.ENDPOINTS.CREATE_FOLDER, {
//         method: 'POST',
//         headers: { 'X-XSRF-TOKEN': Utils.getCsrfToken() },
//         body: formData
//     });
//     if (!res.ok) throw new Error("Folder creation failed");
//     const data = await res.json();
//     return data.id;
// }

// function readAllEntries(dirReader) {
//     return new Promise((resolve, reject) => {
//         let entries = [];
//         const read = () => {
//             dirReader.readEntries(result => {
//                 if (result.length === 0) resolve(entries);
//                 else {
//                     entries = entries.concat(result);
//                     read(); // Chrome recursion
//                 }
//             }, reject);
//         };
//         read();
//     });
// }

// // --- UI HANDLERS (Customize this) ---
// const UI = {
//     createProgressBar: (file) => {
//         // e.g., create a DOM element
//         console.log(`[UI] Queued: ${file.name}`);
//     },
//     updateProgress: (file, percent) => {
//         // e.g., update width of bar
//         // console.log(`[UI] ${file.name}: ${percent.toFixed(0)}%`);
//     },
//     markSuccess: (file) => {
//         console.log(`[UI] ✅ ${file.name}`);
//         // Refresh file list in UI?
//     },
//     markError: (file, err) => {
//         console.error(`[UI] ❌ ${file.name}`, err);
//     }
// };

// // --- INIT ---
// document.addEventListener("DOMContentLoaded", () => {
//     const dropZone = document.getElementById('drop-zone');
//     const currentFolderId = Utils.getCurrentFolderId();

//     dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('active'); });
//     dropZone.addEventListener('dragleave', () => dropZone.classList.remove('active'));

//     dropZone.addEventListener('drop', async (e) => {
//         e.preventDefault();
//         dropZone.classList.remove('active');
        
//         const items = e.dataTransfer.items;
//         if (!items) return;

//         const entries = [];
//         for (let i = 0; i < items.length; i++) {
//             if (items[i].webkitGetAsEntry) {
//                 const entry = items[i].webkitGetAsEntry();
//                 if (entry) entries.push(entry);
//             }
//         }

//         if (entries.length > 0) {
//             for (const entry of entries) {
//                 await traverseFileTree(entry, currentFolderId);
//             }
//         } else {
//             // Fallback
//             for (const file of e.dataTransfer.files) {
//                 UploadQueue.add(file, currentFolderId);
//             }
//         }
//     });
// });

// --- CONFIGURATION ---
const CONFIG = {
    CHUNK_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_PARALLEL_UPLOADS: 3,
    MAX_RETRIES: 5,
    RETRY_DELAY: 2000,
    ENDPOINTS: { 
        UPLOAD: '/api/files',
        CREATE_FOLDER: '/api/files/folder'
    }
};

// --- HELPERS ---
const Utils = {
    getCsrfToken: () => {
        const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN\s*=\s*([^;]+)/);
        return match ? match[1] : null;
    },
    getCurrentFolderId: () => {
        const parts = window.location.pathname.split('/');
        const id = parseInt(parts.pop());
        return isNaN(id) ? null : id;
    },
    formatBytes: (bytes) => {
        if (!+bytes) return '0 B';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${['B', 'KB', 'MB', 'GB'][i]}`;
    },
    // Creates a safe DOM ID from a string path (for folder nesting)
    safeDomId: (str) => 'node-' + btoa(unescape(encodeURIComponent(str))).replace(/[^a-zA-Z0-9]/g, ''),
    
    // Unique ID for file uploads (Widget tracking)
    uploadId: (file) => 'u-' + file.name.replace(/[^a-zA-Z0-9]/g, '') + '-' + file.size
};

/**
 * --------------------------------------------------------------------------
 * CLASS: FolderManager
 * Handles backend folder creation and ID caching.
 * --------------------------------------------------------------------------
 */
const FolderManager = {
    cache: {}, 

    async ensureFolderExists(name, parentId) {
        // Create a unique key for cache: "123/FolderName" or "root/FolderName"
        const key = `${parentId || 'root'}/${name}`;
        if (this.cache[key]) return this.cache[key];

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
            
            this.cache[key] = data.id; 
            return data.id;
        } catch (err) {
            console.error(err);
            throw err; // Propagate error to stop upload of children
        }
    },

    // For Input Directory: Resolves "A/B/C" path to the final Backend ID
    async resolvePathToId(relativePath, rootId) {
        if (!relativePath) return rootId;
        
        const folders = relativePath.split('/');
        // If the path includes the filename at the end, pop it. 
        // (webkitRelativePath usually is "Folder/File.txt")
        // We assume the caller passes ONLY the folder path part if possible, 
        // but let's be safe: logic depends on how you parse it.
        // Here we assume 'relativePath' is JUST folders: "Photos/Summer"
        
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
 * CLASS: BrowserTree (The Visual Tree)
 * Dynamically builds the DOM tree for uploads
 * --------------------------------------------------------------------------
 */
const BrowserTree = {
    rootEl: document.getElementById('file-list'),

    // path string example: "Photos/Summer"
    addFileNode(file, path) {
        // Remove empty state if present
        const empty = this.rootEl.querySelector('.empty-state');
        if (empty) empty.remove();

        let parentContainer = this.rootEl;

        // 1. BUILD FOLDER STRUCTURE
        if (path && path.length > 0) {
            const folders = path.split('/');
            let currentPathStr = '';

            for (const folderName of folders) {
                if (!folderName) continue;
                
                // Build cumulative path for ID: "Photos", then "Photos/Summer"
                currentPathStr = currentPathStr ? `${currentPathStr}/${folderName}` : folderName;
                const folderId = Utils.safeDomId(currentPathStr);

                let folderLi = document.getElementById(folderId);

                if (!folderLi) {
                    // Create the Folder Row
                    folderLi = document.createElement('li');
                    folderLi.id = folderId;
                    folderLi.className = 'is-folder'; 
                    
                    // Folder HTML (CSP Safe - Class based)
                    folderLi.innerHTML = `
                        <div class="tree-row">
                            <span class="col-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                            </span>
                            <span class="col-name">${folderName}</span>
                            <span class="col-status"></span>
                            <span class="col-size">-</span>
                        </div>
                        <ul class="tree-children"></ul>
                    `;
                    parentContainer.appendChild(folderLi);
                }
                
                // Step deeper into this folder's UL
                parentContainer = folderLi.querySelector('.tree-children');
            }
        }

        // 2. ADD FILE ROW
        const li = document.createElement('li');
        li.className = 'tree-item'; // CSS handles indentation via padding in .tree-item or .tree-children
        
        li.innerHTML = `
            <div class="tree-row">
                <span class="col-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/></svg>
                </span>
                <span class="col-name">${file.name}</span>
                <span class="col-status">Uploaded</span>
                <span class="col-size">${Utils.formatBytes(file.size)}</span>
            </div>
        `;
        
        // Add to the determined container (Root or specific Subfolder)
        parentContainer.appendChild(li);
    }
};

/**
 * --------------------------------------------------------------------------
 * CLASS: UploadWidget (Bottom Right Panel)
 * --------------------------------------------------------------------------
 */
const UploadWidget = {
    el: document.getElementById('upload-widget'),
    header: document.getElementById('widget-header'),
    body: document.getElementById('widget-body'),
    title: document.getElementById('widget-title'),
    toggleBtn: document.getElementById('widget-toggle-btn'),
    closeBtn: document.getElementById('widget-close-btn'),
    
    totalItems: 0,
    completedItems: 0,
    isMinimized: false,

    init() {
        this.header.addEventListener('click', (e) => {
            if (e.target.closest('button')) return; 
            this.toggleMinimize();
        });
        
        this.toggleBtn.addEventListener('click', () => this.toggleMinimize());
        
        this.closeBtn.addEventListener('click', () => {
            this.el.classList.add('hidden');
            this.body.innerHTML = '';
            this.totalItems = 0;
            this.completedItems = 0;
            UploadQueue.cancelAll();
        });
    },

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.el.classList.toggle('minimized', this.isMinimized);
        
        const svg = this.toggleBtn.querySelector('svg');
        if (svg) {
            svg.classList.add('widget-toggle-icon'); 
            this.isMinimized ? svg.classList.add('rotate-180') : svg.classList.remove('rotate-180');
        }
    },

    show() {
        this.el.classList.remove('hidden');
        if (this.isMinimized) this.toggleMinimize();
    },

    addItem(file, onCancel) {
        this.totalItems++;
        this.updateTitle();
        this.show();

        const id = Utils.uploadId(file);
        
        const row = document.createElement('div');
        row.className = 'upload-row';
        row.id = id;

        row.innerHTML = `
            <div class="row-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>
            </div>
            <div class="row-name">${file.name}</div>
            <div class="row-actions">
                <button class="cancel-btn" title="Cancel upload">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <div class="success-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div class="error-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
            </div>
            <div class="row-progress-track">
                <div class="row-progress-fill"></div>
            </div>
        `;

        this.body.insertBefore(row, this.body.firstChild);

        const cancelBtn = row.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            row.classList.add('error');
            onCancel(); 
            this.updateStatus(file, 'cancelled');
        });
    },

    updateProgress(file, percent) {
        const row = document.getElementById(Utils.uploadId(file));
        if (row) row.querySelector('.row-progress-fill').style.width = `${percent}%`;
    },

    updateStatus(file, status) {
        const row = document.getElementById(Utils.uploadId(file));
        if (!row) return;

        if (status === 'success') {
            row.classList.add('completed');
            this.completedItems++;
        } else if (status === 'error' || status === 'cancelled') {
            row.classList.add('error');
            this.completedItems++;
        }
        this.updateTitle();
    },

    updateTitle() {
        if (this.completedItems === this.totalItems && this.totalItems > 0) {
            this.title.textContent = "Uploads complete";
            setTimeout(() => { 
                if(!this.isMinimized && this.completedItems === this.totalItems) this.toggleMinimize(); 
            }, 3000);
        } else {
            this.title.textContent = `Uploading ${this.completedItems} of ${this.totalItems} items`;
        }
    }
};

/**
 * --------------------------------------------------------------------------
 * CLASS: FileUploader (Single File Chunk Logic)
 * --------------------------------------------------------------------------
 */
class FileUploader {
    constructor(file, parentId, callbacks) {
        this.file = file;
        this.parentId = parentId;
        this.totalChunks = Math.ceil(file.size / CONFIG.CHUNK_SIZE);
        this.uploadId = null;
        this.abortController = new AbortController();
        this.callbacks = callbacks || {};
        this.isAborted = false;
    }

    async start() {
        try {
            for (let i = 0; i < this.totalChunks; i++) {
                if (this.isAborted) throw new Error("Cancelled");
                await this._uploadChunk(i);
            }
            if (this.callbacks.onSuccess) this.callbacks.onSuccess(this.file);
        } catch (error) {
            if (!this.isAborted && this.callbacks.onError) this.callbacks.onError(error, this.file);
        }
    }

    abort() {
        this.isAborted = true;
        this.abortController.abort();
    }

    async _uploadChunk(chunkIndex) {
        const start = chunkIndex * CONFIG.CHUNK_SIZE;
        const end = Math.min(start + CONFIG.CHUNK_SIZE, this.file.size);
        const blob = this.file.slice(start, end);

        const fd = new FormData();
        fd.append("file", blob, this.file.name);
        fd.append("chunkIndex", chunkIndex);
        fd.append("totalChunks", this.totalChunks);
        if (this.parentId) fd.append("parentId", this.parentId);
        if (this.uploadId) fd.append("uploadId", this.uploadId);

        for (let attempt = 0; attempt < CONFIG.MAX_RETRIES; attempt++) {
            try {
                if (this.isAborted) return;
                const res = await this._xhr(fd, chunkIndex);
                if (res.uploadId) this.uploadId = res.uploadId;
                return;
            } catch (e) {
                if (attempt === CONFIG.MAX_RETRIES - 1) throw e;
                await new Promise(r => setTimeout(r, CONFIG.RETRY_DELAY));
            }
        }
    }

    _xhr(formData, chunkIndex) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', CONFIG.ENDPOINTS.UPLOAD);
            const token = Utils.getCsrfToken();
            if (token) xhr.setRequestHeader('X-XSRF-TOKEN', token);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable && this.callbacks.onProgress) {
                    const loaded = (chunkIndex * CONFIG.CHUNK_SIZE) + e.loaded;
                    const pct = Math.min(100, (loaded / this.file.size) * 100);
                    this.callbacks.onProgress(pct);
                }
            };

            this.abortController.signal.addEventListener('abort', () => xhr.abort());
            
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try { resolve(JSON.parse(xhr.responseText)); } catch { resolve({}); }
                } else { reject(new Error(xhr.statusText)); }
            };
            xhr.onerror = () => reject(new Error("Network Error"));
            xhr.send(formData);
        });
    }
}

/**
 * --------------------------------------------------------------------------
 * CLASS: UploadQueue (Orchestrator)
 * --------------------------------------------------------------------------
 */
const UploadQueue = {
    queue: [],
    activeUploads: 0,
    activeInstances: {}, 

    // displayPath is optional, used for Tree View visualization
    add(file, parentId, displayPath = '') {
        UploadWidget.addItem(file, () => this.cancelSpecific(file.name));
        this.queue.push({ file, parentId, displayPath });
        this.process();
    },

    async process() {
        if (this.activeUploads >= CONFIG.MAX_PARALLEL_UPLOADS || this.queue.length === 0) return;

        const task = this.queue.shift();
        this.activeUploads++;

        const uploader = new FileUploader(task.file, task.parentId, {
            onProgress: (pct) => UploadWidget.updateProgress(task.file, pct),
            onSuccess: () => {
                this.activeUploads--;
                delete this.activeInstances[task.file.name];
                UploadWidget.updateStatus(task.file, 'success');
                
                // ADD TO TREE VIEW HERE
                BrowserTree.addFileNode(task.file, task.displayPath);
                
                this.process();
            },
            onError: (err) => {
                this.activeUploads--;
                delete this.activeInstances[task.file.name];
                UploadWidget.updateStatus(task.file, 'error');
                console.error(err);
                this.process();
            }
        });

        this.activeInstances[task.file.name] = uploader;
        uploader.start();
        this.process();
    },

    cancelSpecific(fileName) {
        if (this.activeInstances[fileName]) {
            this.activeInstances[fileName].abort();
            delete this.activeInstances[fileName];
            this.activeUploads--;
            this.process();
        } else {
            this.queue = this.queue.filter(t => t.file.name !== fileName);
        }
    },

    cancelAll() {
        Object.values(this.activeInstances).forEach(u => u.abort());
        this.activeInstances = {};
        this.queue = [];
        this.activeUploads = 0;
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
            // 1. Create Folder in Backend
            const newFolderId = await FolderManager.ensureFolderExists(entry.name, parentId);
            
            // 2. Update Visual Path
            const newPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
            
            // 3. Read Children
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
        for (const file of e.target.files) {
            UploadQueue.add(file, rootId, ''); // No subpath
        }
        fileInput.value = '';
    });

    // 3. FOLDER INPUT (webkitdirectory)
    folderInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        
        // This process might be slow for thousands of files if done sequentially in foreground.
        // For production, consider moving path resolution to the UploadQueue logic asynchronously.
        for (const file of files) {
            // file.webkitRelativePath = "Photos/Summer/img.jpg"
            const parts = file.webkitRelativePath.split('/');
            parts.pop(); // remove filename
            const folderPath = parts.join('/'); // "Photos/Summer"

            try {
                // Ensure backend folders exist
                const targetId = await FolderManager.resolvePathToId(folderPath, rootId);
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
                await traverseEntry(entry, rootId, '');
            }
        } else {
            // Fallback for simple file drag
            for (const file of e.dataTransfer.files) {
                UploadQueue.add(file, rootId, '');
            }
        }
    });
});