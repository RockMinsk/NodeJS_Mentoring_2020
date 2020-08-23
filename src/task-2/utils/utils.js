export const checkAuth = (req, res, next) => {
    if (!req.session.loggedin) {
        res.status(403).send('You are not authorized to view this page. Please login to the application.');
    } else {
        return next();
    }
};

const errorResponse = (schemaErrors) => {
    const errors = schemaErrors.map(error => {
        const { path, message } = error;
        return { path, message };
    });
    return {
        status: 'failed',
        errors
    };
};

export const validateSchema = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], {
            abortEarly: false,
            allowUnknown: false
        });

        if (error && error.isJoi) {
            res.status(400).json(errorResponse(error.details));
        } else {
            return next();
        }
    };
};

export const getAutoSuggestedItems = (items, itemKey, itemSubstring, limit) => {
    let filteredItems;
    if (itemSubstring) {
        filteredItems = items.filter(item => item[itemKey].includes(itemSubstring));
        filteredItems.sort((a, b) => (a[itemKey] > b[itemKey]) ? 1 : ((b[itemKey] > a[itemKey]) ? -1 : 0));
    } else {
        filteredItems = items;
    }
    if (limit && limit <= filteredItems.length) {
        filteredItems.length = limit;
    }
    return filteredItems;
};
