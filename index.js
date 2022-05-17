const mode = document.getElementById("mode");
const bg = document.getElementById("bg-img");
const body = document.querySelector("body");
const container = document.querySelector(".container");
const list = document.querySelector(".todo-list");
const input = document.querySelector(".input-box");
const setup = document.querySelector(".setup");
const sort = document.querySelector(".sort");
const btns = document.querySelectorAll(".sort-btn");
const contentTemplate = document.querySelector(".content-template");

let todoitems = [];


// 更换主题
const switchmode = mode.addEventListener("click", () => {
    const modeurl = mode.src.substring(mode.src.lastIndexOf('/') + 1,mode.src.length);
    console.log(modeurl);
        if(modeurl == "icon-sun.svg"){
            mode.src = "./images/icon-moon.svg";
            bg.src = "./images/bg-desktop-light.jpg";
            body.style.backgroundColor = "hsl(236, 33%, 92%)";
            container.classList.toggle("light-theme");
        }else{
            mode.src = "./images/icon-sun.svg";
            bg.src = "./images/bg-desktop-dark.jpg";
            body.style.backgroundColor = "hsl(235, 21%, 11%)";
            container.classList.toggle("light-theme");
        }
});


// 渲染页面
const rendertodo = (todo) => {
    const li = document.createElement("li");
    const item = document.querySelector(`[data-key="${todo.id}"]`);

    localStorage.setItem("todoitems",JSON.stringify(todoitems));

    if(todo.deleted){
        item.remove();
        return;
    }
    

    const ischecked = todo.checked? "done":"";
    li.setAttribute("class",`content-template new-add ${ischecked}`);
    li.setAttribute("data-key",todo.id);
    li.innerHTML = `
    <input type="checkbox" id="${todo.id}" class="check-box">
    <label for="${todo.id}">${todo.text}</label>  
    <button class="delete-button"><img src="./images/icon-cross.svg" alt=""></button>
    `;
    

    if(item){
        list.replaceChild(li,item);
    }else{
        list.append(li);
    }

    countTodo();
}


// 输入框添加到todo栏
const addtodo = (text) => {
    const todo = {
        text,
        checked:false,
        id:Date.now()
    };
    todoitems.push(todo);
    rendertodo(todo);
}


// 划去todo
const completetodo = (key) =>{
    const completeindex = todoitems.findIndex(item =>  item.id === Number(key));
    todoitems[completeindex].checked = !todoitems[completeindex].checked;
    rendertodo(todoitems[completeindex]);
}


// 删除todo
const deletetodo = (key) => {
    const deleteindex = todoitems.findIndex(item => item.id === Number(key));
    const todo = {
        deleted:true,
        ...todoitems[deleteindex]
    };
    todoitems = todoitems.filter(item => item.id !== Number(key));
    rendertodo(todo);
    countTodo();
}


// 清除完成数
const  removeAll = (todoitems) => {
    let remove = []; 
    const removeindex = todoitems.findIndex(item => item.checked == true);
    todoitems.forEach(item => {
        if(item.checked){
            remove.push(item);
        }  
    });
    todoitems.splice(removeindex,remove.length); 
    todoitems.forEach(todo => {
        console.log("hahahhaha");
        rendertodo(todo);
        countTodo();
    }); 
}
    

// 显示个数
const countTodo = () => {
    const todocount = todoitems.filter(item => !item.checked).length;
    const count = document.querySelector(".count");
    count.innerHTML = `${todocount}`;
}


// 回车添加
input.addEventListener("keypress", event => {
    if(event.key == "Enter"){
        event.preventDefault(); 
        const text = input.value.trim();
        if(text !== ""){
            addtodo(text);
            input.value = "";
            input.focus();
        }
    }
});


list.addEventListener("click", event => {    
    if(event.target.classList.contains("delete-button")){
        const key = event.target.parentElement.dataset.key;
        deletetodo(key);
    }

    if(event.target.classList.contains("check-box")){
        const key = event.target.parentElement.dataset.key;
        completetodo(key);
    }
});


// 设置栏点击事件
sort.addEventListener("click", event => {
    list.innerHTML = "";
    const ref = localStorage.getItem("todoitems");
    if(ref){
        todoitems = JSON.parse(ref);
        if(event.target.classList.contains("all")){
            todoitems.forEach(todo => {
                rendertodo(todo);
                countTodo();
            });
        }else if (event.target.classList.contains("active")){
            todoitems.filter(item => !item.checked).forEach(todo => {
                rendertodo(todo);
                countTodo();
            });
        }else if (event.target.classList.contains("completed")){
            todoitems.filter(item => item.checked).forEach(todo => {
                rendertodo(todo);
                countTodo();
            });
        }
    }
});


// 从localstorage中获取数据
document.addEventListener("DOMContentLoaded",() =>{ 
    const ref = localStorage.getItem("todoitems");
    if(ref){
        todoitems = JSON.parse(ref);
        todoitems.forEach(i => {
            rendertodo(i);
            countTodo();
        });
    }
});

// 点击，清除已完成事件
const clear = document.querySelector(".clear-completed");
clear.addEventListener("click",() => {
    list.innerHTML = "";
    const ref = localStorage.getItem("todoitems");
    if(ref){
        todoitems = JSON.parse(ref);
        removeAll(todoitems);
    }
});

// 拖拽todo
