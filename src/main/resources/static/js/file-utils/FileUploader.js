/**
 * --------------------------------------------------------------------------
 * CLASS: FileUploader (Single File Chunk Logic)
 * --------------------------------------------------------------------------
 */

'use strict';

import CONFIG from "./MainConfig.js";
import Utils from "./Utils.js";

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
            let lastResponse = {};
            for (let i = 0; i < this.totalChunks; i++) {
                if (this.isAborted) throw new Error("Cancelled");
                lastResponse = await this._uploadChunk(i);
            }
            if (this.callbacks.onSuccess) this.callbacks.onSuccess(lastResponse);
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
            if (this.isAborted) throw new Error("Cancelled");

            try {
                const res = await this._xhr(fd, chunkIndex);

                if (this.isAborted) throw new Error("Cancelled");

                if (res.uploadId) this.uploadId = res.uploadId;
                return res;

            } catch (e) {
                if (this.isAborted) throw e;

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

            xhr.onerror = () => {
                reject(new Error("Network Error"));
            };

            xhr.send(formData);
        });
    }
}

export default FileUploader