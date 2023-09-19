import React,{useContext} from 'react'
import noteContext from '../context/notes/noteContext';

const NoteItem = (props) => {
  const context =useContext(noteContext);
  const{deleteNote}=context;
    const {note,updateNote}=props;
  return (
    <div className="col-md-3">
   <div className="card my-3">
  <div className="card-body">
    <div className="d-flex align-items-center">
    <h5 className="card-title">{note.title}</h5>
    <i className="fa fa-trash mx-2" style={{cursor:"pointer"}} onClick={()=>{deleteNote(note._id);props.showalert("Deleted Note Successfully","success");}}></i>
    <i className="fa fa-edit mx-2 " style={{cursor:"pointer"}} onClick={()=>{updateNote(note)}}></i>
    </div>
    <p className="card-text">{note.description}</p>
    <p className="card-text">Tag: {note.tag.length!==0?note.tag:"Empty"}</p>
  </div>
</div>
    </div>
  )
}

export default NoteItem