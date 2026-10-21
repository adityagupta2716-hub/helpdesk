const Department=require("../models/Department.js");
const getDepartments=async(req,res)=>{
    try{
        const departments=await Department.find({
            isActive:true
        }).sort({name:1});
        res.status(200).json({
            count:departments.length,
            departments
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

const createDepartment=async(req,res)=>{
    try{
        const{
            name,
            description
        }=req.body;
        const existingDepartment=await Department.findOne({name});
        if(existingDepartment)
        {
            return res.status(400).json({
                message:"Department already exists"
            });
        }
        const department=await Department.create({
            name,
            description
        });
        res.status(201).json({
            message:"Department created successfully",
            department
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
const updateDepartment=async(req,res)=>{
    try{
        const{
            name,
            description
        }=req.body;
    
    const department=await Department.findById(req.params.id);
    if(!department)
    {
        return res.status(404).json({
            message:"Department not found"
        });
    }
    department.name=name;
    department.description=description;
    await department.save();
    res.status(200).json({
        message:"Department updated successfully",
        department
    });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
module.exports={
    getDepartments,
    createDepartment,
    updateDepartment
};


