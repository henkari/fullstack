import React, { useState, useEffect } from 'react';
import noteservices from './services/notes';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import './index.css'

const Notification=({message})=>{
if (message===null){
  return null
}
return (
 <div>
  <p className='notification'>{message}</p>
 </div>
)
}
const ErrorMessage=({errorMessage})=>{
  if(errorMessage===null){
    return null
  }
  return( 
    <div>
    <p className='error'>{errorMessage}</p>
    </div>
    )
  }
const App = () => {
  const [notes, setNotes] = useState([]);
  const [message, setMessage]=useState(null)
  const [errorMessage, setErrorMessage]=useState(null)
  const [newText, setNewText] = useState({name: '', number: '' });
  const [update, setUpdate] =useState({id:'', name:'', number:''})
  const [isOpen, setIsOpen] = useState(false);

  const handleShow = (id, name, number) => {
    
    const note = notes.find(n => n.id === id)
    const noteTochange={id:id, name:name, number:''}
    
    setUpdate(noteTochange)
    setIsOpen(true);
    
  };
  
 const handleUpdate=(e)=>{
 const{name, value}=e.target
  const updatedNote={...update, [name]:value}
  setUpdate(updatedNote)
 }
 
 const addUpdate=()=>{
 console.log(update.name)
 noteservices
      .update(update,update.id)
      .then(response=>{console.log(response.data)
        setNotes(notes.map(note=>note.id!==update.id? note:response.data ))
        setUpdate({id:'', name:'', number:''})
      })
      .catch(error=>{setErrorMessage(`note: ${update.name} have been removed`)})
      
      setTimeout(() => {setErrorMessage(null)
      }, 5000);
      notes.filter(n=>{n.id !==update.id})
      handleClose()
      //window.location.reload();
 }
  const handleClose = () => {
    setIsOpen(false); // Close the modal
  };
  
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...newText, [name]: value };
    setNewText(newData);
  };

  const addText = (e) => {
    e.preventDefault();
    

    noteservices
    .post(newText)
      .then(response => {
        console.log(response);
        setNotes(notes.concat(response.data));
        setMessage(`new number added:${newText.number}`)
        setNewText({ name: '', number: '' });
      })
          
    setTimeout(() => {
      setMessage(null)
    }, 5000);
    };

  const deleteNote = (id) => {
    let result = window.confirm('Are you sure you want to delete this note?');
    if (result) {
      noteservices
      .remove(id)
        .then(response => {
          console.log(response);
          setNotes(notes.filter(note => note.id !== id));
        });

    }
  };

  
  useEffect(() => {
    noteservices.getAll()
      .then(response => {
        console.log('response fulfilled', response.data);
        setNotes(response.data);
      });
  }, []);

  return (
    <div>
      <form onSubmit={addText}>
        <input type="text" name='name' value={newText.name} onChange={handleOnChange} />
        <input type="text" name='number' value={newText.number} onChange={handleOnChange} />
        <button type='submit'>Add</button>
        <Notification message={message}/>
        <ErrorMessage errorMessage={errorMessage}/>
      </form>
      <ul>
        {notes.map(note =>
          <li key={note.id}>
            {note.name} {note.number}
            <button onClick={() => deleteNote(note.id)}>Delete</button>
            <button onClick={()=>handleShow(note.id, note.name, note.number)}>Update</button>
          </li>
        )}
      </ul>
      <Modal open={isOpen} onClose={handleClose} center>
        <div><input type="text" name='number' value={update.number?update.number:' '} onChange={handleUpdate}/></div>
            <button onClick={addUpdate}>update number</button>
      </Modal>
    </div>
  );
};

export default App;
