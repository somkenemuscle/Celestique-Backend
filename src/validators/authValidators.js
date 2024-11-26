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
    phoneNumber: Joi.string()
        .pattern(/^\d+$/) // Ensures the phone number contains only digits
        .min(10)          // Adjust minimum length based on your requirements
        .max(15)          // Adjust maximum length based on your requirements
        .required()
        .messages({
            'string.pattern.base': 'Phone number can only contain digits.',
            'string.min': 'Phone number must be at least 10 digits long.',
            'string.max': 'Phone number must not exceed 15 digits.',
            'string.empty': 'Phone number is required.',
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
    recaptchaToken: Joi.string().required()  // Add this line to allow the recaptchaToken
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

