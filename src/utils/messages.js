const genrateMessage = (username,text) =>{
    return {
        username,
        text,
        createdAt : new Date().getTime()
    }
}
const genrateLocationMessage = (username,url) =>{

    return {
        username,
        url,
        createdAt:new Date().getTime()
    }
}
module.exports = {
    genrateMessage,
    genrateLocationMessage
}