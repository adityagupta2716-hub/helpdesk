const analyticsModules=require("./modules");

async function runAnalytics({
    sections=[],
    filters={}
}={})
{
    const analytics={};

    for(const section of sections)
    {
        const analyticsModule=analyticsModules[section];

        if(!analyticsModule)
        {
            throw new Error(
                `Unknown analytics section "${section}".`
            );
        }

        analytics[section]=await analyticsModule(
            filters
        );
    }

    return analytics;
}

module.exports={
    runAnalytics
};