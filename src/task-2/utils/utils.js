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

export const validateItemExistence = (obj) => {
    return (req, res, next) => {
        const { id } = req.params;
        const item = obj.find(elem => elem.id === id && elem.isDeleted === false);

        if (!item) {
            res.status(404).json({ message: `Item with id ${id} not found.` });
        } else {
            req.item = item;
            return next();
        }
    };
};

export const validateItemUniqueness = (obj, key) => {
    return (req, res, next) => {
        const isParamNotUnique = obj.find(elem => elem[key] === req.body[key]);

        if (isParamNotUnique) {
            res.status(409).json({ message: `The "${key}" value is not unique` });
        } else {
            return next();
        }
    };
};

export const getAutoSuggestedItems = (obj, key, itemSubstring, limit) => {
    let filteredItems;
    if (itemSubstring) {
        filteredItems = obj.filter(elem => elem[key].includes(itemSubstring));
        filteredItems.sort((a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0));
    } else {
        filteredItems = obj;
    }
    if (limit && limit <= filteredItems.length) {
        filteredItems.length = limit;
    }
    return filteredItems;
};
