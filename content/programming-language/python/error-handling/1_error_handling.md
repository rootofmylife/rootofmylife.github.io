# Error Handling

Exceptions in Python is one of those areas that have a surface layer that most people know, and a deeper, almost secret one that a lot of developers don't even know exists. If you want to test yourself on this topic, see if you can answer the following questions:

- When should you catch exceptions raised by functions you call, and when should you not?
- How can you know what exception classes to catch?
- When you catch an exception, what should you do to "handle" it?
- Why is catching all exceptions considered a bad practice, and when is it okay to do it?

## The Basics: Two Paths to Error Handling in Python

I'm going to start with something that I believe many of my readers already know or have seen discussed elsewhere. In Python, there are two main styles of writing error handling code, often called by their unpronounceable acronyms of "LBYL" and "EAFP". Are you familiar with these? In case you are not, below is a quick introduction to them.

### Look Before You Leap (LBYL)

The "look before you leap" pattern for error handling says that you should check that the conditions for performing an action that can fail are proper before triggering the action itself.

```python
if can_i_do_x():
    do_x()
else:
    handle_error()
```

Consider as an example the task of deleting a file from disk. Using, LBYL this could be coded as follows:

```python
if os.path.exists(file_path):
    os.remove(file_path)
else:
    print(f"Error: file {file_path} does not exist!")
```

While as a first impression it may appear that this code is fairly robust, in practice it isn't.

The main problem here is that we need to know all the possible things that can go wrong with deleting a file so that we can check for them before we make the `remove()` call. It is obvious that the file must exist, but a missing file isn't the only reason why a deletion can fail. Here are just a few other reasons why a file may fail to delete:

- The path could be of a directory instead of a file
- The file could be owned by a different user than the one attempting the deletion
- The file could have read-only permissions
- The disk on which the file is stored could be mounted as a read-only volume
- The file could be locked by another process, a common annoyance on Microsoft Windows

How would the delete file example above look if we had to add checks for all these as well?

As you see, it is quite difficult to write robust logic using LBYL, because you have to know all the possible ways in which the functions that you call can fail, and sometimes there are just too many.

Another problem when using the LBYL pattern is that of race conditions. If you check for the failure conditions, and then execute the action, it is always possible for the conditions to change in the small window of time between when the checks were made and when the action was executed.

### Easier to Ask Forgiveness than Permission (EAFP)

I'm sure you realize that I don't have a very high opinion of the LBYL pattern (but in fact it is useful in some situations, as you will see later). The competing pattern says that it is "easier to ask forgiveness than permission". What does this mean? It means you should perform the action, and deal with any errors afterwards.

In Python, EAFP is best implemented using exceptions:

```python
try:
    do_x()
except SomeError:
    handle_error()
```

Here is how to delete a file using EAFP:

```python
try:
    os.remove(file_path)
except OSError as error:
    print(f"Error deleting file: {error}")
```

I hope you agree that in most cases EAFP is preferable to LBYL.

It is a big improvement that with this pattern the target function is tasked with checking and reporting errors, so we as callers can make the call and trust that the function will let us know if the action failed.

On the other side, we need to know what exceptions to write down in the `except` clause, because any exception classes that we miss are going to bubble up and potentially cause the Python application to crash. For a file deletion it is safe to assume that any errors that are raised are going to be `OSError` or one of its subclasses, but in other cases knowing what exceptions a function could raise requires looking at documentation or source code.

You may ask why not catch all possible exceptions to make sure none are missed. This is a bad pattern that causes more problems than it solves, so I do not recommend it except in a few very specific cases that I will discuss later. The problem is that usually bugs in your own code manifest themselves as unexpected exceptions. If you are catching and silencing all exceptions every time you call a function, you are likely to miss the exceptions that shouldn't have occurred, the ones that were caused by bugs that need to be fixed.

To avoid the risk of missing application bugs that manifest as unexpected exceptions, you should always catch the smallest possible list of exception classes, and when it makes sense, don't catch any exceptions at all. Hold on to the thought of not catching exceptions as an error handling strategy. It may sound like a contradiction, but it isn't. I will come back to this.

## Python Error Handling in the Real World

Unfortunately the traditional error handling knowledge doesn't go very far. You can have a complete understanding of LBYL and EAFP and know how `try` and `except` work by heart, and still, many times you may not know what to do or feel that the way you write error handling code could be better.

So now we are going to look at errors in a completely different way that is centered around the errors themselves, and not so much on the techniques to deal with them. I hope this is going to make it much easier for you to know what to do.

### New Errors vs. Bubbled-Up Errors

First, we need to classify the error based on its origin. There are two types to consider:

- Your code found a problem and needs to generate an error. I'll call this type a "new error".
- Your code received an error from a function it called. I'll call this one a "bubbled-up error".

When it comes down to it, these are really the two situations in which errors may come to exist, right? You either need to introduce a new error yourself and put it in the system for some other part of the application to handle, or you received an error from somewhere else and need to decide what to do with it.

In case you are not familiar with the expression "bubbled-up", this is an attribute of exceptions. When a piece of code raises an exception, the caller of the errored function gets a chance to catch the exception in a `try`/`except` block. It the caller doesn't catch it, then the exception is offered to the next caller up the call stack, and this continues until some code decides to catch the exception and handle it. When the exception travels towards the top of the call stack it is said to be "bubbling up". If the exception isn't caught and bubbles up all the way to the top, then Python will interrupt the application, and this is when you see a stack trace with all the levels through which the error traveled, a very useful debugging aid.

### Recoverable vs. Non-Recoverable Errors

Aside from the error being new or bubbled-up, you need to decide if it is recoverable or not. A recoverable error is an error that the code dealing with it can correct before continuing. For example, if a piece of code tries to delete a file and finds that the file does not exist, it's not a big deal, it can just ignore the error and continue.

A non-recoverable error is an error that the code in question cannot correct, or in other words, an error that makes it impossible for the code at this level to continue running. As an example, consider a function that needs to read some data from the database, modify it and save it back. If the reading fails, the function has to abort early, since it cannot do the rest of the work.

Now you have an easy way to categorize an error based on its origin and its recoverable status, resulting in just four different error configurations that you need to know how to handle. In the following sections I will tell you exactly what you need to do for each of these four error types!

### Type 1: Handling New Recoverable Errors

This is an easy case. You have a piece of code in your own application that found an error condition. Luckily this code is able to recover from this error itself and continue.

What do you think is the best way to handle this case? Well, recover from the error and continue, without bothering anyone else!

Let's look at an example:

```python
def add_song_to_database(song):
    # ...
    if song.year is None:
        song.year = 'Unknown'
    # ...
```

Here we have a function that writes a song to a database. Let's say that in the database schema the song's year cannot be null.

Using ideas from the LBYL pattern we can check if the year attribute of the song is not set, to prevent a database write to fail. How do we recover from the error? In this case we set the year to unknown and we keep going, knowing that the database write is not going to fail (from this one reason, at least).

Of course, how to recover from an error is going to be very specific to each application and error. In the example above I'm assuming that the song's year is stored as a string in the database. If it is stored as a number then maybe setting the year to `0` is an acceptable way to handle songs with an unknown year. In another application the year may be required, in which case this wouldn't be a recoverable error for that application.

Makes sense? If you find a mistake or inconsistency in the current state of the application, and have a way to correct the state without raising an error, then no need to raise an error, just correct the state and keep going.

### Type 2: Handling Bubbled-Up Recoverable Errors

The second case is a variation of the first. Here the error is not a new error, it is an error that bubbles up from a function that was called. As in the previous case, the nature of the error is such that the code that receives the error knows how to recover from it and continue.

How do we handle this case? We use EAFP to catch the error, and then we do whatever needs to be done to recover from it and continue.

Here is another part of the `add_song_to_database()` function that demonstrates this case:

```python
def add_song_to_database(song):
    # ...
    try:
        artist = get_artist_from_database(song.artist)
    except NotFound:
        artist = add_artist_to_database(song.artist)
    # ...
```

The function wants to retrieve the artist given with the song from the database, but this is something that may fail from time to time, for example when adding the first song of a given artist. The function uses EAFP to catch the `NotFound` error from the database, and then corrects the error by adding the unknown artist to the database before continuing.

As with the first case, here the code that needs to handle the error knows how to adjust the state of the application to continue running, so it can consume the error and continue. None of the layers in the call stack above this code need to know that there was an error, so the bubbling up of this error ends at this point.

### Type 3: Handling New Non-Recoverable Errors

The third case is a bit more interesting. Now we have a new error of such severity that the code does not know what to do and cannot continue. The only reasonable action that can be taken is to stop the current function and alert one level up the call stack of the error, with the hope that the caller knows what to do. As discussed above, in Python the preferred mechanism to notify the caller of an error is to raise an exception, so this is what we'll do.

This strategy works well because of an interesting property of non-recoverable errors. In most cases, a non-recoverable error will eventually become recoverable when it reaches a high enough position in the call stack. So the error can bubble up the call stack until it becomes recoverable, at which point it'll be a type 2 error, which we know how to handle.

Let's revisit the `add_song_to_database()` function. We've seen that if the year of the song was missing, we decided that can recover and prevent a database error by setting the year to `'Unknown'`. If the song does not have a name, however, it is much harder to know what's the right thing to do at this level, so we can say that a missing name is a non-recoverable error for this function. Here is how we handle this error:

```python
def add_song_to_database(song):
    # ...
    if song.name is None:
        raise ValueError('The song must have a name')
    # ...
```

The choice of what exception class to use really depends on the application and your personal taste. For many errors the exceptions that come with Python can be used, but if none of the built-in exceptions fit, then you can always create your own exception subclasses. Here is the same example implemented with a custom exception:

```python
class ValidationError(Exception):
    pass

# ...

def add_song_to_database(song):
    # ...
    if song.name is None:
        raise ValidationError('The song must have a name')
    # ...
```

The important thing to note here is that the `raise` keyword interrupts the function. This is necessary because we said that this error cannot be recovered, so the rest of the function after the error will not be able to do what it needs to do and should not run. Raising the exception interrupts the current function and starts the bubbling up of the error starting from the closest caller and continuing up the call stack until some code decides to catch the exception.

### Type 4: Handling Bubbled-Up Non-Recoverable Errors

Okay, we have one last error type to review, and this is actually the most interesting of all and also my favorite.

Now we have a piece of code that called some function, the function raised an error, and we in our function have no idea how to fix things up so that we can continue, so we have to consider this error as non-recoverable. What do we do now?

The answer is going to surprise you. In this case we do absolutely nothing!

I've mentioned earlier that not handling errors can be a great error handling strategy, and this is exactly what I meant.  
Let me show you an example of how it looks to handle an error by doing nothing:

```python
def new_song():
    song = get_song_from_user()
    add_song_to_database(song)
```

Let's say that both functions called in `new_song()` can fail and raise exceptions. Here are a couple of examples of things that can go wrong with these functions:

- The user could press Ctrl-C while the application is waiting for input inside `get_song_from_user()`, or in the case of a GUI application, the user could click a Close or Cancel button.
- While inside either one of the functions, the database can go offline due to a cloud issue, causing all queries and commits to fail for some time.

If we have no way to recover from these errors, then there is no point in catching them. Doing nothing is actually the most useful thing you can do, as it allows the exceptions to bubble up. Eventually the exceptions will reach a level at which the code knows how to do recovery, and at that point they will be considered type 2 errors, which are easily caught and handled.

You may think that this is an exceptionally rare situation to be in. I think you are wrong. In fact, you should design your applications so that as much code as possible is in functions that do not need to concern themselves with error handling. Moving error handling code to higher-level functions is a very good strategy that helps you have clean and maintainable code.

I expect some of you may disagree. Maybe you think that the `add_song()` function above should at least print an error message to inform the user that there was a failure. I don't disagree, but let's think about that for a bit. Can we be sure that we have a console to print on? Or is this a GUI application? GUIs do not have `stdout`, they present errors to users visually through some sort of alert or message box. Maybe this is a web application instead? In web apps you present errors by returning an HTTP error response to the user. Should this function know which type of application this is and how errors are to be presented to the user?

The [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) principle says that it should not.

Once again, I'll reiterate that doing nothing in this function does not mean that the error is being ignored, it means that we are allowing the error to bubble up so that some other part of the application with more context can deal with it appropriately.

### Catching All Exceptions

One of the reasons you may be doubting that type 4 errors should be the most common in your application is that by letting exceptions bubble up freely they may go all the way to the top without being caught anywhere else, causing the application to crash. This is a valid concern that has an easy solution.

You should design your applications so that it is impossible for an exception to ever reach the Python layer. And you do this by adding a `try`/`except` block at the highest level that catches the runaway exceptions.

If you were writing a command line application, you could do this as follows:

```python
import sys

def my_cli()
    # ...

if __name__ == '__main__':
    try:
        my_cli()
    except Exception as error:
        print(f"Unexpected error: {error}")
        sys.exit(1)
```

Here the top-level of this application is in the `if __name__ == '__main__'` conditional, and it considers any errors that reach this level as recoverable. The recovery mechanism is to show the error to the user and to exit the application with a exit code of `1`, which will inform the shell or the parent process that the application failed. With this logic the application knows how to exit with failure, so now there is no need to reimplement this anywhere else. The application can simply let errors bubble up, and they'll eventually be caught here, where the error message will be shown and the application will then exit with an error code.

You may remember that I've mentioned above that catching all exceptions is a bad practice. Yet, that is exactly what I'm doing here! The reason is that at this level we really cannot let any exceptions reach Python because we do not want this program to ever crash, so this is the one situation in which it makes sense to catch all exceptions. This is the exception (pun intended) that proves the rule.

Having a high-level catch-all exception block is actually a common pattern that is implemented by most application frameworks. Here are two examples:

- **The [Flask](https://flask.pallets.com) web framework**: Flask considers each request as a separate run of the application, with the `full_dispatch_request()` method as the top layer. The code that catches all exceptions is [here](https://github.com/pallets/flask/blob/2fec0b206c6e83ea813ab26597e15c96fab08be7/src/flask/app.py#L893-L900).
- **The [Tkinter](https://blog.miguelgrinberg.com/post/the-ultimate-guide-to-error-handling-in-python) GUI toolkit** (part of the Python standard library): Tkinter considers each application event handler as separate little run of the application, and adds a generic catch-all exception block each time it calls a handler, to prevent faulty application handlers from ever crashing the GUI.

### An Example

I want to show you an example of how you can improve your code when using a smart design for error handling. For this I'm going to use Flask, but this applies to most other frameworks or application types as well.

Let's say this is a database application that uses the Flask-SQLAlchemy extension. Through my consulting and code review work I see lots of developers coding database operations in Flask endpoints as follows:

```python
# NOTE: this is an example of how NOT to do exception handling!
@app.route('/songs/<id>', methods=['PUT'])
def update_song(id):
    # ...
    try:
        db.session.add(song)
        db.session.commit()
    except SQLAlchemyError:
        current_app.logger.error('failed to update song %s, %s', song.name, e)
        try:
            db.session.rollback()
        except SQLAlchemyError as e:
            current_app.logger.error('error rolling back failed create song, %s', e)
        return 'Internal Service Error', 500
    return '', 204
```

Here this route attempts to save a song to the database, and catches database errors, which are all subclasses of the `SQLAlchemyError` exception class. If the error occurs, it writes an explanatory message to the log, and then rolls back the database session. But of course, the rollback operation can also fail sometimes, so there is a second exception catching block to catch rollback errors and also log them. After all this, a 500 error is returned to the user so that they know that there was a server error. This pattern is repeated in every endpoint that writes to the database.

This is a very bad solution. First of all, there is nothing that this function can do to recover a rollback error. If a rollback error occurs that means the database is in big trouble, so you will likely continue to see errors, and logging that there was a rollback error is not going to help you in any way. Second, logging an error message when a commit fails appears useful at first, but this particular log lacks information, especially the stack trace of the error, which is the most important debugging tool you will need later when figuring out what happened. At the very least, this code should use `logger.exception()` instead of `logger.error()`, since that will log an error message plus a stack trace. But we can do even better.

This endpoint falls in the type 4 category, so it can be coded using the "doing nothing" approach, resulting in a much better implementation:

```python
@app.route('/songs/<id>', methods=['PUT'])
def update_song(id):
    # ...
    db.session.add(song)
    db.session.commit()
    return '', 204
```

Why does this work? As you've seen before, Flask catches all errors, so your application will never crash due to missing to catch an error. As part of its handling, Flask will log the error message and the stack trace to the Flask log for you, which is exactly what we want, so no need to do this ourselves. Flask will also return a 500 error to the client, to indicate that an unexpected server error has occurred. In addition, the Flask-SQLAlchemy extension attaches to the exception handling mechanism in Flask and rolls back the session for you when a database error occurs, the last important thing that we need. There is really nothing left for us to do in the route!

The recovery process for database errors is the same in most applications, so you should let the framework do the dirty work for you, while you benefit from much simpler logic in your own application code.

### Errors in Production vs. Errors in Development

I mentioned that one of the benefits of moving as much of the error handling logic as possible to the higher layers of the application call stack is that your application code can let those errors bubble up without having to catch them, resulting in much easier to maintain and readable code.

Another benefit of moving the bulk of error handling code to a separate part of the application is that with the error handling code in a single place you have better control of how the application reacts to errors. The best example of this is how easy it becomes to change the error behavior on the production and development configurations of your application.

During development, there is actually nothing wrong with the application crashing and showing a stack trace. In fact, this is a good thing, since you want errors and bugs to be noticed and fixed. But of course, the same application must be rock solid during production, with errors being logged and developers notified if feasible, without leaking any internal or private details of the error to the end user.

This becomes much easier to implement when the error handling is in one place and separate from the application logic. Let's go back to the command line example I shared earlier, but now let's add development and production modes:

```python
import sys

mode = os.environ.get("APP_MODE", "production")

def my_cli()
    # ...

if __name__ == '__main__':
    try:
        my_cli()
    except Exception as error:
        if mode == "development":
            raise  # in dev mode we let the app crash!
        else:
            print(f"Unexpected error: {error}")
            sys.exit(1)
```

Isn't this wonderful? When we are running in development mode we now re-raise the exceptions to cause the application to crash, so that we can see the errors and the stack traces while working. But we do this without compromising the robustness of the production version, which continues to catch all errors and prevent crashes. More importantly, the application logic does not need to know of these configuration differences.

Does this remind of you of anything Flask, Django and other web frameworks do? Many web frameworks have a development or debug mode, which shows you crashes in your console and sometimes even in your web browser. Exactly the same solution I'm showing you on a made-up CLI application, but applied to a web application!
