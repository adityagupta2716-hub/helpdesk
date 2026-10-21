import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import FormInput from "../../components/common/forms/FormInput.jsx";
import FormSelect from "../../components/common/forms/FormSelect.jsx";
import FormTextarea from "../../components/common/forms/FormTextarea.jsx";
import Button from "../../components/common/Button.jsx";
import {useForm} from "react-hook-form";
import { TICKET_STATUS_OPTIONS } from "../../constants/ticketStatus.js";
import { PRIORITY_OPTIONS } from "../../constants/priorities.js";
//import { DEPARTMENT_OPTIONS } from "../../constants/departments.js";
import useDepartmentOptions from "../../hooks/useDepartmentOptions.js"
import { CATEGORY_OPTIONS } from "../../constants/category.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewTicket } from "../../features/tickets/ticketSlice.js";

function CreateTicket(){
    const DEPARTMENT_OPTIONS=useDepartmentOptions();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const{
        register,
        handleSubmit,
        formState:{errors}
    }=useForm();
    async function onSubmit(data)
    {
        const result=await dispatch(createNewTicket(data));
        if(result.type==="tickets/createTicket/fulfilled")
        {
            const ticketId=result.payload.ticket._id;
            navigate(`/student/tickets/${ticketId}`,
                {
                    state:{showAttachmentToast:true}
                }
            );
        }
    }
    return(
        <DashboardLayout>
            <h1 className="text-3xl font-bold">
                Create New Ticket
            </h1>
            <p className="text-gray-500 mt-2">
                Submit a new issue for support.
            </p>
            <div className="bg-white rounded-xl shadow p-6 mt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Issue Information
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Describe the issue you are facing.
                        </p>
                    </div>
                    <FormInput
                    label="Ticket Title"
                    type="text"
                    placeholder="Enter a short title for your issue"
                    name="title"
                    register={register}
                    rules={{required:"Ticket title is required"}}
                    error={errors.title} />
                    <FormTextarea
                        label="Description"
                        placeholder="Describe your issue in detail..."
                        name="description"
                        register={register}
                        rules={{
                            required:"Description is required"
                        }}
                        error={errors.description}
                        rows={5}
                    />
                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold">
                            Ticket Details
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Help us route your tickets correctly.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormSelect
                            label="Department"
                            name="department"
                            register={register}
                            rules={{
                                required:"Department is required"
                            }}
                            error={errors.department}
                            options={DEPARTMENT_OPTIONS}
                        />

                        <FormSelect 
                        label="Category"
                        name="category"
                        register={register}
                        rules={{required:"Category is required"}}
                        error={errors.category}
                        options={CATEGORY_OPTIONS}
                        />
                        
                        <FormSelect
                            label="Priority"
                            name="priority"
                            register={register}
                            rules={{
                                required:"Priority is required"
                            }}
                            error={errors.priority}
                            options={PRIORITY_OPTIONS}
                        />
                        <FormSelect
                        label="Status"
                        name="status"
                        register={register}
                        rules={{
                            required:"Status is required"
                        }}
                        error={errors.status}
                        options={[
                            {value:"Open", label:"Open"},
                            {value:"Resolved",label:"Resolved"}
                        ]}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" className="px-6 py-2 border rounded-lg hover:bg-gray-100">
                            Cancel
                        </button>
                        <Button text="Submit Ticket" type="submit"/>
                    </div>
                </form>


            </div>

        </DashboardLayout>
    );
}
export default CreateTicket;