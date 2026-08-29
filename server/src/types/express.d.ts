import { HydratedDocument } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            user: HydratedDocument<{
                name: string;
                email: string;
                password: string;
                createdAt: Date;
                updatedAt: Date;
            }>;
        }
    }
}

export { };