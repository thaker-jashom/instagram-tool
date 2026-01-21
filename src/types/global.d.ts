declare global {
    namespace Express {
        interface Request {
            user?: any; // Placeholder for future auth
        }
    }
}

export { };
