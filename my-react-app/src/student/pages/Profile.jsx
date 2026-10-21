import DashboardLayout  from "../../components/layout/DashboardLayout.jsx";
import FormInput from "../../components/common/forms/FormInput.jsx";
import {useForm} from "react-hook-form";
import Button from "../../components/common/Button.jsx";
import {useSelector,useDispatch} from "react-redux";
import { useEffect } from "react";
import { fetchProfile, updateUserProfile, changeUserPassword } from "../../features/auth/authSlice.js";
import {useState} from "react";
function Profile(){
    const[passwordError,setPasswordError]=useState("");
    const[passwordSuccess,setPasswordSuccess]=useState("");
    const[isEditing,setIsEditing]=useState(false);
    const dispatch=useDispatch();
    const {
        user,
        loading,
        error
    }=useSelector(state=>state.auth);
    const profileForm=useForm();
    const passwordForm=useForm();

    useEffect(()=>{
        dispatch(fetchProfile());
    },[
        dispatch
    ]);

    useEffect(()=>{
        if(user)
        {
            profileForm.reset({
                name:user.name,
                mobile:user.mobile
            });
        }
    },[
        user,
        profileForm.reset
    ])

    if(loading)
    {
        return(
            <DashboardLayout>
                <h1>
                    Loading Profile...
                </h1>
            </DashboardLayout>
        );
    }
    
    const onSubmit=async(data)=>{
        const result=await dispatch(updateUserProfile(data));
        if(result.type==="auth/updateProfile/fulfilled")
        {
            setIsEditing(false);
        }
    };
    
    const handlePasswordChange=async(data)=>{
        const result=await dispatch(changeUserPassword({
            currentPassword:data.currentPassword,
            newPassword:data.newPassword
        }));
        if(result.type==="auth/changePassword/fulfilled")
        {
            setPasswordError("");
            setPasswordSuccess("Password Changed Sucessfully");
            passwordForm.reset({
                currentPassword:"",
                newPassword:"",
                confirmPassword:""
            });
        }
        if(result.type==="auth/changePassword/rejected")
        {
            setPasswordSuccess("");
            setPasswordError(result.payload);
            return;
        }
    }
    return(
        <DashboardLayout>
            <h1 className="text-3xl font-bold">
                My Profile
            </h1>
            <p className="text-gray-500 mt-2">
                View and update your profile information
            </p>
            <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-6 mt-6">
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
                                {user?.role?.charAt(0).toUpperCase()+user?.role?.slice(1)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Personal Information
                    </h2>
                    {!isEditing? (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">
                                Full Name
                            </p>
                            <p className="font-medium">
                                {user?.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Email
                            </p>
                            <p className="font-medium">
                                {user?.email}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Mobile
                            </p>
                            <p className="font-medium">
                                {user?.mobile}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Role
                            </p>
                            <p className="font-medium capitalize">
                                {user?.role}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Member Since
                            </p>
                            <p className="font-medium">
                                {
                                    new Date(
                                        user?.createdAt
                                    ).toLocaleDateString()
                                }
                            </p>
                        </div>
                    </div>
                    ):(
                        <div className="space-y-4">
                            <FormInput 
                            label="Full Name"
                            type="text"
                            name="name"
                            register={profileForm.register}
                            rules={{required:"Name is required"}}
                            error={profileForm.formState.errors.name}
                            />
                            <FormInput 
                            label="Mobile Number"
                            type="text"
                            name="mobile"
                            register={profileForm.register}
                            rules={{required:"Mobile number is required"}}
                            error={profileForm.formState.errors.mobile}
                            />
                            <div className="flex gap-3">
                                <Button text="Save Changes" type="submit" className="px-5 py-2"/>
                                <button type="button" onClick={()=>setIsEditing(false)} className="border px-5 py-2 rounded-lg">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                    {!isEditing && (
                    <Button onClick={()=>setIsEditing(!isEditing)} text="Edit Profile" className="w-auto! mt-6! px-5! py-2!"/>
                    )}
                
                  
                </div>
                </form>
                <form onChange={()=>{setPasswordError("");setPasswordSuccess("");}} onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6 mt-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Change Password
                    </h2>
                    <FormInput
                            label="Current Password"
                            type="password"
                            placeholder="Enter your current password"
                            name="currentPassword"
                            register={passwordForm.register}
                            rules={{
                                required: "Current Password is required"
                            }}
                            error={passwordForm.formState.errors.currentPassword}
                    />
                    <FormInput
                            label="New Password"
                            type="password"
                            placeholder="Enter new password"
                            name="newPassword"
                            register={passwordForm.register}
                            rules={{
                                required: "New Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            }}
                            error={passwordForm.formState.errors.newPassword}
                    />
                    <FormInput
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            name="confirmPassword"
                            register={passwordForm.register}
                            rules={{
                                required: "Confirm Password is required",
                                validate: (value) => value === passwordForm.watch("newPassword") || "Passwords do not match"
                            }}
                            error={passwordForm.formState.errors.confirmPassword}
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
                    <Button type="submit" text="Change Password"/>


                </div>
                </form>




        </DashboardLayout>
    );
}
export default Profile;