var log = function () {
    console.log.apply(console, arguments);
}

//给add button 绑定事件
//当add这个按钮被点击时，在container中末尾添加一个todo-cell，
//该todo-cell使用模板生成
var addButton = document.querySelector('#id-button-add')
addButton.addEventListener('click', function () {
    log('add a new todo')
    //获得输入值和输入时间，生成一个todo对象
    var todoInput = document.querySelector('#id-input-todo')
    var task = todoInput.value
    var todo = {
        'task': task,
        'time': currentTime(),
    }
    todoList.push(todo)
    saveTodos()
    inserTodo(todo)
})
var currentTime = function () {
    var d = new Date()
    var month = d.getMonth() + 1
    var date = d.getDate()
    var hours = d.getHours()
    var minutes = d.getMinutes()
    var seconds = d.getSeconds()
    var timestring = `${month}/${date} ${hours}:${minutes}:${seconds}`
    return timestring
}
var inserTodo = function (todo) {
    //根据todo对象生成todo-cell的HTML
    var t = templateTodo(todo)
    //向todoContainer中添加todo-cell
    var todoContainer = document.querySelector('#id-div-container')
    todoContainer.insertAdjacentHTML('beforeend', t)
}
var templateTodo = function (todo) {
    var t = `
        <div class="todo-cell">
            <button class="todo-done">完成</button>
            <button class="todo-delete">删除</button>
            <button class="todo-edit">编辑</button>
            <span class="todo-label" contenteditable="false">${todo.task}</span>
            <span class="time">${todo.time}</span>
        </div>
    `
    return t
}


//使用事件委托机制，container捕捉到click事件，查找哪个子元素触发的事件
//当完成按钮触发点击事件时，给整个todo-cell 添加或删除 done样式
//当删除按钮触发点击事件时，删除整个todo-cell元素
var todoContainer = document.querySelector('#id-div-container')
todoContainer.addEventListener('click', function (event) {
    log('todoContainer catch one click event', event, event.target)
    var target = event.target

    if(target.classList.contains('todo-done')) { //是完成按钮触发的事件
        log('done button trigger click event')
        var todoCell = target.parentElement
        toggleClass(todoCell, 'done')
        toggleStatus
    } else if(target.classList.contains('todo-delete')) { //是删除按钮触发的事件
        log('delete button trigger click event')
        //从todoList中删除该todo
        var index = indexOfElement(target.parentElement)
        log('todoList remove index', index)
        todoList.splice(index, 1)
        saveTodos()
        //从HTML中删除该todo
        var todoCell = target.parentElement
        todoCell.remove()
    } else if (target.classList.contains('todo-edit')) { //是编辑按钮触发的事件
        log('edit button trigger click event')
        span = target.parentElement.children[3]
        span.contentEditable = true // span.setAttribute('contenteditable', 'true')
        span.focus()
    }
})
var toggleClass = function (element, className) {
    if(element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}
var indexOfElement = function (element) {
    var parent = element.parentElement
    for (var i = 0; i < parent.children.length; i++) {
        var e = parent.children[i]
        if (e === element) {
            return i
        }
    }
}


var saveTodos = function () {
    var s = JSON.stringify(todoList)
    localStorage.todoList = s
}
var loadTodos = function () {
    if (localStorage.todoList) {
        var s = localStorage.todoList
        return JSON.parse(s)
    }
    return []
}
//程序加载后，加载localstorage中的todo到页面中
todoList = loadTodos()
for (var i = 0; i < todoList.length; i++) {
    var todo = todoList[i]
    inserTodo(todo)
}
