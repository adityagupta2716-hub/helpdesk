import AdminLayout from "../components/layout/AdminLayout.jsx";
import FormInput from "../../components/common/forms/FormInput.jsx";
import {useForm} from "react-hook-form";
import Button from "../../components/common/Button.jsx";
import { useDispatch,useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProfile, changeUserPassword } from "../../features/auth/authSlice.js";
function AdminProfile(){
    const dispatch=useDispatch();
    const {user,loading }=useSelector(state=>state.auth);
    useEffect(()=>{
        dispatch(fetchProfile());
    },[
        dispatch
    ]);
    const[passwordError,setPasswordError]=useState("");
    const[passwordSuccess,setPasswordSuccess]=useState("");
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: {errors}
    }=useForm();
    const onSubmit=async(data)=>{
        const result=await dispatch(
            changeUserPassword({
                currentPassword:data.currentPassword,
                newPassword:data.newPassword
            })
        );
        if(result.type==="auth/changePassword/fulfilled")
        {
            setPasswordError("");
            setPasswordSuccess("Password changed successfully");
            reset({
                currentPassword:"",
                newPassword:"",
                confirmPassword:""
            });
        }
        if(result.type==="auth/changePassword/rejected")
        {
            setPasswordSuccess("");
            setPasswordError(result.payload);
        }
    };
    if(loading)
    {
        return(
            <AdminLayout>
                Loading Profile...
            </AdminLayout>
        );
    }

    return(
        <AdminLayout>
            <h1 className="text-3xl font-bold">
                Admin Profile
            </h1>
            <p className="text-gray-500 mt-2">
                View your profile information and manage your account settings
            </p>
            <div className="space-y-6 mt-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Profile Information
                    </h2>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 text-white bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="font-semibold text-lg">
                                {user?.name}
                            </p>
                            <p className="text-gray-500">
                                {user?.role}
                            </p>
                            <p className="text-gray-500">
                                {user?.email}
                            </p>
                            <p className="text-gray-500">
                                {user?.mobile}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Admin Information
                    </h2>
                    <div className="space-y-4">
                        <div className="border rounded-lg p-3">
                            <p className="text-gray-500 text-sm">Admin ID</p>
                            <p className="font-medium">{user?._id?.slice(-6)}</p>
                        </div>
                        <div className="border rounded-lg p-3">
                            <p className="text-gray-500 text-sm">Role</p>
                            <p className="font-medium capitalize">{user?.role}</p>
                        </div>
                        <div className="border rounded-lg p-3">
                            <p className="text-gray-500 text-sm">Joined On</p>
                            <p className="font-medium">{user?.createdAt?new Date(user.createdAt).toLocaleDateString():"-"}</p>
                        </div>
                    </div>
                    
                </div>
                <form onChange={()=>{setPasswordError("");setPasswordSuccess("");}} onSubmit={handleSubmit(onSubmit)} >
                <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">
                        Change Password
                    </h2>
                    <FormInput
                            label="Current Password"
                            type="password"
                            placeholder="Enter your current password"
                            name="currentPassword"
                            register={register}
                            rules={{
                                required: "Current Password is required"
                            }}
                            error={errors.currentPassword}
                    />
                    <FormInput
                            label="New Password"
                            type="password"
                            placeholder="Enter new password"
                            name="newPassword"
                            register={register}
                            rules={{
                                required: "New Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            }}
                            error={errors.newPassword}
                    />
                    <FormInput
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            name="confirmPassword"
                            register={register}
                            rules={{
                                required: "Confirm Password is required",
                                validate: (value) => value === watch("newPassword") || "Passwords do not match"
                            }}
                            error={errors.confirmPassword}
                    />
                    {passwordError && (
                        <p className="text-red-500 text-sm mb-3">
                            {passwordError}
                        </p>
                    )}
                    {passwordSuccess &&(
                        <p className="text-green-600 text-sm mb-3">
                            {passwordSuccess}
                        </p>
                    )}


                <Button type="submit" text="Update Password" className="w-auto px-6"/>
                </div>
                </form>
                </div>
                

            </div>



        </AdminLayout>
    );
}
export default AdminProfile;