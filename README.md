# TODO APP

I created this todo list app in django. There are huge variety of todo apps available. The unique thing about my app is it works for both,

- Authenticated Users
- Unauthenticated Users

For the authenticated users, the todos will be stored
in the Database with their profile reference. In simple
words each user can manage their todos privately. They 
can login and logout.

For the unauthenticated users, their todos will be stored
in their browser's COOKIE for a limited time(2 days). They
would have no access to the database. You can say its only
Client-Side functionality.

Both the type of users can create and delete todos. But only
Authenticated users can edit their todos.

The design of the app is created with Bootstrap.