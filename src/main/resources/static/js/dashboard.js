'use strict';

import createPolicy from './utils/policy-creator.js';

createPolicy();

const regex = /(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/;
function getCsrfToken() { return document.cookie.replace(regex, '$1'); }

document.addEventListener('DOMContentLoaded', async () => {

    // 1. Your Backend Data
    const userData = await fetch('/api/me', {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
    })
        .then(response => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then((data) => {  return data; })
        .catch((error) => { console.error('Error:', error) });

    populateDashboard(userData);
}

);

function populateDashboard(user) {
    // --- 1. Text Fields ---
    document.querySelector('.user-name').textContent = user.displayName;
    document.querySelector('.user-email').textContent = user.email;
    document.querySelector('.plan-badge').textContent = user.planTier + " PLAN";

    // Form Inputs
    document.getElementById('display-name').placeholder = user.displayName;
    document.getElementById('email').placeholder = user.email;

    // --- 2. Avatar Logic (Initials + Color) ---
    const avatarEl = document.querySelector('.avatar-content');
    if (user.avatarUrl) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const contentDiv = document.querySelector('.avatar-content');
            contentDiv.innerHTML = `<img src="${e.target.result}" alt="Avatar">`;
        }

        reader.readAsDataURL(user.avatarUrl);
        avatarEl.innerHTML = `<img src="${user.avatarUrl}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    } else {
        const initials = getInitials(user.displayName || user.email);
        avatarEl.textContent = initials;
        // Generate a consistent pastel color based on the name
        avatarEl.style.backgroundColor = stringToColor(user.email);
        avatarEl.style.color = 'white';
    }

    const usedBytes = user.storageUsedBytes;
    document.querySelector('.storage-amount').textContent = formatBytes(usedBytes);

    const rootLink = document.querySelector('.root-link');
}

// --- Helpers ---

const reg1 = /(\b\S)?/g;
const reg2 = /(^\S|\S$)?/g;

/**
 * @param {string} name 
 */
function getInitials(name) {
    try {
        const match = 
            name.match(reg1)
            .join("")
            .match(reg2)
            .join("")
            .toUpperCase();
        return match;
    } catch (error) {
        console.log(error);
        return '';
    }

}

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function stringToColor(str) {
    let hash = 0;
    if (str) {
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
    }

    return `hsl(${hash % 360}, 70%, 45%)`;
}

const avatatIcon = document.querySelector('.avatar-input');


avatatIcon.addEventListener('change', function (event) {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = function (e) {
            const contentDiv = document.querySelector('.avatar-content');
            contentDiv.innerHTML = `<img src="${e.target.result}" alt="Avatar">`;
        }

        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append("avatar", file)


        fetch('/api/files/set-avatar', {
            method: 'POST',
            headers: { 'X-XSRF-TOKEN': getCsrfToken() },
            body: formData
        })
            .then(response => {
                if (!response.ok) throw new Error(response.status);
                return response.json();
            })
            .then((data) => { console.log('Success:', data) })
            .catch((error) => { console.error('Error:', error) });
    }
});