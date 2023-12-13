const expressAsyncHandler = require("express-async-handler");
const Contact= require("../models/contactModel");



//@desc Get all contacts
// @route GET /api/contacts
//@access public
const getContacts =expressAsyncHandler( async (req,res)=>{
    const contacts=  await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts);
});

//@desc Create new contacts
// @route post /api/contacts
//@access private
const createContact = expressAsyncHandler(async (req,res)=>{
    console.log("The body is : " , req.body);
    const {name,email,phone}=req.body;
    if(!name||!email||!phone){
        res.status(400);
        throw new  Error("All feilds are mandatyr");
    }

    const contact= await Contact.create(
        {
            name,
            email,
            phone,
            user_id:req.user.id,
        }
    )
    
    res.status(201).json(contact);
});

//@desc get contacts
// @route get /api/contacts/:id
//@access private
const getContact =expressAsyncHandler(async (req,res)=>{

    const contact= await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});

//@desc update contact
// @route update /api/contacts/"id"
//@access private
const updateContact = expressAsyncHandler(async (req,res)=>{

    const contact= await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString()!= req.user.id){
        res.status(403);
        throw new Error("User dont have permission to update other user consacts");
    }

    const updatedContact= await Contact.findByIdAndUpdate(req.params.id,req.body,{new: true});
    res.status(201).json(updatedContact);
});

//@desc delelte contact
// @route delete /api/contacts/:id
//@access private
const deleteContact =expressAsyncHandler(async (req,res)=>{

    const contact= await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString()!= req.user.id){
        res.status(403);
        throw new Error("User dont have permission to update other user consacts");
    }


    await contact.deleteOne({_id:req.params.id});

    res.status(201).json(contact);
});
 


module.exports={getContact,getContacts,createContact,updateContact,deleteContact};