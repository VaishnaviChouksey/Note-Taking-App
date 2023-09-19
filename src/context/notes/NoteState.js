import React, { useState } from "react";
import noteContext from "./noteContext";

const NoteState=(props)=>{
  const host="http://localhost:5000"
 const initialNotes=[]
  const[notes,setNotes]=useState(initialNotes)

// Get note
const getNote= async()=>{
  const response = await fetch(`${host}/api/notes/fetchallnotes`, {
    method: "GET", 
    headers: {
      "Content-Type": "application/json",
      "auth-token":localStorage.getItem('token')
    }
  });
const json=await response.json();
setNotes(json);
}

// Add note
  const addNote= async(title,description,tag)=>{
    const response = await fetch(`${host}/api/notes/addnewnote`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      },
     
      body: JSON.stringify({title,description,tag})
    });
    const note=await response.json();
   
  setNotes(notes.concat(note)); 
  }

// Delete note
  const deleteNote=async (id)=>{

    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      }
    });
    const json=response.json();
    console.log(json);

    const newnotes=notes.filter((note)=>{return note._id!==id});
    setNotes(newnotes);
  }

// Edit note
const editNote= async (id,title,description,tag)=>{
  const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
    method: "PUT", 
    headers: {
      "Content-Type": "application/json",
      "auth-token":localStorage.getItem('token')
    },
   
    body: JSON.stringify({title,description,tag})
  });
   const json= response.json();
   console.log(json);

   let newNotes=JSON.parse(JSON.stringify(notes))
for (let index = 0; index < newNotes.length; index++) {
  const element = newNotes[index];
  if(element._id===id){
    newNotes[index].title=title;
    newNotes[index].description=description;
    newNotes[index].tag=tag;
    break;
  }
    
  
}
setNotes(newNotes);
  }

  
    return (
        <noteContext.Provider value={{notes,addNote,deleteNote,editNote,getNote}}>
               {props.children}
        </noteContext.Provider>
    )
}
export default NoteState;