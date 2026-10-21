const getType=(value)=>{
    if(Array.isArray(value))
    {
        return "array";
    }

    if(value===null)
    {
        return "null";
    }

    return typeof value;
};

const validateRequired = (
    schema,
    args,
    parentPath = ""
) => {

    const errors = [];

    const requiredFields = schema.required || [];

    for (const field of requiredFields)
    {
        const value = args[field];

        const path = parentPath
            ? `${parentPath}.${field}`
            : field;

        if (
            value === undefined ||
            value === null ||
            value === ""
        )
        {
            errors.push({
                field: path,
                code: "REQUIRED",
                message: `${path} is required.`
            });
        }
    }

    const properties = schema.properties || {};

    for (const field of Object.keys(properties))
    {
        if (!(field in args))
        {
            continue;
        }

        const propertySchema = properties[field];

        if (
            propertySchema.type === "object" &&
            propertySchema.properties &&
            args[field]
        )
        {
            errors.push(
                ...validateRequired(
                    propertySchema,
                    args[field],
                    parentPath
                        ? `${parentPath}.${field}`
                        : field
                )
            );
        }
    }

    return errors;
};

const validateUnexpected = (
    schema,
    args,
    parentPath = ""
) => {

    const errors = [];

    const allowedFields = Object.keys(
        schema.properties || {}
    );

    for (const field of Object.keys(args))
    {
        const path = parentPath
            ? `${parentPath}.${field}`
            : field;

        if (!allowedFields.includes(field))
        {
            errors.push({
                field: path,
                code: "UNKNOWN_FIELD",
                message: `Unknown parameter "${path}".`
            });

            continue;
        }

        const propertySchema = schema.properties?.[field];

        if (
            propertySchema?.type === "object" &&
            propertySchema.properties &&
            args[field]
        )
        {
            errors.push(
                ...validateUnexpected(
                    propertySchema,
                    args[field],
                    path
                )
            );
        }
    }

    return errors;
};

const validateTypes = (schema, args, parentPath = "") => {

    const errors = [];

    const properties = schema.properties || {};

    for (const field of Object.keys(properties))
    {
        if (!(field in args))
        {
            continue;
        }

        const propertySchema = properties[field];

        const value = args[field];

        const path = parentPath
            ? `${parentPath}.${field}`
            : field;

        const expectedType = propertySchema.type;

        if(expectedType)
        {
            const actualType = getType(value);

            if(actualType !== expectedType)
            {
                errors.push({
                    field: path,
                    code: "INVALID_TYPE",
                    message: `Expected ${expectedType} but received ${actualType}.`
                });

                continue;
            }
        }

        if(
            expectedType === "object" &&
            propertySchema.properties
        )
        {
            errors.push(
                ...validateTypes(
                    propertySchema,
                    value,
                    path
                )
            );
        }
    }

    return errors;
};

const validateEnums = (
    schema,
    args,
    parentPath = ""
) => {

    const errors = [];

    const properties = schema.properties || {};

    for (const field of Object.keys(properties))
    {
        if (!(field in args))
        {
            continue;
        }

        const propertySchema = properties[field];

        const value = args[field];

        const path = parentPath
            ? `${parentPath}.${field}`
            : field;

        if (
            propertySchema.enum &&
            !propertySchema.enum.includes(value)
        )
        {
            errors.push({
                field: path,
                code: "INVALID_ENUM",
                message:
                    `Invalid value "${value}". Allowed values: ${propertySchema.enum.join(", ")}.`
            });

            continue;
        }

        if (
            propertySchema.type === "object" &&
            propertySchema.properties &&
            value
        )
        {
            errors.push(
                ...validateEnums(
                    propertySchema,
                    value,
                    path
                )
            );
        }
    }

    return errors;
};

const validateParameters = (schema, args = {}) => {

    const errors = [];

    errors.push(
        ...validateRequired(schema, args)
    );

    errors.push(
        ...validateUnexpected(schema, args)
    );

    errors.push(
        ...validateTypes(schema, args)
    );

    errors.push(
        ...validateEnums(schema, args)
    );

    return {
        valid: errors.length === 0,
        errors
    };
};

module.exports = {
    validateParameters
};

