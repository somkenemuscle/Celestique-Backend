import Joi from 'joi';

// Joi validation signup schema
export const signUpSchema = Joi.object({
    firstname: Joi.string()
        .pattern(/^[a-zA-Z0-9._-]+$/)
        .min(4)
        .max(20)
        .required()
        .messages({
            'string.pattern.base': 'Firstname can only contain letters, numbers, dots, underscores or dashes.',
            'string.min': 'Firstname must be at least 4 characters long.',
            'string.max': 'Firstname must be less than 20 characters long.',
        }),
    lastname: Joi.string()
        .pattern(/^[a-zA-Z0-9._-]+$/)
        .min(4)
        .max(20)
        .required()
        .messages({
            'string.pattern.base': 'Lastname can only contain letters, numbers, dots, underscores or dashes.',
            'string.min': 'Lastname must be at least 4 characters long.',
            'string.max': 'Lastname must be less than 20 characters long.',
        }),
    email: Joi.string()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .email({ tlds: { allow: ['com', 'net', 'org', 'gov', 'edu', 'co', 'io'] } })
        .required()
        .messages({
            'string.email': 'Must be a valid email address with a valid domain like .com, .net, .org, etc.',
            'string.pattern.base': 'Must be a valid email address with format "name@gmail.com".',
        }),
    password: Joi.string()
        .min(6)
        .max(50)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#_-])[A-Za-z\\d@$!%*?&#_-]{6,}$'))
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long.',
            'string.max': 'Password must be less than 50 characters long.',
            'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        }),
});




// Joi validation signin schema
export const signInSchema = Joi.object({
    email: Joi.string()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .email({ tlds: { allow: ['com', 'net', 'org', 'gov', 'edu', 'co', 'io'] } })
        .required()
        .messages({
            'string.email': 'Must be a valid email address with a valid domain like .com, .net, .org, etc.',
            'string.pattern.base': 'Must be a valid email address with format "name@gmail.com".',
        }),
    password: Joi.string()
        .min(1)
        .max(50)
        .required()
        .messages({
            'string.min': 'Password is required.',
            'string.max': 'Password must be less than 50 characters long.',
        })
});

