import {useSelector} from "react-redux";
export const DEPARTMENTS = [
    "IT Support",
    "Administration",
    "Accounts",
    "Library",
    "Hostel",
    "Transport"
];

export const DEPARTMENT_OPTIONS =
    Object.values(DEPARTMENTS).map(department => ({
        value: department,
        label: department
    }));