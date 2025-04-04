const socket = io()

const clientsTotal = document.getElementById('client-active')

const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('nameInput')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

socket.on('clients-active', (data) => {
    clientsTotal.innerText = `Active: ${data}`
    console.log(data)
})

function sendMessage() {
    if (messageInput.value === '') return
    console.log(messageInput.value)

    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date(),
    }
    socket.emit('message', data)
    addMessage(true, data)
    messageInput.value = ''
}

socket.on('chat-msg', (data) => {
    console.log(data)
    addMessage(false, data)
})

function addMessage(isOwn, data) {
    clearFeedback()
    console.log(data)
    const element = `<li class="${isOwn ? "message-right" : "message-left"} flex flex-col">
                        <p class="message text-sm text-[#BC6FF1]">${data.name}</p>
                        <p>${data.message}</p>
                        <span class="text-xs text-end"> ${moment(data.dateTime).format('LT')}</span>
                    </li>`

    messageContainer.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: ` ${nameInput.value} is typing...`,
    })
})
messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: '',
    })
})

socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
          <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
          </li>
    `
    messageContainer.innerHTML += element
})

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach((element) => {
        element.parentNode.removeChild(element)
    })
}