// Configuration - Change this to your server URL when deploying
const API_BASE_URL = window.location.origin; // Uses current domain
// For local development: const API_BASE_URL = 'http://localhost:5000';

// Authentication state
let currentUser = null;

// Utility function to make API calls
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    } else {
        alert(message);
    }
}

// Hide error message
function hideError() {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(event) {
    event.preventDefault();
    hideError();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    try {
        const response = await apiCall('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (response.user) {
            currentUser = response.user;
            localStorage.setItem('edumanage_user', JSON.stringify(currentUser));
            window.location.href = 'dashboard.html';
        } else {
            showError('Invalid response from server');
        }
    } catch (error) {
        showError('Login failed. Please check your credentials.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
}

// Check authentication status
function checkAuth() {
    const savedUser = localStorage.getItem('edumanage_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = currentUser.name || currentUser.email;
        }
    } else if (window.location.pathname.includes('dashboard')) {
        window.location.href = 'index.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('edumanage_user');
    currentUser = null;
    window.location.href = 'index.html';
}

// Dashboard functionality
async function loadDashboard() {
    try {
        // Load system stats
        await loadSystemStats();
        // Load initial tab data (users)
        await loadUsers();
    } catch (error) {
        console.error('Failed to load dashboard:', error);
        showError('Failed to load dashboard data');
    }
}

async function loadSystemStats() {
    try {
        const stats = await apiCall('/api/admin/system-stats');
        
        document.getElementById('totalStudents').textContent = stats.totalStudents || 0;
        document.getElementById('totalTeachers').textContent = stats.totalTeachers || 0;
        document.getElementById('totalSections').textContent = stats.totalSections || 0;
        document.getElementById('activeUsers').textContent = stats.activeUsers || 0;
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

async function loadUsers() {
    try {
        const users = await apiCall('/api/admin/users');
        const tableHtml = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name || 'N/A'}</td>
                            <td>${user.email}</td>
                            <td>${user.role || 'N/A'}</td>
                            <td>${user.isActive ? 'Active' : 'Inactive'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('usersTable').innerHTML = tableHtml;
    } catch (error) {
        document.getElementById('usersTable').innerHTML = '<p class="error-message">Failed to load users</p>';
    }
}

async function loadAnnouncements() {
    try {
        const announcements = await apiCall('/api/announcements');
        const tableHtml = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Date Posted</th>
                    </tr>
                </thead>
                <tbody>
                    ${announcements.map(announcement => `
                        <tr>
                            <td>${announcement.id}</td>
                            <td>${announcement.title}</td>
                            <td>${announcement.content.substring(0, 100)}${announcement.content.length > 100 ? '...' : ''}</td>
                            <td>${new Date(announcement.datePosted).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('announcementsTable').innerHTML = tableHtml;
    } catch (error) {
        document.getElementById('announcementsTable').innerHTML = '<p class="error-message">Failed to load announcements</p>';
    }
}

async function loadNews() {
    try {
        const news = await apiCall('/api/news');
        const tableHtml = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Summary</th>
                        <th>Date Posted</th>
                    </tr>
                </thead>
                <tbody>
                    ${news.map(item => `
                        <tr>
                            <td>${item.id}</td>
                            <td>${item.title}</td>
                            <td>${item.summary ? item.summary.substring(0, 100) : 'No summary'}${item.summary && item.summary.length > 100 ? '...' : ''}</td>
                            <td>${new Date(item.datePosted).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('newsTable').innerHTML = tableHtml;
    } catch (error) {
        document.getElementById('newsTable').innerHTML = '<p class="error-message">Failed to load news</p>';
    }
}

async function loadEvents() {
    try {
        const events = await apiCall('/api/events');
        const tableHtml = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    ${events.map(event => `
                        <tr>
                            <td>${event.id}</td>
                            <td>${event.title}</td>
                            <td>${event.description ? event.description.substring(0, 100) : 'No description'}${event.description && event.description.length > 100 ? '...' : ''}</td>
                            <td>${event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}</td>
                            <td>${event.location || 'TBD'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('eventsTable').innerHTML = tableHtml;
    } catch (error) {
        document.getElementById('eventsTable').innerHTML = '<p class="error-message">Failed to load events</p>';
    }
}

// Tab functionality
function showTab(tabName) {
    // Hide all tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.nav-tab');
    tabButtons.forEach(button => button.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Load data for the selected tab
    switch(tabName) {
        case 'users':
            if (document.getElementById('usersTable').innerHTML.includes('Loading')) {
                loadUsers();
            }
            break;
        case 'announcements':
            if (document.getElementById('announcementsTable').innerHTML.includes('Loading')) {
                loadAnnouncements();
            }
            break;
        case 'news':
            if (document.getElementById('newsTable').innerHTML.includes('Loading')) {
                loadNews();
            }
            break;
        case 'events':
            if (document.getElementById('eventsTable').innerHTML.includes('Loading')) {
                loadEvents();
            }
            break;
    }
}