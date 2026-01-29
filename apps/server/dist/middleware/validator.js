import { ZodError } from 'zod';
import { HTTP_STATUS } from '@/config/constants';
/**
 * Validate request data against a Zod schema
 */
export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: 'Validation Error',
                    details: error.issues.map((e) => ({
                        field: e.path.join('.'),
                        message: e.message,
                    })),
                });
            }
            next(error);
        }
    };
};
export default validate;
