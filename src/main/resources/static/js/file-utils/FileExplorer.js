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

        // Handles the "Refresh" case by reading the ID from the URL on page load
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
            const targetUrl = new URL('/api/files/ls', window.location.origin);
            if (folderId) {
                targetUrl.searchParams.set('folderId', folderId);
            }

            const res = await fetch(targetUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': Utils.getCsrfToken() 
                }
            });
            
            if (!res.ok) throw new Error("Failed to load");
            const data = await res.json();

            if (pushToHistory) {
                history.pushState({ folderId }, '', targetUrl);
            }

            // 4. Render
            this.renderBreadcrumbs(data.path);
            this.renderList(data.content);

        } catch (err) {
            console.error(err);
            this.listEl.innerHTML = '<li class="empty-state"><p>Error loading folder</p></li>';
        }
    },

    renderBreadcrumbs(path) {
        this.breadcrumbEl.innerHTML = '';
        
        const chevronIcon = `<svg class="separator-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>`;

        const homeLi = document.createElement('li');
        
        if (!path[0].id) {
            homeLi.innerHTML = `<span class="current">Home</span>`;
            this.breadcrumbEl.appendChild(homeLi);
            return;
        } 
        
        homeLi.innerHTML = `
            <a href="/" class="crumb-link">Home</a> 
            ${chevronIcon}
        `;
        
        homeLi.querySelector('a').onclick = (e) => {
            e.preventDefault();
            this.loadFolder(null);
        };

        this.breadcrumbEl.appendChild(homeLi);

        path.forEach((crumb, index) => {
            const li = document.createElement('li');
            const isLast = index === path.length - 1;
            
            if (isLast) {
                li.innerHTML = `<span class="current">${crumb.name}</span>`;
            } else {
                li.innerHTML = `
                    <a href="/api/files/ls?folderId=${crumb.id}" class="crumb-link">${crumb.name}</a> 
                    ${chevronIcon}
                `;
                
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
        if (!items || !items.length) {
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