export const PRIORITIES = {
    HIGH: "High",
    MEDIUM: "Medium",
    LOW: "Low"
};

export const PRIORITY_OPTIONS =
Object.values(PRIORITIES).map(priority=>({
    value: priority,
    label: priority

}));