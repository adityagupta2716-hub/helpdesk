const ValidationError = require("../errors/ValidationError");

function isValidDate(value)
{
    if(typeof value !== "string")
    {
        return false;
    }

    const date = new Date(value);

    return !Number.isNaN(date.getTime());
}

function ensureDate(value, field)
{
    if(!isValidDate(value))
    {
        throw new ValidationError(
            `"${field}" must be a valid ISO date.`,
            field
        );
    }
}

function ensurePositiveInteger(value, field)
{
    if(
        !Number.isInteger(value) ||
        value <= 0
    )
    {
        throw new ValidationError(
            `"${field}" must be a positive integer.`,
            field
        );
    }
}

function validateDateRange(from, to)
{
    ensureDate(from, "from");
    ensureDate(to, "to");

    if(new Date(from) > new Date(to))
    {
        throw new ValidationError(
            '"from" cannot be later than "to".',
            "from"
        );
    }
}

function validateRelative(unit, value)
{
    if(!unit)
    {
        throw new ValidationError(
            'Relative filter requires "unit".',
            "unit"
        );
    }

    ensurePositiveInteger(value, "value");

    const LIMITS = {
        day: 365,
        week: 260,
        month: 120,
        year: 25
    };

    if(!(unit in LIMITS))
    {
        throw new ValidationError(
            `Unsupported relative unit "${unit}".`,
            "unit"
        );
    }

    if(value > LIMITS[unit])
    {
        throw new ValidationError(
            `"${unit}" relative value exceeds maximum allowed (${LIMITS[unit]}).`,
            "value"
        );
    }
}

function validateDateFilter(dateFilter)
{
    if(!dateFilter)
    {
        return;
    }

    const {
        operator,
        unit,
        value,
        date,
        from,
        to
    } = dateFilter;

    switch(operator)
    {
        case "today":
        case "yesterday":
        case "this_week":
        case "last_week":
        case "this_month":
        case "last_month":
            return;

        case "relative":
            validateRelative(unit, value);
            return;

        case "between":
            validateDateRange(from, to);
            return;

        case "before":
        case "after":
        case "exact":

            ensureDate(date, "date");
            return;

        default:
            throw new ValidationError(
                `Unsupported operator "${operator}".`,
                "operator"
            );
    }
}

module.exports = {
    validateDateFilter
};