import AuthLayout from "../../components/auth/AuthLayout.jsx";
import {useForm} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import FormInput from "../../components/common/forms/FormInput.jsx";
import FormSelect from "../../components/common/forms/FormSelect.jsx";
import api from "../../services/api.js";
import { useState } from "react";
function Register(){
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(null);
    const [loading, setLoading] = useState(false);
    const{
        register,
        handleSubmit,
        watch,
        formState:{errors}
    }=useForm();
    async function onSubmit(data){
        setServerError(null);
        setLoading(true);
        try {
            await api.post("/auth/register", {
                name: data.fullName,
                email: data.email,
                mobile: data.mobile,
                password: data.password,
                role: data.role
            });
            navigate("/login");
        } catch(err) {
            setServerError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    return(
        <AuthLayout> 
        <div className="w-[500px] bg-white p-10 rounded-2xl shadow-xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Create Account
                </h1>
                <p className="text-gray-500 mt-2">
                    Join AI Campus Helpdesk 
                </p>
            </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                            <FormInput
                            label="Full Name"
                            type="text"
                            placeholder="Enter your full name"
                            name="fullName"
                            register={register}
                            rules={{
                                required: "Full Name is required"
                            }}
                            error={errors.fullName}
                            />

                            <FormInput
                            label="Email Address"
                            type="email"
                            placeholder="Enter your email address"
                            name="email"
                            register={register}
                            rules={{
                                required: "Email Address is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Please enter a valid email address"
                                }   
                            }}
                            error={errors.email}
                            />
                        <FormInput
                            label="Mobile Number"
                            type="text"
                            placeholder="Enter your mobile number"
                            name="mobile"
                            register={register}
                            rules={{
                                required: "Mobile Number is required",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Please enter a valid 10-digit mobile number"
                                }   
                            }}
                            error={errors.mobile}
                            />
                        <FormInput
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            register={register}
                            rules={{
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            }}
                            error={errors.password}
                            />
                        <FormInput
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            name="confirmPassword"
                            register={register}
                            rules={{
                                required: "Confirm Password is required",
                                validate: (value) => value === watch("password") || "Passwords do not match"
                            }}
                            error={errors.confirmPassword}
                            />
                        <FormSelect
                        label="Role"
                        name="role"
                        register={register}
                        rules={{
                            required:"Please select a role"
                        }}
                        options={[
                            {value:"student", label:"Student"},
                            {value:"staff",label:"Staff"},
                            {value:"admin",label:"Admin"}
                        ]}
                        error={errors.role}
                        />
                     
                            

                        <Button text={loading ? "Registering..." : "Register"} type="submit"/>
                        {serverError && (
                            <p className="text-red-500 mt-3 text-sm text-center">{serverError}</p>
                        )}
                        <p className="text-center mt-4 text-sm">Already have an account? <Link to="/login" className="text-blue-600 ml-1">Login</Link></p>
                    </form>
        </div>
        </AuthLayout>
    );
}
export default Register;