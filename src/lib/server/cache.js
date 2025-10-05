const cache = new Map();
const cacheTTL = 1000 * 60 * 10;

export default {
    get: (key) => {
        const entry = cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            cache.delete(key);
            return null;
        }

        return entry.value;
    },
    set: (key, value) => {
        cache.set(key, {
            value,
            expiry: Date.now() + cacheTTL,
        });
    },
};
