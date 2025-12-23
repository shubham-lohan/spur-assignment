export const config = (() => {
    try {
        return {
            apiBaseUrl: import.meta.env.BACKEND_URL || 'http://localhost:3001',
        };
    } catch (error) {
        console.error('Error loading configuration:', error);
        return {
            apiBaseUrl: 'http://localhost:3001',
        };
    }
})();
