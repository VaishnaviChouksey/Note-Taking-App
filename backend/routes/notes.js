const express=require('express');
const router=express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes=require('../models/Notes');
const { body, validationResult } = require('express-validator'); 

//Route 1:Get all the notes using: GET "/api/notes/fetchallnotes".Login required

router.get('/fetchallnotes',fetchuser,async (req,res)=>{     
    try{
       const notes=await Notes.find({user:req.user.id});
       res.json(notes);
    }
    catch(error){
            console.error(error.message);
            res.status(500).send("An error has occured.");
    }
})

//Route 2:Add a new note using: POST "/api/notes/addnewnote".Login required

router.post('/addnewnote',fetchuser,[
    body('title','Enter a valid title').isLength({min:3}), 
    body('description','Description must be atleast 5 characters').isLength({min:5})],
    async (req,res)=>{     
    try{
        const{title,description,tag}=req.body;

    // If there are errors, return bad request
    const errors=validationResult(req);    
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const note=new Notes({
        title,description,tag,user:req.user.id
    })
    const savednote=await note.save();
    res.json(savednote);
    }
    catch(error){
            console.error(error.message);
            res.status(500).send("An error has occured.");
    }
})

//Route 3:Add a new note using: PUT "/api/notes/updatenote/:id".Login required
router.put('/updatenote/:id',fetchuser,async (req,res)=>{ 
const{title,description,tag}=req.body;
try{
const newNote={};
if(title){newNote.title=title};
if(description){newNote.description=description};
if(tag){newNote.tag=tag};

//Find the note and update it
let note=await Notes.findById(req.params.id);
if(!note){return res.status(404).send("Not Found")};
//Don't allow if user does not owns this note
if(note.user.toString() !==req.user.id){
    return res.status(401).send("Not Allowed");
}
note =await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
res.json({note});
}
catch(error){
    console.error(error.message);
    res.status(500).send("An error has occured.");
}
})

//Route 4:Add a new note using: DELETE "/api/notes/deletenote/:id".Login required
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{ 
try{
//Find the note and delete it
let note=await Notes.findById(req.params.id);
if(!note){return res.status(404).send("Not Found")};
//Don't allow if user does not owns this note
if(note.user.toString() !==req.user.id){
    return res.status(401).send("Not Allowed");
}
note =await Notes.findByIdAndDelete(req.params.id);
res.json({"Success":"Note has been deleted"});
}
catch(error){
    console.error(error.message);
    res.status(500).send("An error has occured.");
}
})

module.exports=router
