# Container from Scratch

## History of container

In the old time, to create a environment for each application, we have to create by following this way:

(Let's setup a Ubuntu server first)

`docker run -it --name docker-host --rm --privileged ubuntu:jammy`

This will download the [official Ubuntu container](https://hub.docker.com/_/ubuntu) from Docker Hub and grab the version marked with the _jammy_ tag. In this case, _latest_ means it's the latest stable release (22.04.) You could put `ubuntu:devel` to get the latest development of Ubuntu (as of writing that'd be 24.04). `docker run` means we're going to run some commands in the container, and the `-it` means we want to make the shell interactive (so we can use it like a normal terminal.)

To see what version of Ubuntu you're using, run `cat /etc/issue`. `cat` reads a file and dumps it into the output which means we can read it, and `/etc/issue` is a file that will tell us what distro we're using.

Nice!

Now, time to create a new root to create new "container":

1. Make a new folder in your root directory via `mkdir /my-new-root`.
2. Inside that new folder, run `echo "my super secret thing" >> /my-new-root/secret.txt`.
3. Now try to run `chroot /my-new-root bash` and see the error it gives you.

You should see something about failing to run a shell or not being able to find bash. That's because bash is a program and your new root wouldn't have bash to run (because it can't reach outside of its new root.) So let's fix that! Run:

1. `mkdir /my-new-root/bin`
2. `cp /bin/bash /bin/ls /my-new-root/bin/`
3. `chroot /my-new-root bash`

Still not working! The problem is that these commands rely on libraries to power them and we didn't bring those with us. So let's do that too. Run `ldd /bin/bash`. This print out something like this:

```bash
$ ldd /bin/bash
    linux-vdso.so.1 (0x0000ffffbe221000)
    libtinfo.so.6 => /lib/aarch64-linux-gnu/libtinfo.so.6 (0x0000ffffbe020000)
    libc.so.6 => /lib/aarch64-linux-gnu/libc.so.6 (0x0000ffffbde70000)
    /lib/ld-linux-aarch64.so.1 (0x0000ffffbe1e8000)
```

These are the libraries we need for bash. Let's go ahead and copy those into our new environment.

1. `mkdir /my-new-root/lib`
2. Then we need to copy all those paths (ignore the lines that don't have paths) into our directory. Make sure you get the right files in the right directory. In my case above (yours likely will be different) it's:
   1. `cp /lib/aarch64-linux-gnu/libtinfo.so.6 /lib/aarch64-linux-gnu/libc.so.6 /lib/ld-linux-aarch64.so.1 /my-new-root/lib`
3. Do it again for `ls`. Run `ldd /bin/ls`
4. Follow the same process to copy the libraries for `ls` into our `my-new-root`.
   1. `cp /lib/aarch64-linux-gnu/libselinux.so.1 /lib/aarch64-linux-gnu/libc.so.6 /lib/ld-linux-aarch64.so.1 /lib/aarch64-linux-gnu/libpcre2-8.so.0 /my-new-root/lib`

Now, finally, run `chroot /my-new-root bash` and run `ls`. You should successfully see everything in the directory.

Now try `pwd` to see your working directory. You should see `/`. You can't get out of here! This, before being called containers, was called a jail for this reason. At any time, hit CTRL+D or run `exit` to get out of your chrooted environment.

So, that's how we isolate the app in the "container".

## Namespace

But even though we can create separated environment like above, each process can be seen by the others, and it would be dangerous if someone modifies it.

So, in Linux, namespaces allow you to hide processes from other processes. If we give each chroot'd environment different sets of namespaces, users can't see each others processes (they even get different process PIDs, or process IDs, so they can't guess what the others have)

So, to demonstrate the chroot

1. chroot in a terminal into our environment
2. In another terminal, run `docker exec -it docker-host bash`. This will get another terminal session #2 for us (I'll refer to the chroot'd environment as #1)
3. Run `tail -f /my-new-root/secret.txt &` in #2. This will start an infinitely running process in the background.
4. Run `ps aux` to see the process list in #2 and see the `tail` process running. Copy the PID (process ID) for the tail process.
5. In #1, the chroot'd shell, run `kill <PID you just copied>`. This will kill the tail process from inside the `chroot'd` environment. This is a problem because that means chroot isn't enough to isolate someone. We need more barriers. This is just one problem, processes, but it's illustrative that we need more isolation beyond just the file system.

### Safety with namespaces

So let's create a chroot'd environment now that's isolated using namespaces using a new command: `unshare`. `unshare` creates a new isolated namespace from its parent and all other future tenants. Run this:

```bash
# from our chroot'd environment if you're still running it, if not skip this
exit

## Install debootstrap
apt-get update -y
apt-get install debootstrap -y
debootstrap --variant=minbase jammy /better-root

# head into the new namespace'd, chroot'd environment
unshare --mount --uts --ipc --net --pid --fork --user --map-root-user chroot /better-root bash # this also chroot's for us
mount -t proc none /proc # process namespace
mount -t sysfs none /sys # filesystem
mount -t tmpfs none /tmp # filesystem
```

This will create a new environment that's isolated on the system with its own PIDs, mounts (like storage and volumes), and network stack. Now we can't see any of the processes!

Now try our previous exercise again.

1. Run `tail -f /my-new-root/secret.txt &` from #2 (not the unshare env)
2. Run `ps` from #1, grab pid for `tail`
3. Run `kill <pid for tail>`, see that it doesn't work

We used namespaces to protect our processes! We could explore the other namespaces but know it's a similar exercise: using namespaces to restrict capabilities of containers to interfering with other containers (both for nefarious purposes and to protect ourselves from ourselves.)

## Resource limitation: cgroups

Okay, so now we've hidden the processes each others.

Suffice to say, we still have a problem. Every isolated environment has access to all _physical_ resources of the server. There's no isolation of physical components from these environments.

Enter the hero of this story: cgroups, or control groups. Google saw this same problem when building their own infrastructure and wanted to protect runaway processes from taking down entire servers and made this idea of cgroups so you can say "this isolated environment only gets so much CPU, so much memory, etc. and once it's out of those it's out-of-luck, it won't get any more."

cgroups as we have said allow you to move processes and their children into groups which then allow you to limit various aspects of them. Imagine you're running a single physical server for Google with both Maps and GMail having virtual servers on it. If Maps ships an infinite loop bug and it pins the CPU usage of the server to 100%, you only want Maps to go down and _not_ GMail just because it happens to be colocated with Maps. Let's see how to do that.

You interact with cgroups by a pseudo-file system. Honestly the whole interface feels weird to me but that is what it is! Inside your #2 terminal (the non-unshared one) run `cd /sys/fs/cgroup` and then run `ls`. You'll see a bunch of "files" that look like `cpu.max`, `cgroup.procs`, and `memory.high`. Each one of these represents a setting that you can play with with regard to the cgroup. In this case, we are looking at the root cgroup: all cgroups will be children of this root cgroup. The way you make your own cgroup is by creating a folder inside of the cgroup.

```bash
# creates the cgroup
mkdir /sys/fs/cgroup/sandbox

# look at all the files created automatically
ls /sys/fs/cgroup/sandbox
```

We now have a sandbox cgroup which is a child of the root cgroup and can putting limits on it! If we wanted to create a child of sandbox, as you may have guessed, just create another folder inside of sandbox.

Let's move our unshared environment into the cgroup. Every process belongs to exactly one cgroup. If you move a process to a cgroup, it will automatically be removed from the cgroup it was in. If we move our unshared bash process from the root cgroup to the sandbox cgroup, it will be removed from the root cgroup without you doing anything.

```bash
# Find your isolated bash PID, it's the bash one immediately after the unshare
ps aux

# should see the process in the root cgroup
cat /sys/fs/cgroup/cgroup.procs

# puts the unshared env into the cgroup called sandbox
echo <PID> > /sys/fs/cgroup/sandbox/cgroup.procs

# should see the process in the sandbox cgroup
cat /sys/fs/cgroup/sandbox/cgroup.procs

# should see the process no longer in the root cgroup - processes belong to exactly 1 cgroup
cat /sys/fs/cgroup/cgroup.proc
```

We now have moved our unshared bash process into a cgroup. We haven't placed any limits on it yet but it's there, ready to be managed. We have a minor problem at the moment though that we need to solve.

```bash
# should see all the available controllers
cat /sys/fs/cgroup/cgroup.controllers

# there's no controllers
cat /sys/fs/cgroup/sandbox/cgroup.controllers

# there's no controllers enabled its children
cat /sys/fs/cgroup/cgroup.subtree_control
```

You have to enable controllers for the children and none of them are enabled at the moment. You can see the root cgroup has them all enabled, but hasn't enabled them in its subtree_control so thus none are available in sandbox's controllers. Easy, right? We just add them to subtree_control, right? Yes, but one probelm: you can't add new subtree_control configs while the cgroup itself has processes in it. So we're going to create another cgroup, add the rest of the processes to that one, and then enable the subtree_control configs for the root cgroup.

```bash
# make new cgroup for the rest of the processes, you can't modify cgroups that have processes and by default Docker doesn't include any subtree_controllers
mkdir /sys/fs/cgroup/other-procs

# see all the processes you need to move, rerun each time after you add as it may move multiple processes at once due to some being parent / child
cat /sys/fs/cgroup/cgroups.proc

# you have to do this one at a time for each process
echo <PID> > /sys/fs/cgroup/other-procs/cgroup.procs

# verify all the processes have been moved
cat /sys/fs/cgroup/cgroups.proc

# add the controllers
echo "+cpuset +cpu +io +memory +hugetlb +pids +rdma" > /sys/fs/cgroup/cgroup.subtree_control

# notice how few files there are
ls /sys/fs/cgroup/sandbox

# all the controllers now available
cat /sys/fs/cgroup/sandbox/cgroup.controllers

# notice how many more files there are now
ls /sys/fs/cgroup/sandbox
```

We did it! We went ahead and added all the possible controllers but normally you should just add just the ones you need. If you want to learn more about what each of them does, [the kernel docs are quite readable](https://docs.kernel.org/admin-guide/cgroup-v2.html#controllers).

Let's get a third terminal going. From your host OS (Windows or macOS or your own Linux distro, not within Docker) run another `docker exec -it docker-host bash`. That way we can have #1 inside the unshared environment, #2 running our commands, and #3 giving us a visual display of what's going with `htop`, a visual tool for seeing what process, CPU cores, and memory are doing.

So, let's go three little exercises of what we can do with a cgroup. First let's make it so the unshared environment only has access to 80MB of memory instead of all of it.

```bash
# a cool visual representation of CPU and RAM being used
apt-get install htop

# from #3 so we can watch what's happening
htop

# run this from #1 terminal and watch it in htop to see it consume about a gig of RAM and 100% of CPU core
yes | tr \\n x | head -c 1048576000 | grep n

# from #2, (you can get the PID from htop) to stop the CPU from being pegged and memory from being consumed
kill -9 <PID of yes>

# should see max, so the memory is unlimited
cat /sys/fs/cgroup/sandbox/memory.max

# set the limit to 80MB of RAM (the number is 80MB in bytes)
echo 83886080 > /sys/fs/cgroup/sandbox/memory.max

# from inside #1, see it limit the RAM taken up; because the RAM is limited, the CPU usage is limited
yes | tr \\n x | head -c 1048576000 | grep n
```

I think this is very cool. We just made it so our unshared environment only has access to 80MB of RAM and so despite there being a script being run to literally just consume RAM, it was limited to only consuming 80MB of it.

However, as you saw, the user inside of the container could still peg the CPU if they wanted to. Let's fix that. Let's only give them 5% of a core.

```bash
# inside #1 / the cgroup/unshare – this will peg one core of a CPU at 100% of the resources available, see it peg 1 CPU
yes > /dev/null

# from #2, (you can get the PID from htop) to stop the CPU from being pegged
kill -9 <PID of yes>

# from #2 this allows the cgroup to only use 5% of a CPU
echo '5000 100000' > /sys/fs/cgroup/sandbox/cpu.max

# inside #1 / the cgroup/unshare – this will peg one core of a CPU at 5% since we limited it
yes > /dev/null

# from #2, to stop the CPU from being pegged, get the PID from htop
kill -9 <PID of yes>
```

Pretty cool, right? Now, no matter how bad of code we run inside of our chroot'd, unshare'd, cgroup'd environment, we cannot take more than 5% of a CPU core.

One more demo, the dreaded [fork bomb](https://en.wikipedia.org/wiki/Fork_bomb). A fork bomb is a script that forks itself into multiple processes, which then fork themselves, which them fork themselves, etc. until all resources are consumed and it crashes the computer. It can be written plainly as

```bash
fork() {
    fork | fork &
}
fork
```

but you'll see it written as `:(){ :|:& };:` where `:` is the name of the function instead of `fork`.

So someone could run a fork bomb on our system right now and it'd limit the blast radius of CPU and RAM but creating and destroying so many processes still carries a toll on the system. What we can do to more fully prevent a fork bomb is limit how many PIDs can be active at once. Let's try that.

```bash
# See how many processes the cgroup has at the moment
cat /sys/fs/cgroup/sandbox/pids.current

# See how many processes the cgroup can create before being limited (max)
cat /sys/fs/cgroup/sandbox/pids.max

# set a limit that the cgroup can only run 3 processes at a time
echo 3 > /sys/fs/cgroup/sandbox/pids.max

# this runs 5 15 second processes that run and then stop. run this from within #2 and watch it work. now run it in #1 and watch it not be able to. it will have to retry several times
for a in $(seq 1 5); do sleep 15 & done

# DO NOT RUN THIS ON YOUR COMPUTER. This is a fork bomb. If not accounted for, this would bring down your computer. However we can safely run inside our #1 because we've limited the amount of PIDs available. It will end up spawning about 100 processes total but eventually will run out of forks to fork.
:(){ :|:& };:
```

Attack prevented! 3 processes is way too few for anyone to do anything meaningful but by limiting the max PIDs available it allows you to limit what damage could be done. I'll be honest, this is the first time I've run a fork bomb on a computer and it's pretty exhilirating. I felt like I was in the movies Hackers.

And now we can call this a container. You have handcrafted a container. A container is literally nothing more than we did together. There's other sorts of technologies that will accompany containers like runtimes and daeomons, but the containers themselves are just a combination of chroot, namespaces, and cgroups!
