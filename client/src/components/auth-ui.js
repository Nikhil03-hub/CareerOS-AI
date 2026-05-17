/**
 * Unified Authentication UI System
 * Handles auth state, UI rendering (button/avatar), and profile management
 */

const API_BASE_URL = 'http://localhost:8000';
const USER_STORAGE_KEYS = [
    'user',
    'auroraUser',
    'careerOSUser',
    'careerosUser',
    'currentUser',
    'googleUser',
    'studentProfile',
    'profile'
];
const TOKEN_STORAGE_KEYS = ['jc_token', 'jwt', 'authToken', 'token', 'accessToken', 'googleAccessToken'];

function safeParseStoredValue(value) {
    if (!value) return null;
    if (typeof value !== 'string') return value;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

function normalizeStoredUser(value) {
    if (!value) return null;
    const parsed = safeParseStoredValue(value);
    const source = parsed?.user || parsed?.profile || parsed?.data?.user || parsed?.data || parsed;
    if (!source || typeof source !== 'object') {
        if (typeof parsed === 'string' && parsed.includes('@')) {
            return { name: parsed, displayName: parsed, email: parsed, provider: 'local' };
        }
        return null;
    }

    const firstName = source.firstName || source.given_name || '';
    const lastName = source.lastName || source.family_name || '';
    const composedName = `${firstName} ${lastName}`.trim();
    const displayName = source.displayName || source.name || composedName || source.email || 'CareerOS User';
    const photoURL = source.photoURL || source.picture || source.avatar || source.image || '';

    if (!displayName && !source.email && !photoURL) return null;

    return {
        ...source,
        name: displayName,
        displayName,
        firstName,
        lastName,
        email: source.email || '',
        photoURL,
        picture: source.picture || photoURL,
        avatar: source.avatar || photoURL,
        provider: source.provider || 'career-os-session'
    };
}

function getStoredToken() {
    for (const key of TOKEN_STORAGE_KEYS) {
        const token = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (token) return token;
    }
    return null;
}

// Auth state management
const AuthUI = {
    decodeTokenPayload(token) {
        try {
            if (!token || token.split('.').length !== 3) return null;
            const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(payload));
        } catch (e) {
            return null;
        }
    },

    // Get current user from localStorage
    getCurrentUser() {
        try {
            const stores = [localStorage, sessionStorage];
            for (const store of stores) {
                for (const key of USER_STORAGE_KEYS) {
                    const user = normalizeStoredUser(store.getItem(key));
                    if (user) return user;
                }
            }

            const token = getStoredToken();
            const payload = this.decodeTokenPayload(token);
            if (payload) {
                return {
                    name: payload.name || payload.displayName || payload.email || 'CareerOS User',
                    displayName: payload.name || payload.displayName || payload.email || 'CareerOS User',
                    email: payload.email || '',
                    picture: payload.picture || payload.avatar || payload.photoURL || ''
                };
            }
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
        return null;
    },

    // Check if user is logged in
    isLoggedIn() {
        const user = this.getCurrentUser();
        const token = getStoredToken();
        return !!user || !!token;
    },

    // Save user data
    saveUser(userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('auroraUser', JSON.stringify(userData));
    },

    // Clear auth data
    clearAuth() {
        [...USER_STORAGE_KEYS, 'auroraProfile'].forEach((key) => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });
        TOKEN_STORAGE_KEYS.forEach((key) => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });
    },

    // Get user profile photo or default
    getUserAvatar(user) {
        if (user && user.photoURL) {
            return user.photoURL;
        }
        if (user && user.avatar) {
            return user.avatar;
        }
        if (user && user.picture) {
            return user.picture;
        }
        // Default avatar SVG
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NjY2NjYiLz4KPHBhdGggZD0iTTIwIDEwQzIyLjc2MTQgMTAgMjUgMTIuMjM4NiAyNSAxNUMyNSAxNy43NjE0IDIyLjc2MTQgMjAgMjAgMjBDMTcuMjM4NiAyMCAxNSAxNy43NjE0IDE1IDE1QzE1IDEyLjIzODYgMTcuMjM4NiAxMCAyMCAxMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCAyNUMxNS4wMjk0IDI1IDExIDI3LjIzODYgMTEgMzBIMjlDMjkgMjcuMjM4NiAyNC45NzA2IDI1IDIwIDI1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
    },

    // Render auth UI (button or avatar)
    renderAuthUI(containerSelector, options = {}) {
        let container;
        if (typeof containerSelector === 'string') {
            container = document.querySelector(containerSelector);
        } else {
            container = containerSelector; // Direct element
        }
        if (!container) return;

        const {
            signupUrl = 'signup.html',
            profileUrl = '/graduate/dashboard/#view-profile',
            buttonClass = 'btn-header',
            avatarSize = 40,
            publicMode = container.getAttribute('data-public-auth') === 'true'
        } = options;

        const isLoggedIn = this.isLoggedIn();
        const user = this.getCurrentUser();

        // Clear container
        container.innerHTML = '';

        if (isLoggedIn && user) {
            // Dropdown styles injection (idempotent)
            if (!document.getElementById('auth-dropdown-styles')) {
                const styleSheet = document.createElement("style");
                styleSheet.id = 'auth-dropdown-styles';
                styleSheet.textContent = `
                    .auth-profile-dropdown-wrapper {
                        position: relative;
                        display: inline-block;
                        z-index: 1000;
                    }
                    .auth-avatar-btn {
                        transition: all 0.2s ease;
                        position: relative;
                        z-index: 1001;
                    }
                    .auth-avatar-btn:hover {
                        transform: scale(1.05);
                        border-color: rgba(255, 255, 255, 0.4) !important;
                    }
                    .auth-dropdown-menu {
                        position: absolute;
                        top: calc(100% + 12px);
                        right: 0;
                        width: 200px;
                        background: rgba(255, 255, 255, 0.9);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border-radius: 16px;
                        box-shadow: 
                            0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                            0 2px 4px -1px rgba(0, 0, 0, 0.06),
                            0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                            0 10px 10px -5px rgba(0, 0, 0, 0.04);
                        padding: 8px;
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                        border: 1px solid rgba(255, 255, 255, 0.6);
                        opacity: 0;
                        transform: translateY(-10px) scale(0.95);
                        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                        visibility: hidden;
                        transform-origin: top right;
                    }
                    .auth-dropdown-menu.active {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                        visibility: visible;
                    }
                    .auth-dropdown-item {
                        padding: 12px 16px;
                        border-radius: 10px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        font-size: 14px;
                        font-weight: 500;
                        color: #1f2937;
                        transition: all 0.2s ease;
                        text-decoration: none;
                    }
                    .auth-dropdown-item:hover {
                        background: rgba(0, 0, 0, 0.04);
                        color: #000;
                        transform: translateX(4px);
                    }
                    .auth-dropdown-item i {
                        width: 20px;
                        text-align: center;
                        color: #6b7280;
                        font-size: 14px;
                        transition: color 0.2s;
                    }
                    .auth-dropdown-item:hover i {
                        color: #2563eb;
                    }
                    .auth-dropdown-divider {
                        height: 1px;
                        background: rgba(0,0,0,0.06);
                        margin: 4px 8px;
                    }
                `;
                document.head.appendChild(styleSheet);
            }

            // Wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'auth-profile-dropdown-wrapper';

            // Avatar Button
            const avatar = document.createElement('div');
            avatar.className = 'auth-avatar-btn';
            avatar.style.cssText = `
                width: ${avatarSize}px;
                height: ${avatarSize}px;
                border-radius: 50%;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border: 2px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            `;

            const img = document.createElement('img');
            img.src = this.getUserAvatar(user);
            img.alt = user.displayName || user.name || 'User';
            img.referrerPolicy = 'no-referrer';  // Fix Google picture CORS
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
            `;
            img.onerror = function () {
                this.src = AuthUI.getUserAvatar(null);
            };

            avatar.appendChild(img);
            wrapper.appendChild(avatar);

            // Menu
            const menu = document.createElement('div');
            menu.className = 'auth-dropdown-menu';

            // View Profile
            const viewProfileEnh = document.createElement('a');
            viewProfileEnh.className = 'auth-dropdown-item';
            viewProfileEnh.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = profileUrl;
                toggleMenu(false);
            };
            viewProfileEnh.innerHTML = `<i class="fa-solid fa-user"></i>View Profile`;
            menu.appendChild(viewProfileEnh);

            // Divider
            const divider = document.createElement('div');
            divider.className = 'auth-dropdown-divider';
            menu.appendChild(divider);

            // Logout
            const logoutEnh = document.createElement('div');
            logoutEnh.className = 'auth-dropdown-item';
            logoutEnh.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                AuthUI.logout();
                toggleMenu(false);
            };
            logoutEnh.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i>Log out`;
            menu.appendChild(logoutEnh);

            wrapper.appendChild(menu);

            // Toggle Logic
            const toggleMenu = (show) => {
                if (show) {
                    menu.classList.add('active');
                } else {
                    menu.classList.remove('active');
                }
            };

            avatar.onclick = (e) => {
                e.stopPropagation();
                const isActive = menu.classList.contains('active');
                toggleMenu(!isActive);
            };

            // Close on click outside
            if (!window.authDropdownGlobalListener) {
                document.addEventListener('click', (e) => {
                    document.querySelectorAll('.auth-dropdown-menu.active').forEach(m => {
                        m.classList.remove('active');
                    });
                });
                window.authDropdownGlobalListener = true;
            }

            container.appendChild(wrapper);

        } else {
            if (publicMode) {
                container.innerHTML = '';
                return;
            }

            // Render Signup/Signin button
            const button = document.createElement('a');
            button.href = signupUrl;
            button.className = buttonClass;

            // Check if button class suggests it needs a span wrapper (like primary-btn)
            if (buttonClass.includes('primary-btn') || buttonClass.includes('cta-magnet')) {
                const span = document.createElement('span');
                span.className = 'cta-inner flex items-center gap-2';
                span.textContent = 'Signup / Signin';
                button.appendChild(span);
            } else {
                button.textContent = 'Signup / Signin';
            }

            button.style.cssText = `
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            `;
            container.appendChild(button);
        }
    },

    // Auto-fill profile form from user data
    autoFillProfileForm() {
        const user = this.getCurrentUser();
        if (!user) return;

        // Get form fields
        const firstNameInput = document.getElementById('input-first-name');
        const lastNameInput = document.getElementById('input-last-name');
        const emailInput = document.getElementById('input-email');

        if (!firstNameInput || !lastNameInput || !emailInput) return;

        // Only fill if fields are empty (don't overwrite manual entries)
        // Use firstName/lastName if available, otherwise parse displayName
        let firstName = user.firstName;
        let lastName = user.lastName;

        if (!firstName || !lastName) {
            const displayName = user.displayName || user.name || '';
            const nameParts = displayName.trim().split(/\s+/);
            if (nameParts.length > 0) {
                firstName = firstName || nameParts[0];
                lastName = lastName || nameParts.slice(1).join(' ');
            }
        }

        if (!firstNameInput.value.trim() && firstName) {
            firstNameInput.value = firstName;
        }

        if (!lastNameInput.value.trim() && lastName) {
            lastNameInput.value = lastName;
        }

        if (!emailInput.value.trim() && user.email) {
            emailInput.value = user.email;
        }
    },

    // Handle OAuth callback and store user data
    async handleOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const authStatus = urlParams.get('auth');

        // Check if we're returning from OAuth
        if (authStatus === 'success') {
            // Fetch user from backend using JWT
            try {
                const token = getStoredToken();
                if (!token) {
                    console.error('No token found after OAuth');
                    return;
                }
                
                const response = await fetch(`${API_BASE_URL}/auth/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const user = await response.json();
                    console.log('Logged in user', user);
                    this.saveUser(user);
                    // Clean URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                    // Redirect to dashboard
                    window.location.href = '/graduate/dashboard/';
                }
            } catch (error) {
                console.error('Error fetching user after OAuth:', error);
            }
        } else if (authStatus === 'error') {
            console.error('OAuth authentication failed');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    },

    // Check auth state on page load
    async checkAuthState() {
        try {
            const cachedUser = this.getCurrentUser();
            if (cachedUser) {
                this.saveUser(cachedUser);
                this.refreshAllAuthUI();
                return true;
            }

            const token = getStoredToken();
            if (!token) return false;
            
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const user = await response.json();
                console.log('Logged in user', user);
                this.saveUser(user);
                // Refresh all auth UI
                this.refreshAllAuthUI();
                return true;
            }
        } catch (error) {
            console.error('Error checking auth state:', error);
        }
        return false;
    },

    // Refresh all auth UI elements on the page
    refreshAllAuthUI() {
        document.querySelectorAll('.auth-ui-container').forEach(container => {
            this.renderAuthUI(container, {
                signupUrl: container.getAttribute('data-signup-url') || '/signup/',
                profileUrl: container.getAttribute('data-profile-url') || '/graduate/dashboard/#view-profile',
                buttonClass: container.getAttribute('data-button-class') || 'btn-header',
                avatarSize: 40,
                publicMode: container.getAttribute('data-public-auth') === 'true'
            });
        });
    },

    // Logout function
    async logout() {
        try {
            const token = getStoredToken();
            // Call backend logout endpoint
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'GET',
                headers: token ? {
                    'Authorization': `Bearer ${token}`
                } : {}
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        // Clear local auth data
        this.clearAuth();

        // Refresh all auth UI on the page
        this.refreshAllAuthUI();

        window.location.href = '/';
    },

    // Initialize auth UI on page load
    async init() {
        // Handle OAuth callback first
        await this.handleOAuthCallback();

        // Check auth state on page load
        await this.checkAuthState();

        // Auto-fill profile form if on dashboard
        if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('Dashboard')) {
            setTimeout(() => {
                this.autoFillProfileForm();
            }, 500);
        }

        // Render all auth UI containers
        document.querySelectorAll('.auth-ui-container').forEach(container => {
            this.renderAuthUI(container, {
                signupUrl: container.getAttribute('data-signup-url') || '/signup/',
                profileUrl: container.getAttribute('data-profile-url') || '/graduate/dashboard/#view-profile',
                buttonClass: container.getAttribute('data-button-class') || 'btn-header',
                avatarSize: 40,
                publicMode: container.getAttribute('data-public-auth') === 'true'
            });
        });
    }
};

// Expose globally
window.AuthUI = AuthUI;

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AuthUI.init());
} else {
    AuthUI.init();
}

