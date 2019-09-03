const socket = io()
const $messageForm = document.querySelector('#message-form')
const $messageFormIuput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendlocationButton = document.getElementById('sendlocation')
const $message = document.getElementById('message')
const messagetemplate =document.getElementById('message-template').innerHTML
const $location = document.getElementById('message')
const locationtemplate = document.getElementById('location-template').innerHTML
const {username,room}=Qs.parse(location.search,{ ignoreQueryPrefix:true })
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML
const autoscroll = () =>{
//NEW message 
const $newMessage = $message.lastElementChild
//height of new message
const newMessageStyles = getComputedStyle($newMessage)
const newMessageMargin = parseInt(newMessageStyles.marginBottom)
const newMessageHeight = $newMessage.offsetHeight+newMessageMargin
//visible height
const visibleHeight = $message.offsetHeight
//height of  messages container
const  containerHeight = $message.scrollHeight
//how i scrolled
const scrolloffset= $message.scrollTop+visibleHeight
if(containerHeight-newMessageHeight<=scrolloffset)
{
    $message.scrollTop = $message.scrollHeight
}

}
socket.on('message',welcome =>{
    console.log(welcome)
    const html = Mustache.render(messagetemplate,{
        message:welcome.text,
        createdAt:moment(message.createdAt).format('HH:mm a'),
        username:welcome.username
    })
    $message.insertAdjacentHTML('beforeend',html)
    autoscroll();
})
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    $messageFormButton.setAttribute('disabled','disabled')
    var message =e.target.elements.message.value;
    socket.emit('sendmessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormIuput.value=''
        $messageFormIuput.focus()
        if(error)
        {
            return console.log(error)
        }
        console.log('Message Delivered')
    })
}) 
socket.on('locationmessage',(info)=>{
    const html = Mustache.render(locationtemplate,{
        location:info.url,
        creatAt:moment(info.createdAt).format('HH:mm a'),
        username:info.username
    })
    $message.insertAdjacentHTML('beforeend',html)
    autoscroll()
    //console.log(URL)
})
socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.getElementById('sidebar').innerHTML=html;

})
document.getElementById('sendlocation').addEventListener('click',()=>{
       if(!navigator.geolocation)
       {
          return  alert('Geolocation is not supported by your browser')

       }
       $sendlocationButton.setAttribute('disabled','disabled')
       navigator.geolocation.getCurrentPosition((position)=>{
           $sendlocationButton.removeAttribute('disabled')
            socket.emit('sendlocation',{
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            },()=>{
                console.log('location shared')
            })
       })
})
socket.emit('join',{username,room},(error)=>{
//console.log(error)
if(error)
{
    alert(error)
    location.href="/"
}
})