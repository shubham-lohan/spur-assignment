export const config = (() => {
    try {
        return {
            apiBaseUrl: import.meta.env.VITE_BACKEND_URL ,
        };
    } catch (error) {
        console.error('Error loading configuration:', error);
        return {
            apiBaseUrl: 'http://localhost:3001',
        };
    }
})();
