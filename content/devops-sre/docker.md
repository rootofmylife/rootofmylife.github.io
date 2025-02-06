# Docker

Run this command:

```bash
docker run --interactive --tty alpine:3.19.1
# or, to be shorter: docker run -it alpine:3.19.1
```

A bit easier to remember, right? This will drop you into a Alpine ash shell inside of a container as the root user of that container. When you're done, just run `exit` or hit CTRL+D. Notice that this will grab the [alpine](https://www.alpinelinux.org/) image from Docker for you and run it. The `run` part of the command is telling Docker you're going to be executing a container (as opposed to building it.) The `-it` part says you want to be dropped into the container interactively so you can run commands and inspect the container. By default containers run and then exit as soon as they're done. Go ahead and try `docker run alpine:3.19.1`. It'll look it did nothing but it actually starts the container and then, because it has nothing defined for it to do, it just exits.

So what if you wanted it to execute something? Try this:

```bash
docker run alpine:3.19.1 ls
```

Or let's switch to Ubuntu now, since it's more familiar to most. We'll talk about Alpine later on in-depth.

```bash
docker run ubuntu:jammy ls
```

The `ls` part at the end is what you pass into the container to be run. As you can see here, it executes the command, outputs the results, and shuts down the container. This is great for running a Node.js server. Since it doesn't exit, it'll keep running until the server crashes or the server exits itself.

So now what if we want to detach the container running from the foreground? Let's try that.

```bash
docker run --detach -it ubuntu:jammy # or, to be shorter: docker run -dit ubuntu:jammy
```

So it prints a long hash out and then nothing. Oh no! What happened to it!? Well, it's running in the background. So how do we get ahold of it?

```bash
docker ps
```

This will print out all the running containers that Docker is managing for you. You should see your container there. So copy the ID or the name and say:

```bash
docker attach <ID or name> # e.g. `docker attach 20919c49d6e5` would attach to that container
```

This allows you to attach a shell to a running container and mess around with it. Useful if you need to inspect something or see running logs. Feel free to type `exit` to get out of here. Run `docker run -dit ubuntu:jammy` one more time. Let's kill this container without attaching to it. Run `docker ps`, get the IDs or names of the containers you want to kill and say:

```bash
docker kill <IDs or names of containers> # e.g. `docker kill fae0f0974d3d 803e1721dad3 20919c49d6e5` would kill those three containers
```

## `--name` and `--rm`

Let's make it a bit easier to keep track of these. Try this

```bash
docker run -dit --name my-ubuntu ubuntu:jammy
docker kill my-ubuntu
```

Now you can refer to these by a name you set. But now if you tried it again, it'd say that `my-ubuntu` exists. If you run `docker ps --all` you'll see that the container exists even if it's been stopped. That's because Docker keeps this metadata around until you tell it to stop doing that. You can run `docker rm my-ubuntu` which will free up that name or you can run `docker container prune` to free up all existing stopped containers (and free up some disk space.)

In the future you can just do

```bash
docker run --rm -dit --name my-ubuntu ubuntu:jammy
docker kill my-ubuntu
```

This will automatically clean up the container when it's done.

## Some command

### pull / push

`pull` allows you to pre-fetch container to run.

```bash
# this just downloads and caches the image, it doesn't do anything else with it
docker pull jturpin/hollywood

# notice it's already loaded and cached here; it doesn't redownload it
docker run -it jturpin/hollywood hollywood
```

Note: The `jturpin/hollywood` image has been depricated. These steps should still work, but if you have issues, you can replace that image with `bcbcarl/hollywood`.

`push` allows you to push containers to whatever registry you're connected to (probably normally Docker Hub or something like Azure Container Registry or GitHub Container Registry).

### inspect

```bash
docker inspect node:20
```

This will dump out a lot of info about the container. Helpful when figuring out what's going on with a container

### pause / unpause

As it looks, these pauses or unpause all the processes in a container. Feel free to try

```bash
docker run -dit --name hw --rm jturpin/hollywood hollywood
docker ps # see container running
docker pause hw
docker ps # see container paused
docker unpause hw
docker ps # see container running again
docker kill hw # see container is gone
```

### exec

This allows you to execute a command against a running container. This is different from `docker run` because `docker run` will start a new container whereas `docker exec` runs the command in an already-running container.

```bash
docker run -dit --name hw --rm jturpin/hollywood hollywood

# see it output all the running processes of the container
docker exec hw ps aux
```

If you haven't seen `ps aux` before, it's a really useful way to see what's running on your computer. Try running `ps aux` on your macOS or Linux computer to see everything running.

### import / export

Allows you to dump out your container to a tar ball (which we did above.) You can also import a tar ball as well.

### history

We'll get into layers in a bit but this allow you to see how this Docker image's layer composition has changed over time and how recently.

```bash
docker history node:20
```

### info

Dumps a bunch of info about the host system. Useful if you're on a VM somewhere and not sure what the environment is.

```bash
docker info
```

### top

Allows you to see processes running on a container (similar to what we did above)

```bash
docker run -dit --name my-mongo --rm mongo
docker top my-mongo # you should see MongoDB running
docker kill my-mongo
```

### rm / rmi

If you run `docker ps --all` it'll show all containers you've stopped running in addition to the runs you're running. If you want to remove something from this list, you can do `docker rm <id or name>`.

You can run `docker container prune` to remove _all_ of the stopped containers.

If you want to remove an image from your computer (to save space or whatever) you can run `docker rmi mongo` and it'll delete the image from your computer. This isn't a big deal since you can always reload it again

### logs

Very useful to see the output of one of your running containers.

```bash
docker run --name my-mongo --rm -dit mongo
docker logs my-mongo # see all the logs
docker kill my-mongo
```

### restart

Pretty self explanatory. Will restart a running container

### search

If you want to see if a container exists on Docker Hub (or whatever registry you're connected to), this will allow you to take a look.

```bash
docker search python # see all the various flavors of Python containers you can run
docker search node # see all the various flavors of Node.js containers you can run
```
