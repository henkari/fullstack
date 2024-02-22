import axios from 'axios'
const baseurl='http://localhost:3001/notes'
const getAll=()=>{
    return axios.get(baseurl)
 }
 const post=(newObject)=>{
    return axios.post(baseurl, newObject)
 }
 const update=(newObject,id)=>{
    return axios.put(`${baseurl}/${id}`,newObject)
 }
 const remove=(id)=>{
   return axios.delete(`${baseurl}/${id}`)
 }

 export default {getAll, post, update, remove}