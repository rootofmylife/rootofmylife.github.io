# Git Review

## `git config`

- All git config keys are in the following shape: `<section>.<key>`.
- `--global` flag will ensure you set this key value for all future uses of git and repos
- To add a key value, execute `git config --add --global <key> "<value>"`
- View any value of git config by executing `git config --get <key>`
  For example:

```bash
git config --get user.name
```

```bash
git config --get user.email
```

If nothing,

```bash
git config --add --global user.name "Duc DO"
git config --add --global user.email "dotrananhduc@gmail.com"
```

`git config --unset user.name`
To remove the key-value in git configuration

`git config --list`
To list out the entirety of the config.

You can use `git config --list | grep <thing>` to filter the result

You can list all git config in folder `.git/config`

You can set config `--global` or `--local`. For example:

```bash
git config --global --add user.nick 'nartod'
```

And get

```bash
git config --global --get user.nick
```

You can change the default branch from `master` to `trunk`. The config setting is `init.defaultBranch`

```bash
git config --global init.defaultBranch trunk
```

This will change the default setting for all projects going forward. This does not mean that our current git projects have changed. Current projects will have to be rename.

## `git init`

This will create a `.git` repo for directory

Some basic `git` commands

- `git add <path-to-file | pattern>` will add zero or more files to _the index_ (staging area)
- `git commit -m '<message>'` will commit what changes are present in _the index_.
- `git status` will describe the state of your git repo which will include tracked, staged, and untracked changes.

## `git log`

View git history

You should use

```bash
git log --graph --decorate
```

The decorate option, if you didn't understand from description, means that it puts branches / HEAD in the commit logs so you can see in a friendly way where your branches are pointed at.

Or `git log --decorate --graph --parents`

- `--parents` adds 1 to two extra shas signifying the parent chain. This is duplicated by `--graph` but instead of a graphical representation, its with shas.

To find keyword, use

```bash
git log --grep foo
```

Or put `-p` which gives the changes in there

```bash
git log --grep foo -p
```

## `git cat-file`

The overall command should be

```bash
git cat-file -p <some-sha>
```

This will echo out the contents of the sha. This can be a commit, a tree, or a blob (more on those in a bit)

Key concepts:

- `tree`: `tree` is analagous to directory
- `blob`: `blob` is analagous to file

**Step 1**: First start with `git log --graph --decorate`, this will show something like this

```bash
* commit c25fb3333be2b27b8032e821a6d61977b8112c64 (**HEAD ->** **main**)

  Author: duchenyingde <92703547+duchenyingde@users.noreply.github.com>

  Date:   Mon Jun 24 15:00:39 2024 +0700

      first file
```

Which is your commit information.

**Step 2**: Then take the hash `c25fb3333be2b27b8032e821a6d61977b8112c64` and use with the `git cat-file`

```bash
git cat-file -p c25fb3333be2b27b8032e821a6d61977b8112c64
```

The result will be like this #firstcommit :

```output
tree 61280dfae0024a151faf527547140a2f59557954

author duchenyingde <92703547+duchenyingde@users.noreply.github.com> 1719216039 +0700

committer duchenyingde <92703547+duchenyingde@users.noreply.github.com> 1719216039 +0700



first file
```

Which is your directory information

**Step 3**: Get the hash from `tree`, which is `61280dfae0024a151faf527547140a2f59557954`, and use with the `git cat-file`

```bash
git cat-file -p 61280dfae0024a151faf527547140a2f59557954
```

The result will be like this:

```output
100644 blob 9649cde946d8d0896fa80977b9bcd76439f99e6b readme.md
```

Which is your file information

Step 4: Get the hash from `blob`, which is `9649cde946d8d0896fa80977b9bcd76439f99e6b`, and use with the `git cat-file`

```bash
git cat-file -p 9649cde946d8d0896fa80977b9bcd76439f99e6b
```

The result will be like this:

```output
First line
```

Which is your file information.

_Overall_
The process can seem flow from commit -> directory -> file -> content. Which is reverse with our action when committing a file

Now, if you add another file, which follows these commands:

```bash
vi readme2.md # Great editor to add such a wonderful change
git add readme2.md
git commit -m "second file"
```

Then, you have the result like this:

```output
[main 936b491] second file

 1 file changed, 1 insertion(+)

 create mode 100644 readme2.md
```

Take the hash `936b491` and use with `git cat-file`

`git cat-file -p 936b491`

You will see like this

```output
tree 2964acb402dd4a06c469dfdaa43c1067281b8a63

parent c25fb3333be2b27b8032e821a6d61977b8112c64

author duchenyingde <92703547+duchenyingde@users.noreply.github.com> 1719223079 +0700

committer duchenyingde <92703547+duchenyingde@users.noreply.github.com> 1719223079 +0700



second file
```

Try `git cat-file -p 2964acb402dd4a06c469dfdaa43c1067281b8a63`, the rs will be

```output
100644 blob 9649cde946d8d0896fa80977b9bcd76439f99e6b readme.md

100644 blob c991363848c37d9b34d5c7799cfda9ce074a3309 readme2.md
```

Which is showing hash for each file

Try `git cat-file -p c25fb3333be2b27b8032e821a6d61977b8112c64`, the result will be the same with #firstcommit , which is

```output
tree 61280dfae0024a151faf527547140a2f59557954

author duchenyingde <92703547+duchenyingde@users.noreply.github.com> 1719216039 +0700

committer duchenyingde <92703547+duchenyingde@users.noreply.github.com> 1719216039 +0700



first file
```

## `git branch`

Create a new branch

For example:

```bash
git branch new-branch
```

If you only type `git branch`, it will list all branches

## `git checkout`

Change current branch

For example:

```bash
git checkout new-branch
```

```bash
git checkout -b trunk-merge-foo
```

equal

```bash
git branch trunk-merge-foo
git checkout trunk-merge-foo
```

## `git merge`

Merge two branches

```bash
git merge <branchname>
```

The branch your on is the `target` branch and the branch you name in `<branchname>` will be the `source` branch.

If you check log using this cmd `git log --oneline --decorate --graph --parents`, you can see this result as example:

```bash
*   ccf9a73 a665b08 16984cb (HEAD -> trunk-merge-foo) Merge branch 'foo' into trunk-merge-foo
|\
| * 16984cb 4ad6ccf (foo) C
| * 4ad6ccf cb75afe B
* | a665b08 79c5076 (trunk) E
* | 79c5076 cb75afe D
|/
* cb75afe A
```

```bash
| * 16984cb 4ad6ccf (foo) C
```

means: commit `16984cb` has a parent of `4ad6ccf` with a named branch of `foo` with a commit message of `C`

The only commit that has a different look is the first line of the logs, which is the latest commit.
`ccf9a73` has two parents, `a665b08` and `16984cb`. If you look at those commits, they are the commits of `trunk` and `foo`. `git merge` merged those two commits together by finding the best common ancestor (merge base `cb75afe`) and playing the commits one at a time, start at `cb75afe`, creating a new commit, a merge commit, `ccf9a73`.

## `git rebase`

```bash
 B --- C                foo
 /
A --- D --- E --- X --- Y trunk
```

We can demonstrate the power of rebase. What rebase will do is update `foo` to point to `Y` instead of `A`.

```bash
                           B --- C                foo
                         /
A --- D --- E --- X --- Y                         trunk
```

That is all rebase does here. It updates the commit where the branch originally points to
This also means that in we decide to merge `foo` into `trunk` we can do a ff-merge!
(Can think like foo will get more history from trunk)

The cmds are following

```bash
git checkout foo
git rebase trunk
```

We still need to solve conflict if any

### MOAR Rebasing

We have briefly talked about rebasing as being able to realign where the branch point exists for one branch onto another.

In other words, you make history linear. Here is a simple visual example

```bash
      E - F - G    topic
    /
A - B - C - D      master
```

```bash
git rebase master # we are on branch topic
```

Assuming everything went off without a hitch, you will have the following state

```bash
              E - F - G    topic
             /
A - B - C - D              master
```

Remember to run `git rebase --continue` after resolving conflict (`git pull --rebase`) with from rebase branch. If you choose bottom code, you will need to `git add .` before `rebase --continue` (just check git tutorial in terminal)

If you did a commit use `git reset --soft HEAD~1` and then `git rebase --continue`

Rebase works by replaying the commits one at a time. Therefore if we have our change from a conflict and then we replay the changes we will reconflict on the same change again and again.

### Interactive Rebasing and Squashing

You may find yourself on a team that asks you to "squash" your commits. What is meant by this is interactive rebase squash.

In other words: the aforementioned diagram we can transform from

```bash
              E - F - G    topic
             /
A - B - C - D              master
```

To

```bash
              # notice this is one commit
              EFG          topic
             /
A - B - C - D              master
```

Along with squashing, interactive rebasing allows you to edit messages and more

To begin an interactive rebase we need to provide a point in time to rebase with. Typically, the simplest way to do this is with `HEAD~<number>`. `HEAD~1` means one commit back from `HEAD`. Since we did 3 commits we would use `HEAD~3` to select the base where we were before our 3 commits.

```bash
git rebase -i <commitish-sha>
```

That means rebase `<commitish-sha>`, interactively, to the current commit (`HEAD` in this case)

You will be presented an editor with all the options. Read them carefully.

That means with rebase you could provide the exact commit, or a relative path to the commit hash (HEAD~1) `git rebase -i HEAD~1`

`SQUASH` the three commits you made into one commit. This will require you to execute the rebase command, a `HEAD~<number>`, and read the text that appears to understand how to squash. It may take one or more tries. Remember, if you goof up you can always use reflog to get back to the original commit you started at.

Execute the following:

```bash
git rebase -i HEAD~3
```

You should get presented with the following

```bash
pick 9ebedbd Added 1 to the end
pick 8456d89 Added 2 to the end
pick f000c2e Added 3 to the end

# Rebase 9f67690..f000c2e onto 9f67690 (3 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified); use -c <commit> to reword the commit message
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
```

The key line in the text comments is

```output
# s, squash <commit> = use commit, but meld into previous commit
```

This means that if we replace `pick` with `s` or `squash` we will squash that commit, or `meld into previous commit`. Meaning make the previous commit and squash commit become one commit.

```bash
pick 9ebedbd Added 1 to the end
squash 8456d89 Added 2 to the end
squash f000c2e Added 3 to the end
```

We could have also done

```bash
pick 9ebedbd Added 1 to the end
s 8456d89 Added 2 to the end
s f000c2e Added 3 to the end
```

Save and exit and git will present a new screen

```bash
# This is a combination of 3 commits.
# This is the 1st commit message:

Added 1 to the end

# This is the commit message #2:

Added 2 to the end

# This is the commit message #3:

Added 3 to the end

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Sun Feb 25 08:50:40 2024 -0700
#
# interactive rebase in progress; onto 9f67690
# Last commands done (3 commands done):
#    squash 8456d89 Added 2 to the end
#    squash f000c2e Added 3 to the end
# No commands remaining.
# You are currently rebasing branch 'trunk' on '9f67690'.
#
# Changes to be committed:
#    modified:   README.md
#
```

Now you have the chance to create a whole new commit message for the newly combined commits.

Lets edit the message slightly

```bash
# This is a combination of 3 commits.
# This is the 1st commit message:

1, 2, and 3 combined

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Sun Feb 25 08:50:40 2024 -0700
#
# interactive rebase in progress; onto 9f67690
# Last commands done (3 commands done):
#    squash 8456d89 Added 2 to the end
#    squash f000c2e Added 3 to the end
# No commands remaining.
# You are currently rebasing branch 'trunk' on '9f67690'.
#
# Changes to be committed:
#    modified:   README.md
#
```

Once you save, you should see something similar:

```bash
➜  git rebase -i HEAD~3
[detached HEAD 02d3a0f] 1, 2, and 3 combined
 Date: Sun Feb 25 08:50:40 2024 -0700
 1 file changed, 3 insertions(+)
Successfully rebased and updated refs/heads/trunk.
```

Look at that! Our three commits became one! Squashing can be quite an effective technique to keep the history clean and allow you to make many small commits throughout your dev cycle, preventing loss work, and then one clean commit for reviewers. I personally think this is one of the best ways to go about developing.

### My general workflow

1. Many small commits with a message "SQUASHME: "
2. At the end of the dev cycle, i squash and give a proper message
3. PR with a singular commit
4. Before i PR i ensure i am at the tip of the branch and that any CI runs against latest master changes

`HEAD`
Point to current using branch

`git reflog`
Allow you to see where head has been.

Use case for `reflog`. If you want to bring the file from deleted branch, you can follow these steps

Step 1: Let's setup

```bash
git checkout second-branch
echo "deleted" > text.md
git add .
git commit -m 'wow'
```

Step2: Switch branch and delete second branch

```output
git checkout main
git branch -D second-baz
```

Step 3: Use `reflog` to recover

```bash
git reflog
```

Example result:

```bash
b23e632 (HEAD -> main, second-branch) HEAD@{0}: checkout: moving from second-branch to main
f330d23 HEAD@{1}: commit: wow # <--- there is our target commit
b23e632 (HEAD -> main, second-branch) HEAD@{2}: checkout: moving from main to second-branch
```

Now that we see `f330d23` is our target commit, what can we do to recover the work? There are a lot of possibilities.

Step 4: Recover

To get the information we need we will have to use the commit to get the tree sha and the tree sha for the blob, file `text.md`, contents

```bash
# Step 1, get the file tree try cat-file'ing the commit sha
➜  git cat-file -p f330d23
tree d2d8e10a88b4e985003930d45c5c488abe712e6b # <-- the tree
parent b23e6320e6fba64d93338543dcbcdcc9caadb71e
author Duc Do <dotrananhduc@gmail.com> 1707069560 -0700
committer Duc Do <dotrananhduc@gmail.com> 1707069560 -0700

Baz

# Step 2, print out the trees content.  baz.md is our taget file
➜  git cat-file -p d2d8e10
100644 blob d3045e2c2d21fcf774700b3d5fa681cf26b300ad    README.md
100644 blob 16858db7afb62f3e027d8f9379085d3567bcac62    others.md
100644 blob 76018072e09c5d31c8c6e3113b8aa0fe625195ca    text.md # <-- target file

# Step 3, print the file and copy the contents!
➜  git cat-file -p 7601807 > text.md
```

Use `cherry-pick` (need more content here. Search gg)

`REMOTE`
A remote is simply a copy of the repo _somewhere else_.
A remote is just another git repo that is of the same project and has changes we may need.

To add a remote the syntax is:

```bash
git remote add <name> <uri>
```

```bash
git remote add origin git:://my-remote-repo.com
```

List all remote

```bash
git remote -v
```

## `git pull`

The thing is that a lot of the time you just want the changes merged for you into your branch.

We also need to setup our branch to track the remote branch
Git will not automatically track state in a "remote" because that may not be what you want to do. Therefore if you `git pull` it wont know where to pull from since nothing has been specified. This becomes even more obvious once you have more than one remote.

For example:

```bash
git branch --set-upstream-to=origin/trunk trunk
```

This will setup local branch `trunk` to remote branch `trunk`

You can use `rebase` when pull with `git pull --rebase`

## `git push`

Take your changes and move the remote repo

## `git stash`

Use git stash when you want to record the current state of the working directory and the index, but want to go back to a clean working directory. The command saves your local modifications away and reverts the working directory to match the HEAD commit.

You can push your changes into the stack by using `git stash`

Stashes, much like commits, can come with a message (`-m "<your message>"`)

```bash
git stash -m "my lovely message here"
```

Stashes can be listed out:

```bash
git stash list
git stash show [--index <index>]
```

To pop the latest stash:

```bash
git stash pop
```

To pop a stash at an index:

```bash
git stash pop --index <index> # works well with git stash list
```

You can discard the unstage changes in git

```output
git stash save --keep-index --include-untracked
```

You don't need to include `--include-untracked` if you don't want to be thorough about it.

After that, you can drop that stash with a `git stash drop` command if you like.

## `git reset`

Git reset soft can be very useful if you need to make a commit that is partially finished and you want to edit that commit and change the contents

`git reset --soft HEAD~1`

Now lets say we need to continue to edit our previous commit. We have two options.

1. we could make changes and use `commit --amend`. If you are not familiar with `git commit --amend` it allows you to meld the current staged changes into the previous commit and edit the message.
2. we could use `git reset --soft HEAD~1` to move `trunk` back one commit and alter the index and worktree to match the contents of the commit.

`git commit` back the reverted change with a new message

What is in conflict?
Often its not obvious what is in conflict just by the message (if there is a large set of changes). So a simple way to see what is conflicted is by checking out the status

```bash
➜  git status
On branch trunk
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
```

There are some things to take from this status message

1. Unmerged path's contains README.md and it says `both modified`. That is your key to what needs to be resolved
2. You can abort the merge due to the conflict by executing `git merge --abort`

To resolve the conflict, when you cat out the file that is conflicted, `README.md`, you will see some additional information in the file that was not there before

```bash
➜  vim README.md

## This is the look of vim
  1   <<<<<<< HEAD
    1 A + 2
    2 =======
    3 A + 1
    4 >>>>>>> 9648be0ae764528ac63759d7e49fc623ae0af373
    5 D
    6 E
    7 remote-change
    8 downstream change
```

So some important information is present.

1. Any >>>>, ======, <<<<< denote parts of the conflict.

```bash
  1   <<<<<<< HEAD
```

This stats that `HEAD`s conflicted change starts here and continues until the `=======` line. You can confirm this with `git log -p -1`

You can verify this by noticing that the change in the `HEAD` section is `A + 2` which is the change that is in the `remote-git` `trunk` branch and is the `HEAD` location of `remote-git`

`=======` denotes the separation of the two merges

The end of the merge conflict is denoted with >>>> and sha of the incoming conflicted change

```bash
>>>>>>> 9648be0ae764528ac63759d7e49fc623ae0af373
```

We are conflicted and we need to resolve this. Use the `status` message to identify which file to edit and what to do after you edit the file.

After conflict has been resolved, commit the merge **Before you commit the merge check the status**.

```bash
git add . # add all files changes
git commit # confirm merge
```

The result:

```bash
[trunk d8a2f95] Merge branch 'trunk' of ../hello-git into trunk


# You will be presented with this commit

Merge branch 'trunk' of ../hello-git into trunk

# Conflicts:
#    README.md
#
# It looks like you may be committing a merge.
# If this is not correct, please run
#    git update-ref -d MERGE_HEAD
# and try again.


# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# On branch trunk
# All conflicts fixed but you are still merging.
#
```

Note: once you resolve a conflict and you don't take upstream's you will get merge commits until you sync your changes back to the remote

To push to upstream, use `git push origin trunk`

If you face this error:

```bash
➜  git push origin trunk
Enumerating objects: 15, done.
Counting objects: 100% (14/14), done.
Delta compression using up to 12 threads
Compressing objects: 100% (7/7), done.
Writing objects: 100% (9/9), 1.07 KiB | 1.07 MiB/s, done.
Total 9 (delta 1), reused 0 (delta 0), pack-reused 0
remote: error: refusing to update checked out branch: refs/heads/trunk
remote: error: By default, updating the current branch in a non-bare repository
remote: is denied, because it will make the index and work tree inconsistent
remote: with what you pushed, and will require 'git reset --hard' to match
remote: the work tree to HEAD.
remote:
remote: You can set the 'receive.denyCurrentBranch' configuration variable
remote: to 'ignore' or 'warn' in the remote repository to allow pushing into
remote: its current branch; however, this is not recommended unless you
remote: arranged to update its work tree to match what you pushed in some
remote: other way.
remote:
remote: To squelch this message and still keep the default behaviour, set
remote: 'receive.denyCurrentBranch' configuration variable to 'refuse'.
To ../hello-git
 ! [remote rejected] trunk -> trunk (branch is currently checked out)
error: failed to push some refs to '../hello-git'
```

Observation

```bash
...
 ! [remote rejected] trunk -> trunk (branch is currently checked out)
```

We cannot push to a branch that is the current branch of the target repo. This makes sense as it would cause your current branch to change out of underneath the repo that is currently being used, and if there are pending changes it could cause further havoc.

Solution: change branch `git checkout bar` then

```bash
git push origin trunk
```

Now with `rebase`

Recall that rebase will replay all your commits after moving forward the history, which means what if a conflict happened in the past?

Lets say you have the following setup:

```bash
      E - F - G    topic
    /
A - B - C - D      master
```

And lets pretend that `C` contains a change that creates a conflict with `G`. We rebase and we resolve the conflict and now our graph looks like the following:

```bash
              E - F - G    topic
             /
A - B - C - D              master
```

Then master gets another commit, `Y`

```bash
              E - F - G    topic
             /
A - B - C - D - Y          master
```

Now if we rebase again, we will play `E`, `F`, and `G`.

`git revert`
Often you have one of two choices to make: push forward or roll back. Rolling back can often require you to revert changes made to the main branch.

Note

In case you are confused about revert and restore

This is different than `git restore` since we are not restoring a file to a previous commit, but instead we are commiting an inverted commit to the graph to effectively "remove" a commit.

Reverting is simple. You just need to provide the commit(ish).

```bash
git revert <commitish-sha>
```

```bash
➜  git revert a665b08
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
error: could not revert a665b08... E
hint: After resolving the conflicts, mark them with
hint: "git add/rm <pathspec>", then run
hint: "git revert --continue".
hint: You can instead skip this commit with "git revert --skip".
hint: To abort and get back to the state before "git revert",
hint: run "git revert --abort".
```

Yes, conflicts can happen while reverting. Lets fix the conflict and finish this revert. Resloving them are a lot like rebase.

Figure out the code you want to keep and `git revert --continue`
s
