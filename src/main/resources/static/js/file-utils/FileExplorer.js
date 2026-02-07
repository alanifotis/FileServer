'use strict';

import Utils from "./Utils.js";

const FileExplorer = {
    listEl: document.getElementById('file-list'),
    breadcrumbEl: document.getElementById('breadcrumbs'),

    init() {
        window.onpopstate = (event) => {
            const folderId = event.state ? event.state.folderId : Utils.getCurrentFolderId();
            this.loadFolder(folderId, false);
        };

        const initialId = Utils.getCurrentFolderId();

        this.loadFolder(initialId, false); 
    },

    async loadFolder(folderId, pushToHistory = true) {
        this.listEl.innerHTML = `
            <li class="empty-state">
                <div class="spinner"></div>
                <p>Loading...</p>
            </li>`;

        try {
            console.log(`The folderId is: ${folderId}`);
            const res = await fetch('/api/files/ls', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': Utils.getCsrfToken() 
                },
                body: JSON.stringify({ folderId: folderId ? String(folderId) : null })
            });
            
            if (!res.ok) throw new Error("Failed to load");
            const data = await res.json();

            if (pushToHistory) {
                const url = folderId ? `/folder/${folderId}` : '/';
                history.pushState({ folderId }, '', url);
            }

            this.renderBreadcrumbs(data.path);
            this.renderList(data.content);

        } catch (err) {
            console.error(err);
            this.listEl.innerHTML = '<li class="empty-state"><p>Error loading folder</p></li>';
        }
    },

    renderBreadcrumbs(path) {
        this.breadcrumbEl.innerHTML = '';
        path.forEach((crumb, index) => {
            const li = document.createElement('li');
            const isLast = index === path.length - 1;
            
            if (isLast) {
                li.innerHTML = `<span class="current">${crumb.name}</span>`;
            } else {
                li.innerHTML = `<a href="#" class="crumb-link">${crumb.name}</a> <span class="separator">/</span>`;
                li.querySelector('a').onclick = (e) => {
                    e.preventDefault();
                    this.loadFolder(crumb.id);
                };
            }
            this.breadcrumbEl.appendChild(li);
        });
    },

    renderList(items) {
        this.listEl.innerHTML = '';
        if (!items.length) {
            this.listEl.innerHTML = `<li class="empty-state"><p>This folder is empty</p></li>`;
            return;
        }

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'tree-item';
            li.setAttribute('data-id', item.id);
            li.onclick = () => {
                if(item.isFolder) this.loadFolder(item.id);
                else window.open(`/api/files/download/${item.id}`, '_blank');
            };

            const icon = item.isFolder 
                ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="#FFC107"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`
                : `<svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/></svg>`;

            li.innerHTML = `
                <div class="tree-row">
                    <span class="col-icon">${icon}</span>
                    <span class="col-name">${item.name}</span>
                    <span class="col-date">${item.createdAt || '-'}</span>
                    <span class="col-size">${item.isFolder ? '-' : Utils.formatBytes(item.size)}</span>
                </div>
            `;
            this.listEl.appendChild(li);
        });
    }
};

export default FileExplorer;