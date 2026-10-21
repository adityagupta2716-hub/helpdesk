import { useSelector } from "react-redux";
export default function useDepartmentOptions(){
    const{
        departments
    }=useSelector(state=>state.departments);
    return departments.map(
        department=>({
            value:department.name,
            label:department.name
        })
    );
}