const users = []
//add user , removeUser,getUser,getuserinroom
const addUser = ({id,username,room}) =>{
//clean the data
username=username.trim().toLowerCase()
room = room.trim().toLowerCase()
//validate
if(!username||!room)
    return {
        error:'Username and Room are required'
    }
//check for existing
const existingUser = users.find((user)=>{
    return user.username===username&&user.room===room
})
if(existingUser)
{
    return {
     error:'Username is in use'   
    }
}
//state user
const user = {id,username,room}
users.push(user)
return {user}
}
const removeUser = (id)=>{
    const index = users.findIndex((user)=>user.id===id)
    if(index!==-1)
    {
        return users.splice(index,1)[0]
    }
}
const getUser = (id) =>{
    return users.find((user)=>user.id===id)
}
 const getuserinroom =  (room) =>{
    return users.filter((user)=>user.room===room)
 }
module.exports={
    addUser,
    removeUser,
    getUser,
    getuserinroom
}