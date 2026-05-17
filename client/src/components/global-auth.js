/**
 * Global Auth Token Handler
 * Saves JWT token from URL to localStorage when user logs in via Google OAuth
 * This runs on all pages to ensure token is saved
 * PRIMARY KEY: jc_token (all other keys are fallbacks for compatibility)
 */

(function () {
    'use strict';

    // Check if token is in URL (from OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const jwtFromURL = params.get('token');

    if (jwtFromURL) {
        // Validate token format (should be a JWT with 3 parts)
        const tokenParts = jwtFromURL.split('.');
        if (tokenParts.length !== 3) {
            console.error('❌ Invalid token format received from URL');
            return;
        }

        // Save token to localStorage - PRIMARY KEY is jc_token
        localStorage.setItem('jc_token', jwtFromURL);

        // Also save with other keys for backward compatibility
        localStorage.setItem('jwt', jwtFromURL);
        localStorage.setItem('authToken', jwtFromURL);
        localStorage.setItem('token', jwtFromURL);

        // Remove token from URL for clean UI while preserving the current route/hash.
        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        window.history.replaceState({}, document.title, url.toString());

        console.log('✅ Token saved to localStorage (jc_token)');
    }
})();

