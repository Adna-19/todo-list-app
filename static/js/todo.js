document.getElementById("todo-form").addEventListener("submit", function (e){
    e.preventDefault();
    
    var title = document.getElementById("todo-form").title.value;
    var action = document.getElementById("todo-form").Add.value;

    if (user == 'AnonymousUser') {
        addToCookie(title, action)
    }else{
        addToDatabase(title, action)
    }
});

var completeLinks = document.getElementsByClassName("completeIt");
for(var i = 0; i < completeLinks.length; i++) {
    completeLinks[i].addEventListener('click', completeTodo);
}

function completeTodo() {
    var todo_id = this.dataset.todo;
    if (user == 'AnonymousUser') {
        // only mark complete item in cookie
        todo[todo_id]['completed'] = "True";
        document.cookie = 'todo=' + JSON.stringify(todo) + ';domain=;path=/';
        location.reload();
    }else{
        // mark item as completed in database
        var url = todo_id+'/complete/'
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: {},
        })
        .then((response) =>{
            return response.json();
        })
        .then((data) => {
            console.log(data, 'marked as completed');
            location.reload()
        })
    }
}

document.querySelectorAll('.edit-btn').forEach((button) => button.addEventListener('click', function() {
    const todo_id = this.dataset.todo_id;
    const title = this.dataset.title;

    const form = document.createElement('form');

    form.action = '/todo/'+todo_id+'/edit/';
    form.method = 'POST';
    form.className = 'edit-form';
    form.innerHTML = `
        <div class='input-group mt-3'>
            <input type='text' name='title' id='${todo_id}' value='${title}' class='form-control'>
            <input type='submit' value='save' class='btn btn-sm btn-primary'>
        </div>
    `;

    const item = document.querySelector(`#item-${todo_id}`);
    item.appendChild(form);

    document.querySelector('#edit-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const todo_title = document.querySelector('#edit-form').title.value;
        const todo_id = document.querySelector('#edit-form').title.id;
    
        const url = todo_id + '/edit/';
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({'title': todo_title})
        })
        .then((response) => {
            return response.json();
        })
    });

}));

function addToCookie(title, action) {
    if (action == 'add') {
        var todo_id = Object.keys(todo).length + 1;
        if (todo[todo_id] == undefined) {
            let date = new Date();
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            let formatted_date = months[date.getMonth()] + ". " + date.getDate() + ", " + date.getFullYear();
            let formatted_time = formatAMPM(date);
            todo[todo_id] = {
                'title': title,
                'completed': 'False',
                'date_created': formatted_date + " " +formatted_time
            };
        }
    }
    document.cookie = 'todo=' + JSON.stringify(todo) + ';domain=;path=/';
    location.reload();
}

function formatAMPM(date) {
    // function to get time in a clean format
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours > 12? 'p.m': 'a.m';

    hours = hours % 12;
    hours = hours ? hours: 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;

    var strTime = hours +":"+ minutes + " " +ampm;
    return strTime
}

function addToDatabase(title, action) {
    var url = 'add/';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'title': title})
    })

    .then((response) => {
        return response.json();
    })

    .then((data) => {
        console.log(data, ' added to database');
        location.reload();
    })
}
// adding delete buttons Events
document.getElementById("delete-all").addEventListener("click", function (){
    if (user == "AnonymousUser"){
        setCookie('todo', todo, 0);
    }else{
        var url = 'delete/all/'
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: {},
        })
        .then((response) =>{
            return response.json()
        })
        .then((data) =>{
            console.log(data)
            location.reload();
        })
    }
});
document.getElementById("delete-completed").addEventListener("click", function (){
    if (user == "AnonymousUser"){
        // delete all todos marked as completed = True for unauthenticated user.
        for(todo_id in todo) {
            if (todo[todo_id]['completed'] == 'True') {
                delete todo[todo_id];
            }
        }
        // reflect changes in cookies...
        setCookie('todo', todo, 1);
    }else{
        var url = 'delete/completed/'
        fetch(url, {
            method:'POST', 
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: {}
        })
        .then((response) =>{
            return response.json()
        })
        .then((data) =>{
            console.log(data)
            location.reload();
        })
    }
});
