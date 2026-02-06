'use strict'

const Utils = {
    getCsrfToken: () => {
        const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN\s*=\s*([^;]+)/);
        return match ? match[1] : null;
    },
    getCurrentFolderId: () => {
        const match = window.location.pathname.match(/\/folders?\/(\d+)/);
        
        if (match && match[1]) {
            return match[1];
        }
        
        return null;
    },
    formatBytes: (bytes) => {
        if (!+bytes) return '0 B';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${['B', 'KB', 'MB', 'GB'][i]}`;
    },

    safeDomId: (str) => 'node-' + btoa(unescape(encodeURIComponent(str))).replace(/[^a-zA-Z0-9]/g, ''),

    uploadId: (file) => 'u-' + file.name.replace(/[^a-zA-Z0-9]/g, '') + '-' + file.size
};

export default Utils;