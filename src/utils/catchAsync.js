// utils/handleAsyncErr.js
export default function handleAsyncErr(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            next(err); // Pass any caught errors to the error-handling middleware
        }
    };
}
