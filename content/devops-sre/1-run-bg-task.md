# Run background tasks

## `bg`

From within your bash shell:

```bash
control+z
```

Then, to continue running the job in background:

```bash
bg
```

Later, you can type **`jobs`** to see if your process is still running.

## Use `nohup`

**For Linux** *Use terminal and enter in superuser mode, and try these code*

```bash
> nohup node <location of of js file> &
> exit
```

**Note**: This '&' is must before you press enter or for npm command, just goto the location by cd command where your package.json is stored. Then

```bash
> nohup npm start &
> exit
```

**Note**: This '&' is must before you press enter to stop it

Get the pid of above background process by specifying command name.

```bash
ps -ef | grep npm
```

output

```bash
root      282516       1  0 Dec06 ?        00:00:01 npm start
root      293305  293060  0 07:01 pts/0    00:00:00 grep --color=auto npm
```

Now you can easily kill the process by using kill command

```bash
kill 282516
```

You can see process id here, then use following code

```bash
> kill -9 <PROCESS_ID>
```
