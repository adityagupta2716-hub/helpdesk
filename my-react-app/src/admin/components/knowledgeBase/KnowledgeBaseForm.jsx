import {useForm} from "react-hook-form";
import FormInput from "../../../components/common/forms/FormInput";
import FormTextarea from "../../../components/common/forms/FormTextarea";
import FormSelect from "../../../components/common/forms/FormSelect";
import Button from "../../../components/common/Button";
import useDepartmentOptions from "../../../hooks/useDepartmentOptions";
import { useEffect } from "react";
function KnowledgeBaseForm({
    onSubmit,
    initialData,
    onCancel
})
{
    const DEPARTMENT_OPTIONS=useDepartmentOptions();
    const{
        register,
        handleSubmit,
        reset,
        formState:{errors}
    }=useForm();
    useEffect(()=>{
        reset(
            initialData?
            {
                ...initialData,
                keywords:initialData.keywords?.join(", ")||""
            }
            :{
                question:"",
                answer:"",
                category:"",
                keywords:""
            }
        );
    },[
        initialData,
        reset
    ]);
    return(
        <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Add/Edit KnowledgeBase
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                    <FormInput 
                    label="Question"
                    type="text"
                    placeholder="Enter FAQ question" 
                    name="question"
                    register={register}
                    rules={{
                        required:" Question is required"
                    }}
                    error={errors.question}
                    />
                    <FormTextarea 
                    label="Answer"
                    placeholder="Enter FAQ answer"
                    name="answer"
                    register={register}
                    rules={{
                        required:"Answer is required"
                    }}
                    error={errors.answer}
                    />
                    <FormSelect
                        label="Category"
                        name="category"
                        register={register}
                        rules={{
                            required:"Category is required"
                        }}
                        errors={errors.category}
                        options={DEPARTMENT_OPTIONS}
                    />
                    <FormTextarea 
                    label="Keywords"
                    placeholder="wifi,internet,hostel,payment"
                    name="keywords"
                    register={register}
                    rules={{
                        required:"Keywords are required"
                    }}
                    error={errors.keywords}
                    />
                    {/* <FormSelect
                        label="Status"
                        name="status"
                        register={register}
                        rules={{
                            required:"Status is required"
                        }}
                        errors={errors.status}
                        options={[
                            {
                                value:"Active",
                                label:"Active"
                            },
                            {
                                value:"Inactive",
                                label:"Inactive"
                            }
                        ]}
                    /> */}
                <div className="flex gap-4 mt-4">
                    <Button text="Save FAQ" type="submit"/>
                    <Button text="Cancel" type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600"/>
                </div>
            </form>
        </div>
    );
}
export default KnowledgeBaseForm;