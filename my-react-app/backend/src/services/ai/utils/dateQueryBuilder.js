const{
    validateDateFilter
}=require("../../shared/validators/dateFilterValidator.js");
function startOfDay(date)
{
    const result = new Date(date);
    result.setHours(0,0,0,0);
    return result;
}

function endOfDay(date)
{
    const result = new Date(date);
    result.setHours(23,59,59,999);
    return result;
}

function buildRelativeQuery(unit,value,now)
{
    const start=new Date(now);

    switch(unit)
    {
        case "day":
            start.setDate(start.getDate()-value);
            break;

        case "week":
            start.setDate(start.getDate()-(value*7));
            break;

        case "month":
            start.setMonth(start.getMonth()-value);
            break;

        case "year":
            start.setFullYear(start.getFullYear()-value);
            break;

        default:
            throw new Error(`Unsupported relative unit "${unit}".`);
    }

    return {
        $gte:startOfDay(start),
        $lte:endOfDay(now)
    };
}

function buildPresetQuery(operator,now)
{
    switch(operator)
    {
        case "today":
        {
            return {
                $gte:startOfDay(now),
                $lte:endOfDay(now)
            };
        }

        case "yesterday":
        {
            const yesterday=new Date(now);
            yesterday.setDate(yesterday.getDate()-1);

            return {
                $gte:startOfDay(yesterday),
                $lte:endOfDay(yesterday)
            };
        }

        case "this_week":
        {
            const start=new Date(now);

            const day=start.getDay();

            const diff=day===0?6:day-1;

            start.setDate(start.getDate()-diff);
            start.setHours(0,0,0,0);

            return{
                $gte:start,
                $lte:endOfDay(now)
            };
        }

        case "last_week":
        {
            const start=new Date(now);

            const day=start.getDay();

            const diff=day===0?6:day-1;

            start.setDate(start.getDate()-diff-7);
            start.setHours(0,0,0,0);

            const end=new Date(start);

            end.setDate(end.getDate()+6);
            end.setHours(23,59,59,999);

            return{
                $gte:start,
                $lte:end
            };
        }

        case "this_month":
        {
            const start=new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );

            return{
                $gte:start,
                $lte:endOfDay(now)
            };
        }

        case "last_month":
        {
            const start=new Date(
                now.getFullYear(),
                now.getMonth()-1,
                1
            );

            const end=new Date(
                now.getFullYear(),
                now.getMonth(),
                0,
                23,
                59,
                59,
                999
            );

            return{
                $gte:start,
                $lte:end
            };
        }

        default:
            throw new Error(
                `Unsupported preset operator "${operator}".`
            );
    }
}

function buildDateQuery(dateFilter, now=new Date())
{
    if(!dateFilter)
    {
        return null;
    }

    validateDateFilter(dateFilter);

    switch(dateFilter.operator)
    {
        case "today":
        case "yesterday":
        case "this_week":
        case "last_week":
        case "this_month":
        case "last_month":
            return buildPresetQuery(
                dateFilter.operator,
                now
            );

        case "relative":
            return buildRelativeQuery(
                dateFilter.unit,
                dateFilter.value,
                now
            );

        case "between":
            return{
                $gte:new Date(dateFilter.from),
                $lte:new Date(dateFilter.to)
            };

        case "before":
            return{
                $lt:new Date(dateFilter.date)
            };

        case "after":
            return{
                $gt:new Date(dateFilter.date)
            };

        case "exact":
        {
            const date=new Date(dateFilter.date);

            return{
                $gte:startOfDay(date),
                $lte:endOfDay(date)
            };
        }

        default:
            throw new Error(
                `Unsupported date operator "${dateFilter.operator}".`
            );
    }
}

module.exports={
    buildDateQuery
};