from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import Todo
import json

def todo_list(request):
    """List all todos here"""
    if request.user.is_authenticated:
        todos = Todo.objects.all()
    else:
        try:
            todos_data = json.loads(request.COOKIES['todo'])
            todos = [todos_data[i] for i in todos_data.keys()]
            for todo, id in zip(todos, todos_data.keys()):  
                todo['id'] = int(id); 
                todo['completed'] = False if todo['completed'] == "False" else True
        except:
            todos = {}

    context = {'todos': todos}
    template_name = 'myapp/todo_list.html'
    return render(request, template_name, context)

def add_todo(request):
    """Add new todo in database on the basis of authentication"""
    if request.user.is_authenticated:
        response = json.loads(request.body)
        title = response['title']
        Todo.objects.create(title=title)
        return JsonResponse("item added", safe=False)
    
    return JsonResponse("", safe=False)

def edit_todo(request):
    """Edit an existing todo"""
    pass

def complete_todo(request, todo_id):
    """Mark a todo as completed"""
    todo = get_object_or_404(Todo, id=todo_id)
    todo.completed = True
    todo.save()
    return JsonResponse("marked as completed", safe=False)

def delete_completed(request):
    """Delete all todos with completed status=True"""
    if request.user.is_authenticated:
        [todo.delete() for todo in Todo.objects.filter(completed=True)]
        return JsonResponse("completed items deleted successfully", safe=False)
    return JsonResponse("not authenticated", safe=False)

def delete_all(request):
    """Delete all todos in the database"""
    [todo.delete() for todo in Todo.objects.all()]
    return JsonResponse("all deleted successfully", safe=False)
