import AdminLayout from "../components/layout/AdminLayout.jsx";
import Button from "../../components/common/Button.jsx";
import DepartmentTable from "../components/departments/DepartmentTable.jsx";
import {useEffect, useState} from "react";
//import {departments as initialDepartments} from "../data/departments.js";
import{
    useDispatch,
    useSelector
} from "react-redux";
import{
    addDepartment,
    fetchDepartments,
    updateDepartmentThunk
} from "../../features/departments/departmentSlice.js";
import { useForm } from "react-hook-form";
import FormInput from "../../components/common/forms/FormInput.jsx";
import FormTextarea from "../../components/common/forms/FormTextarea.jsx";
function AdminDepartments(){
    const {
        register,
        handleSubmit,
        reset,
        formState:{errors}
    }=useForm();
    const dispatch=useDispatch();
    const{
        departments,
        loading,
        error
    }=useSelector(state=>state.departments);
    useEffect(()=>{
        dispatch(fetchDepartments());
    },[
        dispatch
    ]);
    const [showModal,setShowModal]=useState(false);
    const[searchTerm,setSearchTerm]=useState("");
    const[showEditDepartment,setShowEditDepartment]=useState(false);
    const[selectedDepartment,setSelectedDepartment]=useState(null);
    const handleEdit=(department)=>{
        setSelectedDepartment(department);
        setShowEditDepartment(true);
        reset({
            name:department.name,
            description:department.description
        });
    };
    const handleUpdateDepartment=async(data)=>{
        const result=await dispatch(updateDepartmentThunk({
            departmentId:selectedDepartment._id,
            departmentData:data
        }));
        if(result.type==="departments/updateDepartment/fulfilled")
        {
            dispatch(fetchDepartments());
            reset();
            setShowEditDepartment(false);
        }
        if(result.type.endsWith("/rejected"))
        {
            setDepartmentError(result.payload);
        }
    };
    //const[departments,setDepartments]=useState(initialDepartments);
    const filteredDepartments=departments.filter(department=>
        department.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    function handleDelete(id)
    {
        const confirmDelete=window.confirm("Are you sure you want to delete this deperment?");
        if(!confirmDelete)
        {
            return;
        }
        setDepartments(departments.filter(department=>department._id!==id));
    }
    const[departmentError,setDepartmentError]=useState("");
    const handleAddDepartment=async(data)=>{
        const result=await dispatch(addDepartment(data));
        if(result.type==="departments/addDepartment/fulfilled")
        {
            reset();
            setShowModal(false);
        }
        if(result.type==="departments/addDepartment/rejected")
        {
            setDepartmentError(result.payload);
            return;
        }
    };
    
    if(loading)
    {
        return(
            <AdminLayout>
                Loading Departments...
            </AdminLayout>
        );
    }
    if(error)
    {
        return(
            <AdminLayout>
                {error}
            </AdminLayout>
        );
    }
    return(
        <AdminLayout >
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    Departments
                </h1>
                <div className="w-48">
                    <Button text="+ Add Department" onClick={()=>setShowModal(true)}/>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <input type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
                className="border rounded-lg p-3 w-full"/>
            
            <DepartmentTable
            departments={filteredDepartments}
            onDelete={handleDelete}
            onEdit={handleEdit}
            />
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Add Department
                        </h2>
                        <form onSubmit={handleSubmit(handleAddDepartment)} className="space-y-4">
                            <FormInput
                            label="Department Name"
                            name="name"
                            register={register}
                            rules={{
                                required:"Department name is required"
                            }}
                            />
                            <FormTextarea
                            label="Description"
                            name="description"
                            register={register}
                            rules={{
                                required:"Description is required"
                            }}
                            error={errors.description}
                            />
                            <div className="flex gap-3">
                                <Button type="submit" text="create"/>
                                <button type="button" onClick={()=>{setShowModal(false);reset();}}
                                className="border px-4 py-2 rounded-lg">
                                    Cancel
                                </button>
                            </div>
                            {departmentError && (
                                <p className="text-red-500 text-sm">
                                    {departmentError}
                                </p>
                            )}
                        </form>

                    </div>
                </div>
            )}
            {showEditDepartment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Edit Department
                        </h2>
                        <form onSubmit={handleSubmit(handleUpdateDepartment)} className="space-y-4">
                            <FormInput
                            label="Department Name"
                            name="name"
                            register={register}
                            rules={{
                                required:"Department name is required"
                            }}
                            />
                            <FormTextarea
                            label="Description"
                            name="description"
                            register={register}
                            rules={{
                                required:"Description is required"
                            }}
                            error={errors.description}
                            />
                            <div className="flex gap-3">
                                <Button type="submit" text="Update"/>
                                <button type="button" onClick={()=>{setShowEditDepartment(false);reset();}}
                                className="border px-4 py-2 rounded-lg">
                                    Cancel
                                </button>
                            </div>
                            {departmentError && (
                                <p className="text-red-500 text-sm">
                                    {departmentError}
                                </p>
                            )}
                        </form>

                    </div>
                </div>
            )}
            </div>
        </AdminLayout>

    );
}
export default AdminDepartments;