'use strict';

const Utils = {
    /**
     * Retrieves the XSRF-TOKEN from cookies.
     * essential for Spring Security CSRF protection.
     */
    getCsrfToken: () => {
        const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN\s*=\s*([^;]+)/);
        return match ? decodeURIComponent(match[1]) : null;
    },

    /**
     * Extracts the folder ID from the URL.
     * Supports:
     * 1. Path style: /folder/123
     * 2. Query style: ?folderId=123 or ?id=123
     */
    getCurrentFolderId: () => {
        // 1. Check Path (e.g., /folder/123)
        const pathMatch = window.location.pathname.match(/\/folder\/(\d+)/);
        if (pathMatch && pathMatch[1]) {
            return pathMatch[1];
        }

        // 2. Check Query Params (e.g., ?folderId=123)
        const params = new URLSearchParams(window.location.search);
        
        // Return 'folderId' OR 'id' OR null
        return params.get('folderId') || params.get('id') || null;
    },

    /**
     * Formats bytes into human-readable strings (KB, MB, GB)
     */
    formatBytes: (bytes) => {
        if (!+bytes) return '0 B'; // Handles 0, null, undefined, NaN
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${['B', 'KB', 'MB', 'GB'][i]}`;
    },

    /**
     * Generates a safe ID for DOM elements
     */
    safeDomId: (str) => 'node-' + btoa(unescape(encodeURIComponent(str))).replace(/[^a-zA-Z0-9]/g, ''),

    /**
     * Generates a unique ID for file uploads
     */
    uploadId: (file) => 'u-' + file.name.replace(/[^a-zA-Z0-9]/g, '') + '-' + file.size
};

export default Utils;