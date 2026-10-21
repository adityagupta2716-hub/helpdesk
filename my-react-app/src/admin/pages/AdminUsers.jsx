import AdminLayout from "../components/layout/AdminLayout.jsx";
import {useState,useEffect} from "react";
//import {adminUsers} from "../data/adminUsers.js";
import UserTable from "../components/users/UserTable.jsx";
import Button from "../../components/common/Button.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import {useDispatch,useSelector} from "react-redux";
import { createUserThunk, fetchAllUsers, updateUserThunk } from "../../features/users/userSlice.js";
import { useForm } from "react-hook-form";
import FormInput from "../../components/common/forms/FormInput.jsx";
import FormSelect from "../../components/common/forms/FormSelect.jsx";
import { ROLE_OPTIONS } from "../../constants/roles.js";
import useDepartmentOptions from "../../hooks/useDepartmentOptions.js";

function AdminUsers(){
    const{
        register,
        handleSubmit,
        watch,
        reset,
        formState:{errors}
    }=useForm({
        defaultValues:{
            role:"student"
        }
    });
    const selectedRole=watch("role");
    const[showAddUser,setShowAddUser]=useState(false);
    const[showEditUser,setShowEditUser]=useState(false);
    const[selectedUser,setSelectedUser]=useState(null);
    const dispatch=useDispatch();
    const{
        users,
        loading,
        error
    }=useSelector(state=>state.users);
    useEffect(()=>{
        dispatch(fetchAllUsers());
    },[
        dispatch
    ]);
    const[searchTerm,setSearchTerm]=useState("");
    const[formError,setFormError]=useState("");
    //const [users,setUsers]=useState(adminUsers);
    const filteredUsers=users.filter(user=>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const DEPARTMENT_OPTIONS=useDepartmentOptions();
    const onSubmit=async(data)=>{
        const result=await dispatch(createUserThunk(data));
        if(result.type==="users/createUserThunk/fulfilled")
        {
            dispatch(fetchAllUsers());
            reset();
            setShowAddUser(false);
        }
    };
    const handleEdit=(user)=>{
        setSelectedUser(user);
        setShowEditUser(true);
        reset({
            name:user.name,
            email:user.email,
            mobile:user.mobile,
            role:user.role,
            department:user.department || ""
        });
    };
    const handleUpdateUser=async(data)=>{
        console.log("UPDATE DAATA",data);
        const result=await dispatch(
            updateUserThunk({
                userId:selectedUser._id,
                userData:data
            })
            
        );
        console.log(result);
        if(result.type==="users/updateUser/fulfilled")
        {
            dispatch(fetchAllUsers());
            setShowEditUser(false);
            reset();
        }
        if(result.type.endsWith("/rejected"))
        {
            setFormError(result.payload);
            return;
        }
    }
    function handleDelete(id)
    {
        alert("Delete user coming later");
    }
    const[currentPage,setCurrentPage]=useState(1);
    const   usersPerPage=5;
    const totalPages=Math.ceil(
        filteredUsers.length/usersPerPage
    );
    const startIndex=(currentPage-1)*usersPerPage;
    const paginatedUsers=filteredUsers.slice(
        startIndex,
        startIndex+usersPerPage
    );
    if(loading)
    {
        return(
            <AdminLayout>
                Loading Users...
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
    
    console.log(users);
    return(
        <AdminLayout >
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
                Users
            </h1>
            <Button text="+ Add User" className="!w-auto px-5" onClick={()=>setShowAddUser(true)}/>
        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-6">
       <input type="text" placeholder="Search users..." 
       value={searchTerm} onChange={(e)=>{setSearchTerm(e.target.value);
        setCurrentPage(1);
       }}
       className="border rounded-lg p-3 mt-4 mb-6 w-full"/>
       </div>
       <UserTable users={paginatedUsers} onEdit={handleEdit} onDelete={handleDelete}/>
       <Pagination currentPage={currentPage}
       totalPages={totalPages}
       onPageChange={setCurrentPage}
       />
       {
        showAddUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-[500px]">
                    <h2 className="text-2xl font-bold mb-6">
                        Add New User
                    </h2>
                    <div className="space-y-4">
                        <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                        >

                            <FormInput
                                label="Name"
                                type="text"
                                name="name"
                                register={register}
                                rules={{
                                    required:"Name is required"
                                }}
                                error={errors.name}
                            />

                            <FormInput
                                label="Email"
                                type="email"
                                name="email"
                                register={register}
                                rules={{
                                    required:"Email is required"
                                }}
                                error={errors.email}
                            />

                            <FormInput
                                label="Mobile"
                                type="text"
                                name="mobile"
                                register={register}
                                rules={{
                                    required:"Mobile number is required",
                                    pattern:{
                                        value:/^[0-9]{10}$/,
                                        message:"Mobile number must be 10 digits"
                                    }
                                }}
                                error={errors.mobile}
                            />
                            
                            <FormSelect
                                label="Role"
                                name="role"
                                register={register}
                                rules={{
                                    required:"Role is required"
                                }}
                                errors={errors.role}
                                options={ROLE_OPTIONS}
                            />

                            {
                                selectedRole==="staff" && (
                                    <FormSelect
                                        label="Department"
                                        name="department"
                                        register={register}
                                        rules={{
                                            required:"Department is required"
                                        }}
                                        errors={errors.department}
                                        options={DEPARTMENT_OPTIONS}
                                    />
                                )
                            }
                            {formError && (
                                <p className="text-red-500 text-sm">
                                    {formError}
                                </p>
                                )
                            }

                            <div className="flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={()=>{
                                        reset();
                                        setShowAddUser(false);
                                    }}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Cancel
                                </button>

                                <Button
                                    text="Create User"
                                    type="submit"
                                />

                            </div>

                        </form>
                    </div>
                </div>
            </div>
        )
       }
       {
        showEditUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-[500px]">
                    <h2 className="text-2xl font-bold mb-6">
                        Edit User
                    </h2>
                    <div className="space-y-4">
                        <form
                        onSubmit={handleSubmit(handleUpdateUser)}
                        className="space-y-4"
                        >

                            <FormInput
                                label="Name"
                                type="text"
                                name="name"
                                register={register}
                                rules={{
                                    required:"Name is required"
                                }}
                                error={errors.name}
                            />

                            <FormInput
                                label="Email"
                                type="email"
                                name="email"
                                register={register}
                                rules={{
                                    required:"Email is required"
                                }}
                                error={errors.email}
                            />

                            <FormInput
                                label="Mobile"
                                type="text"
                                name="mobile"
                                register={register}
                                rules={{
                                    required:"Mobile number is required",
                                    pattern:{
                                        value:/^[0-9]{10}$/,
                                        message:"Mobile number must be 10 digits"
                                    }
                                }}
                                error={errors.mobile}
                            />

                            <FormSelect
                                label="Role"
                                name="role"
                                register={register}
                                rules={{
                                    required:"Role is required"
                                }}
                                errors={errors.role}
                                options={ROLE_OPTIONS}
                            />

                            {
                                selectedRole==="staff" && (
                                    <FormSelect
                                        label="Department"
                                        name="department"
                                        register={register}
                                        rules={{
                                            required:"Department is required"
                                        }}
                                        errors={errors.department}
                                        options={DEPARTMENT_OPTIONS}
                                    />
                                )
                            }

                            <div className="flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={()=>{
                                        reset();
                                        setShowEditUser(false);
                                    }}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Cancel
                                </button>

                                <Button
                                    text="Update User"
                                    type="submit"
                                />

                            </div>

                        </form>
                    </div>
                </div>
            </div>

        )
       }
        </AdminLayout>

    );
}
export default AdminUsers;