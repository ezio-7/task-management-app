// src/types/types.d.ts
declare namespace Express {
    interface Request {
        user?: {
            id: number;
        };
    }
}