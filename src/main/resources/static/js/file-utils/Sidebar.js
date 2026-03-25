'use strict';

import Utils from "./Utils.js";
import FileExplorer from "./FileExplorer.js";

const Sidebar = {
    el: document.getElementById('sidebar-tree'),
    isInitialized: false,

    init(initialData) {
        if (!this.el || this.isInitialized) return;
        this.isInitialized = true;

        // 1. Build the permanent "Home" anchor
        this.buildRootNode();

        // 2. Grab the `ul` we just created inside the Home node
        const rootUl = document.getElementById('sidebar-root-ul');

        // 3. Inject the data
        if (initialData) {
            this.renderNodes(initialData, rootUl);
        } else {
            this.loadNode(null, rootUl);
        }
    },

    buildRootNode() {
        this.el.innerHTML = ''; // Clear the container
        
        const li = document.createElement('li');
        
        const itemDiv = document.createElement('div');
        // Give it the 'selected' class by default, and a custom data-id of 'root'
        itemDiv.className = 'tree-node-item selected';
        itemDiv.dataset.id = 'root'; 

        const chevronIcon = `<div class="tree-toggle expanded"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>`;
        const folderIcon = `<div class="tree-icon"><svg viewBox="0 0 24 24" fill="#FFC107"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg></div>`;

        itemDiv.innerHTML = `${chevronIcon}${folderIcon}<span class="tree-name" title="Home">Home</span>`;
        li.appendChild(itemDiv);

        const childUl = document.createElement('ul');
        childUl.className = 'expanded';
        childUl.id = 'sidebar-root-ul'; // We need this ID to inject the first level of folders
        li.appendChild(childUl);

        // Click Handlers for Home
        const toggleBtn = itemDiv.querySelector('.tree-toggle');
        const nameLabel = itemDiv.querySelector('.tree-name');
        const iconElement = itemDiv.querySelector('.tree-icon');

        const toggleNode = (e) => {
            e.stopPropagation();
            const isExpanded = childUl.classList.contains('expanded');
            
            if (isExpanded) {
                childUl.classList.remove('expanded');
                toggleBtn.classList.remove('expanded');
            } else {
                childUl.classList.add('expanded');
                toggleBtn.classList.add('expanded');
                
                if (childUl.children.length === 0) {
                    childUl.innerHTML = '<li class="tree-node-item tree-loading">Loading...</li>';
                    this.loadNode(null, childUl); // Load root contents
                }
            }
        };

        toggleBtn.addEventListener('click', toggleNode);
        iconElement.addEventListener('click', toggleNode);

        nameLabel.addEventListener('click', (e) => {
            e.stopPropagation();
            
            this.setActiveFolder(null); // Tell sidebar we are at Home

            if (!childUl.classList.contains('expanded')) {
                toggleNode(e);
            }

            FileExplorer.loadFolder(null); // Sync main view
        });

        this.el.appendChild(li);
    },

    setActiveFolder(folderId) {
        // Clear all highlights
        document.querySelectorAll('.tree-node-item').forEach(el => el.classList.remove('selected'));
        
        // Find the node to highlight. If folderId is null, we look for our 'root' node.
        const targetId = folderId === null ? 'root' : folderId;
        const targetEl = document.querySelector(`.tree-node-item[data-id="${targetId}"]`);
        
        if (targetEl) {
            targetEl.classList.add('selected');
        }
    },

    async loadNode(folderId, parentElement) {
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
            
            if (!res.ok) throw new Error("Failed to load tree node");
            const data = await res.json();

            this.renderNodes(data.content, parentElement);

        } catch (err) {
            console.error("Sidebar Error:", err);
            parentElement.innerHTML = '<li class="tree-node-item tree-error">Error loading</li>';
        }
    },

    renderNodes(items, parentElement) {
        parentElement.innerHTML = ''; 
        if (!items || !items.length) return;

        const folders = items.filter(item => item.isFolder === true);
        folders.sort((a, b) => a.name.localeCompare(b.name));

        if (folders.length === 0) {
             parentElement.innerHTML = '<li class="tree-node-item tree-empty-state">No folders</li>';
             return;
        }

        folders.forEach(item => {
            const li = document.createElement('li');
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'tree-node-item';
            itemDiv.dataset.id = item.id;

            const chevronIcon = `<div class="tree-toggle"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>`;
            const folderIcon = `<div class="tree-icon"><svg viewBox="0 0 24 24" fill="#FFC107"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg></div>`;

            itemDiv.innerHTML = `${chevronIcon}${folderIcon}<span class="tree-name" title="${item.name}">${item.name}</span>`;
            li.appendChild(itemDiv);

            const childUl = document.createElement('ul');
            li.appendChild(childUl);
            
            const toggleBtn = itemDiv.querySelector('.tree-toggle');
            const nameLabel = itemDiv.querySelector('.tree-name');
            const iconElement = itemDiv.querySelector('.tree-icon');

            const toggleNode = (e) => {
                e.stopPropagation();
                const isExpanded = childUl.classList.contains('expanded');
                
                if (isExpanded) {
                    childUl.classList.remove('expanded');
                    toggleBtn.classList.remove('expanded');
                } else {
                    childUl.classList.add('expanded');
                    toggleBtn.classList.add('expanded');
                    
                    if (childUl.children.length === 0) {
                        childUl.innerHTML = '<li class="tree-node-item tree-loading">Loading...</li>';
                        this.loadNode(item.id, childUl);
                    }
                }
            };

            toggleBtn.addEventListener('click', toggleNode);
            iconElement.addEventListener('click', toggleNode);

            nameLabel.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Use the centralized method to set the highlight
                this.setActiveFolder(item.id);

                if (!childUl.classList.contains('expanded')) {
                    toggleNode(e);
                }

                FileExplorer.loadFolder(item.id);
            });

            parentElement.appendChild(li);
        });
    }
};

export default Sidebar;