import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;
window.axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
window.axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

const csrfToken = () => document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

if (csrfToken()) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken();
}

window.axios.interceptors.request.use((config) => {
    const token = csrfToken();

    if (token) {
        config.headers = config.headers || {};

        if (typeof config.headers.set === 'function') {
            config.headers.set('X-CSRF-TOKEN', token);
        } else {
            config.headers['X-CSRF-TOKEN'] = token;
        }
    }

    return config;
});

window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 419) {
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    authEndpoint: '/realtime/auth',
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    auth: {
        headers: csrfToken() ? {
            'X-CSRF-TOKEN': csrfToken(),
        } : {},
    },
});
