'use strict';
import Utils from "./Utils.js";
import FileUploader from './FileUploader.js';
import UploadWidget from "./UploadWidget.js";
import CONFIG from "./MainConfig.js";
import FileExplorer from "./FileExplorer.js";


/**
 * --------------------------------------------------------------------------
 * CLASS: UploadQueue (Orchestrator)
 * --------------------------------------------------------------------------
 */

/**
 * --------------------------------------------------------------------------
 * CLASS: UploadQueue (Orchestrator)
 * --------------------------------------------------------------------------
 */
const UploadQueue = {
    queue: [],
    activeUploads: 0,
    activeInstances: {},
    
    // New: Accumulator for IDs to highlight
    pendingHighlights: new Set(), 
    refreshTimer: null,

    // displayPath is optional, used for Tree View visualization
    add(file, parentId, displayPath = '') {
        const contextViewId = Utils.getCurrentFolderId();
        UploadWidget.addItem(file, () => this.cancelSpecific(file.name));
        this.queue.push({ file, parentId, displayPath, contextViewId });
        this.process();
    },

    async process() {
        if (this.activeUploads >= CONFIG.MAX_PARALLEL_UPLOADS || this.queue.length === 0) return;

        const task = this.queue.shift();
        this.activeUploads++;

        const uploader = new FileUploader(task.file, task.parentId, {
            onProgress: (pct) => UploadWidget.updateProgress(task.file, pct),
            onSuccess: (response) => {
                this.activeUploads--;
                delete this.activeInstances[task.file.name];
                UploadWidget.updateStatus(task.file, 'success');

                let newFileId = null;
                if (response) {
                    newFileId = response.id ? response.id : response.fileId;
                }

                const currentViewId = Utils.getCurrentFolderId();

                // Only schedule a refresh if the upload happened in the current folder
                if (String(task.parentId) === String(currentViewId)) {
                    this.scheduleRefresh(task.contextViewId, newFileId);
                }

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
        this.pendingHighlights.clear();
    },

    scheduleRefresh(targetViewId, newItemId = null) {
        // 1. Add the new ID to our pending set
        if (newItemId) {
            this.pendingHighlights.add(String(newItemId));
        }

        // 2. Debounce the refresh call
        if (this.refreshTimer) clearTimeout(this.refreshTimer);

        this.refreshTimer = setTimeout(async () => {
            const currentViewId = Utils.getCurrentFolderId();

            if (String(targetViewId) === String(currentViewId)) {
                console.log(`✅ Context match. Refreshing view.`);

                // 3. Reload the folder
                await FileExplorer.loadFolder(currentViewId, false);

                // 4. Highlight ALL pending items
                if (this.pendingHighlights.size > 0) {
                    this.highlightItems(Array.from(this.pendingHighlights));
                    
                    // 5. Clear the set for the next batch
                    this.pendingHighlights.clear();
                }
            } else {
                // If view changed, just clear the highlights
                this.pendingHighlights.clear();
            }
        }, 500); // 500ms debounce window
    },

    highlightItems(ids) {
        // Wait slightly for DOM to render after loadFolder
        setTimeout(() => {
            ids.forEach(id => {
                const el = document.querySelector(`li[data-id="${id}"]`);

                if (el) {
                    // Add class for animation
                    el.classList.add('highlight-new');
                } else {
                    console.warn(`❌ Highlight failed: No element found with [data-id="${id}"]`);
                }
            });

            // Scroll to the LAST added item so the user sees activity
            const lastId = ids[ids.length - 1];
            const lastEl = document.querySelector(`li[data-id="${lastId}"]`);
            if (lastEl) {
                lastEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

        }, 250);
    }
};

export default UploadQueue;