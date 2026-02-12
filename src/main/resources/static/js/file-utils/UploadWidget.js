'use strict';

import Utils from "./Utils.js";

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

        this.toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMinimize();
        });

        this.closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });
    },

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.el.classList.toggle('minimized', this.isMinimized);

        const svg = this.toggleBtn.querySelector('svg');
        if (svg) {
            this.isMinimized 
                ? svg.classList.add('rotate-180') 
                : svg.classList.remove('rotate-180');
        }
    },

    // COMPLETELY HIDE AND RESET
    close() {
        // 1. Add hidden class (triggers CSS translate down)
        this.el.classList.add('hidden');
        
        setTimeout(() => {
            this.body.innerHTML = ''; // Clear the list
            this.totalItems = 0;
            this.completedItems = 0;
            this.isMinimized = false; 
            this.el.classList.remove('minimized'); // Reset minimize state
            this.updateTitle(); // Reset title
            
            // Optional: If you have a queue manager, cancel downloads here
            // UploadQueue.cancelAll(); 
        }, 300);
    },

    show() {
        this.el.classList.remove('hidden');
        // If hidden, reset minimize state to show full list
        if (this.isMinimized && this.totalItems > 0) {
           this.isMinimized = false;
           this.el.classList.remove('minimized');
           // Reset arrow icon
           const svg = this.toggleBtn.querySelector('svg');
           if(svg) svg.classList.remove('rotate-180');
        }
    },

    getFileIconClass(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) return 'type-pdf';
        if (['xls', 'xlsx', 'csv'].includes(ext)) return 'type-xls';
        if (['doc', 'docx', 'txt'].includes(ext)) return 'type-doc';
        if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return 'type-img';
        return '';
    },

    addItem(file, onCancel) {
        this.totalItems++;
        this.updateTitle();
        this.show();

        const id = Utils.uploadId(file);
        const iconClass = this.getFileIconClass(file.name);

        const row = document.createElement('div');
        row.className = 'upload-row';
        row.id = id;

        row.innerHTML = `
            <div class="row-icon ${iconClass}">
                <svg viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM13 9V3.5L18.5 9H13z"/>
                </svg>
            </div>
            
            <div class="row-name" title="${file.name}">${file.name}</div>
            
            <div class="row-actions">
                <button class="cancel-btn" title="Cancel">
                    <svg viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="success-icon">
                    <svg viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <div class="error-icon">
                    <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
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
            if (onCancel) onCancel();
            this.updateStatus(file, 'cancelled');
        });
    },

    updateProgress(file, percent) {
        const row = document.getElementById(Utils.uploadId(file));
        if (row) {
            row.querySelector('.row-progress-fill').style.width = `${percent}%`;
        }
    },

    updateStatus(file, status) {
        const row = document.getElementById(Utils.uploadId(file));
        if (!row) return;

        if (status === 'success') {
            row.classList.add('completed');
            this.completedItems++;
            row.querySelector('.row-progress-fill').style.width = '100%';
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
                if (!this.isMinimized && this.completedItems === this.totalItems) {
                    this.toggleMinimize();
                }
            }, 3000);
        } else {
            this.title.textContent = `Uploading ${this.completedItems} of ${this.totalItems} items...`;
        }
    }
};

export default UploadWidget;