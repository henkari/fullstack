import React, {useState, useEffect} from 'react'
import noteservices from './services/notes'
import ReactDOM from 'react-dom/client'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const App=()=>{
const [notes, setNotes]=useState([])
const [newText, setNewText]=useState({name:'', number:''})
const [show, setShow]=useState(false)
const handleShow=()=>{
  setShow(true)
}
const handleClose=()=>{
  setShow(false)
}
const handleOnChange=(e)=>{
  const {name, value}=e.target
  const newData={...newText, [name]:value}
  setNewText(newData)
}
const addText=(e)=>{
  e.preventDefault()
  const data={
    name: newText.name,
    number:newText.number
  }
noteservices
.post(data)
.then(response=>{console.log(response)
setNotes(notes.concat(response.data))
setNewText({name:'', number:''})
})
}
const deleteNote=(id)=>{
 let result=confirm('this will delete note')
 if(result){
  noteservices
  .remove(id)
  .then(response=>{console.log(response), setNotes(notes.filter(note=>note.id!==id))})
 }
}
const updateNote=(id)=>{
  
}

useEffect(()=>{
  console.log('effect')
  noteservices
  .getAll('http://localhost:3001/notes')
  .then(response=>{
    console.log('response fullfilled',response.data)
    setNotes(response.data)

  })
},[])
return(
  <div>
    <form onSubmit={addText}>
      <input type="text" name='name' value={newText.name} onChange={handleOnChange} />
      <input type="text" name='number' value={newText.number} onChange={handleOnChange} />

      <button type='submit'>add</button>
    </form>
    <ul>
    {notes.map(note =>  // Fix mapping function and access properties of each note
          <li key={note.id}>{note.name} {note.number} 
          <button 
          onClick={()=>deleteNote(note.id, note.name)}>
            delete</button><button onClick={()=>updateNote(note.id)}>update</button></li> // Access content property of each note
        )}
  </ul>
  </div>
)
}
export default App;