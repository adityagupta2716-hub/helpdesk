import {useForm} from "react-hook-form";
import {Link,useNavigate, Navigate} from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import Button from "../../components/common/Button.jsx";
import FormInput from "../../components/common/forms/FormInput.jsx";
import FormSelect from "../../components/common/forms/FormSelect.jsx";
import{useDispatch,useSelector} from "react-redux";
import {login} from "../../features/auth/authSlice.js";
function Login(){
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const{
        isAuthenticated
    }=useSelector(state=>state.auth);
    const{
        loading,
        error
    }=useSelector(state=>state.auth);
    const authState=useSelector(state=>state.auth);
    console.log(authState);
    const{
        register,
        handleSubmit,
        formState:{errors}
    } = useForm();
    if(isAuthenticated){
        return <Navigate to="/dashboard" replace />;
    }
    async function onSubmit(data)
    {
        const result=await dispatch(login(data));
        if(
            result.type==="auth/login/fulfilled"
        )
        {
            navigate("/dashboard");
        }
        console.log(result);
    }
    return(
        <AuthLayout>
            <div className="w-[450px] bg-white p-10 rounded-2xl shadow-xl">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">AI Campus Helpdesk</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            register={register}
                            rules={{
                                required: "Password is required",
                            }}
                            error={errors.password}
                            />
            {
                error &&
                (
                    <p className="text-red-500 mb-4">
                        {error}
                    </p>
                )
            }
            <Button text={
                loading?"Logging In..."
                :"Login"
            } 
            type="submit"/>
            <p className="text-center mt-4 text-sm">Don't have an account?<Link to="/register" className="text-blue-600 ml-1">Register</Link></p>
            </form>
            </div>
        </AuthLayout>
    );
}
export default Login;