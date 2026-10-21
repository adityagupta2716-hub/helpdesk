import campusImage from "../../assets/campus.png";
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">

      {/* Left Section */}

      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-900 to-blue-600 text-white p-12 flex-col justify-center p-12">

        <div>
          <h1 className="text-3xl font-bold">
            AI Campus Helpdesk
          </h1>

          <p className="mt-2 text-blue-100">
            Smart Support, Better Campus
          </p>
        </div>

        <div>
            <img src={campusImage} alt="Campus" className="w-80 mx-auto"/>
          <h2 className="text-2xl font-semibold">
            Smart Campus Support 
          </h2>

          <p className="mt-3 max-w-md text-blue-100">
            Raise tickets, track issues,
            and get AI-powered campus support for academics, hostel, transport and campus services.
          </p>
        </div>

      </div>

      {/* Right Section */}

      <div className="w-full md:w-1/2 flex items-center justify-center bg-slate-50">

        {children}

      </div>

    </div>
  );
}

export default AuthLayout;