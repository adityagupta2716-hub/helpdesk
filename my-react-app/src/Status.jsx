function Status({loggedIn}){
    if(loggedIn){
        return <h2>Welcome Back!</h2>;
    }
    return <h2>Please Login</h2>;
}
export default Status;