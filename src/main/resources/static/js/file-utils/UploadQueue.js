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
const UploadQueue = {
    queue: [],
    activeUploads: 0,
    activeInstances: {},

    pendingHighlights: new Set(),
    refreshTimer: null,
    wakeLock: null,

    async acquireWakeLock() {
        try {
            if ('wakeLock' in navigator && !this.wakeLock) {
                this.wakeLock = await navigator.wakeLock.request('screen');
                this.wakeLock.addEventListener('release', () => {
                    this.wakeLock = null;
                });
            }
        } catch (err) {
            console.warn('Could not acquire wake lock:', err);
        }
    },

    releaseWakeLock() {
        if (this.wakeLock) {
            this.wakeLock.release();
            this.wakeLock = null;
        }
    },

    checkQueueCompletion() {
        // Automatically release the wake lock when nothing is left to upload
        if (this.activeUploads === 0 && this.queue.length === 0) {
            this.releaseWakeLock();
        }
    },

    add(file, parentId, displayPath = '') {
        this.acquireWakeLock(); // Corrected: added 'this.'
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
                if (String(task.parentId) === String(currentViewId)) {
                    this.scheduleRefresh(task.contextViewId, newFileId);
                }

                this.checkQueueCompletion();
                this.process();
            },
            onError: (err) => {
                this.activeUploads--;
                delete this.activeInstances[task.file.name];
                UploadWidget.updateStatus(task.file, 'error');
                console.error(err);

                this.checkQueueCompletion();
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
            this.checkQueueCompletion();
            this.process();
        } else {
            this.queue = this.queue.filter(t => t.file.name !== fileName);
            this.checkQueueCompletion();
        }
    },

    cancelAll() {
        Object.values(this.activeInstances).forEach(u => u.abort());
        this.activeInstances = {};
        this.queue = [];
        this.activeUploads = 0;
        this.pendingHighlights.clear();
        this.releaseWakeLock();
    },

    scheduleRefresh(targetViewId, newItemId = null) {
        if (newItemId) {
            this.pendingHighlights.add(String(newItemId));
        }

        if (this.refreshTimer) clearTimeout(this.refreshTimer);

        this.refreshTimer = setTimeout(async () => {
            const currentViewId = Utils.getCurrentFolderId();

            if (String(targetViewId) === String(currentViewId)) {
                await FileExplorer.loadFolder(currentViewId, false);

                if (this.pendingHighlights.size > 0) {
                    this.highlightItems(Array.from(this.pendingHighlights));
                    this.pendingHighlights.clear();
                }
            } else {
                this.pendingHighlights.clear();
            }
        }, 500);
    },

    highlightItems(ids) {
        setTimeout(() => {
            ids.forEach(id => {
                const el = document.querySelector(`li[data-id="${id}"]`);
                if (el) el.classList.add('highlight-new');
            });

            const lastId = ids[ids.length - 1];
            const lastEl = document.querySelector(`li[data-id="${lastId}"]`);
            if (lastEl) {
                lastEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 250);
    }
};

// Re-acquire lock if user switches back to this tab while uploads are running
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && (UploadQueue.activeUploads > 0 || UploadQueue.queue.length > 0)) {
        UploadQueue.acquireWakeLock();
    }
});

export default UploadQueue;