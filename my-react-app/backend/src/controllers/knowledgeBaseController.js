const KnowledgeBase = require("../models/KnowledgeBase.js");
const Notification=require("../models/Notification.js");
const User=require("../models/User.js");

const getFAQs=async(req,res)=>{
    try{
        const faqs=await KnowledgeBase.find({isActive:true})
        .sort({createdAt:-1});
        res.status(200).json({
            count:faqs.length,
            faqs
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};

const createFAQ=async(req,res)=>{
    try{
        const{
            question,
            answer,
            category,
            keywords
        }=req.body;
        if(!Array.isArray(keywords))
        {
            return res.status(400).json({
                message:"Keywords must be an array"
            });
        }
        const faq=await KnowledgeBase.create({
            question,
            answer,
            category,
            keywords,
            createdBy:req.user._id
        });
        const admins=await User.find({
            role:"admin"
        });
        for(const admin of admins)
        {
            await Notification.create({
                user:admin._id,
                title:"Knowledge Base Updated",
                message:`New FAQ added under ${category}`
            });
        }
        res.status(201).json({
            message:"FAQ created successfully",
            faq
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};

const updateFAQ=async(req,res)=>{
    try{
        const faq=await KnowledgeBase.findById(req.params.id);
        if(!faq)
        {
            return res.status(404).json({
                message:"FAQ not found"
            });
        }
        faq.question=req.body.question;
        faq.answer=req.body.answer;
        faq.category=req.body.category;
        if(Array.isArray(req.body.keywords))
        {
            faq.keywords=req.body.keywords;
        }
        await faq.save();
        res.status(200).json({
            message:"FAQ updated successfully",
            faq
        });

    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
const deleteFAQ=async(req,res)=>{
    try{
        const faq=await KnowledgeBase.findById(req.params.id);
        if(!faq)
        {
            return res.status(404).json({
                message:"FAQ not found"
            });
        }
        await faq.deleteOne();
        res.status(200).json({
            message:"FAQ deleted succesfully"
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        })
    }
};
module.exports={
    getFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ
};