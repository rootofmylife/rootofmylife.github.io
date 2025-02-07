# Setup

## Github Copilot

How to logout:

- `:Copilot auth signout`
- Remove `~/.config/github-copilot/hosts.json` to delete auth information.

## Linux Prerequisite

If you install on Linux, you are probably missing package `vim-gui-common`, which causes the error "Sorry, the command is not available in this version..."

It is probably also advisable to install `vim-runtime`. Commands to install:

```bash
sudo apt-get install vim-gui-common
sudo apt-get install vim-runtime
```

## `vim.plug`

If you want to install plugins for vim, add this addon: [vim-plug](https://github.com/junegunn/vim-plug)

## How to reload .vimrc file without restarting vim session

The procedure to reload .vimrc in Vim without restart:

1. Start vim text editor by typing: vim filename
2. Load vim config file by typing vim command: Esc followed by :vs ~/.vimrc
3. Add customization like:

   ```bash
   filetype indent plugin on
   set number
   syntax on
   ```

4. Use :wq to save a file and exit from ~/.vimrc window.
5. Reload ~/.vimrc file by typing any one of the following command:

```bash
:so $MYVIMRC
OR
:source ~/.vimrc
```

## Enable syntax highlight for Vim

Check and create `~/.vimrc`
Insert this code:

```vi
filetype plugin indent on
syntax on
```

## Resize current window

Run

```bash
:resize 30 " mean resize to 30 row
```

You can also change the height in increments

```bash
:res +5
:res -5
```

To change width:

```bash
:vertical resize 70
```

Width with increment:

```bash
:vertical res +5
:vertical res -5
```

## For Python extension

### Auto completion

First you need to install [node](https://nodejs.org/en/download)

```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Download and install Node.js:
nvm install 22

# Verify the Node.js version:
node -v # Should print "v22.12.0".
nvm current # Should print "v22.12.0".

# Verify npm version:
npm -v # Should print "10.9.0".
```

Then install [`coc.nvim`](https://github.com/neoclide/coc.nvim)

```bash
" Use release branch (recommended)
Plug 'neoclide/coc.nvim', {'branch': 'release'}

" Or build from source code by using npm
Plug 'neoclide/coc.nvim', {'branch': 'master', 'do': 'npm ci'}
```

Now go into your project at root folder to install [`coc-pyright`](https://github.com/fannheyward/coc-pyright):

1. create venv in project: `python3 -m venv .venv`
2. `source .venv/bin/activate`
3. `:CocInstall coc-pyright`
4. Install modules with pip and work with Pyright
5. `deactivate`

## Set Vim line number

If you need number every time you start vi/vim, append the following line to your `~/.vimrc` file:  
`vi ~/.vimrc`  
Append the following line:

```bash
set number
set relativenumber " make line easier to read
```

To disable and not set line number by default in vim, add the following in ~/.vimrc file:

```bash
set nonumber
```

## Help

Use `:h` with the command to search for usage

- `h options`
- `h <tabcomplete or ctrl-d>`
- `h <specific option name>`
  For example:
  `:h reg`

## The Terminology

### Buffer

A buffer contains the text of the file and is what you edit.
`:h buffer`

### Window

Contains a buffer to display. Windows can be closed but the underlying buffer can remain in memory.
`:h window`

### Tabs

A tab is like another viewport. You can have many windows|splits open per tab.
`:h tab`

### Splits

A split simply refers to splitting the viewport in N sections (various sizing and orientations available) to display windows.
`:h split`

## Help Menu

Help menu can be accessed by typing `:h<enter>`. There is _so much documentation_, that is pretty good, available. If you find yourself lost, RTFM (at least that is what they tell me).

## Motion

A command that moves the cursor (taken straight from the help docs, `:h motion`).

## Abbreviations

Ctrl+a will be abbreviated `<C-a>`. This is also how its referenced in VimL, Vim's editor language.
Enter will often be abbr as `<CR>`
Tab, Escape, and space will be `<tab>`, `<esc>`, `<space>`
When you see something that starts with a `:` that means it will execute a command.

## Modes

There are a few modes that you should be aware of.

- Normal
- Insert
- Visual Mode
- Visual Line Mode

### Visual Mode

Highlight part of this line by pressing `v`, then navigate around, escape `esc` to leave visual mode

### Visual Line Mode

Highlight this line by pressing `Shift + v`, then navigate around, escape `esc` to leave visual mode. If you use `j` or `k`, it will highlight all lines selected

### Visual Mode + y / p

Highlight this line by pressing `Shift + v`, then press `y` (copy that line) press `p` (paste that line)
Highlight this point by pressing `v`, press `wy` (copy that block of text) press p (paste that block of text)

### Delete

In visual mode, you only need to press `d` to delete the content

### Insert mode

`i`: left side of cursor
`a`: right side of cursor
`Shift + i`: go to the start of line and open insert mode
`Shift + a`: go to the end of line and open insert mode
`o`: insert new line below line and go into insert mode
`Shift + o`: insert new line above line and go into insert mode

## Indentation

```viml
set tabstop=4 softtabstop=4
set shiftwidth=4
set expandtab
set smartindent
```

Vim has 5 options relating to (manual) indentation:

| Name        | Shorthand | Default Value    |
| ----------- | --------- | ---------------- |
| expandtab   | et        | off              |
| tabstop     | ts        | 8                |
| shiftwidth  | sw        | 8                |
| softtabstop | sts       | 0                |
| smarttab    | sta       | off (Neovim: on) |

You can find the documentation for each in Vim with `:help 'option'`.  
For how to set options, see `:help set-option`.

### Expandtab

`expandtab` is simple: If it is set, indentation is always done with spaces.  
No tabs are inserted unless typed with \<Ctrl-V\>.

### Tabstop

`tabstop` is similarly simple: It defines the width of a \<Tab\> character.

### Shiftwidth

`shiftwidth` determines how many blanks are inserted when using the `>` and `<` commands, and when automatic indentation is used.  
If set to 0, it uses the value of `tabstop`.

### Softtabstop

Here's where things become slightly more complex.  
When `softtabstop` is not 0, \<Tab\> and \<Backspace\> insert and delete this many spaces.  
If `expandtab` is not set, `tabstop` many spaces will be replaced by a \<Tab\>.

For example, with `:set noexpandtab tabstop=8 softtabstop=2`,  
Pressing \<Tab\> four times gives you the following:

2 Spaces  
4 Spaces  
6 Spaces  
1 Tab (8 spaces wide)

This allows `tabstop` to be left at the default value of 8, which is the most compatible.

If `softtabstop` is set to a negative value, the value of `shiftwidth` will be used.

### Smarttab

When `smarttab` is set, pressing \<Tab\> at the start of a line (i.e. when using \<Tab\> for indentation), will always use the value of `shiftwidth`.
Anywhere else, `softtabstop` (if set) and `tabstop` are used.

Opinion: I heavily recommend always setting `smarttab` (the default if you use Neovim!), and use `shiftwidth` as the one true indentation width.

### Styles

#### Tabs Only

Where `N` is your desired indentation size:

```vim
set noexpandtab   " Default
set tabstop=N
set shiftwidth=0  " Use value of tabstop
set softtabstop=0 " Default
set smarttab      " Optional
```

#### Spaces Only

Where `N` is your desired indentation size:

```vim
set expandtab
set tabstop=N      " Optional, if you want files with tabs to look the same too.
set shiftwidth=N
set softtabstop=-1 " Use value of shiftwidth
set smarttab       " Always use shiftwidth
```

#### Tabs and Spaces Mixed

This style can be used if you want to leave `tabstop` at its default of 8, but want \<Tab\> to behave as if it was a different value.  
Where `N` is your desired indentation size:

```vim
set noexpandtab    " Default
set shiftwidth=N
set softtabstop=-1 " Use value of shiftwidth
set smarttab       " Always use shiftwidth
```

#### Using a Different Number of Blanks for Alignment

`smarttab`s behavior allows \<Tab\> to insert a different number of blanks when not at the start of a line.  
This is done by using the `softtabstop` option.  
This is useful for aligning comments and variable names, for example.
For a tabs-only style, this doesn't really work due to how `softtabstop` works, since changing the value of `tabstop` can then mess up your alignment, if it contains tabs.  
For spaces-only and mixed styles, you can simply change `softtabstop` to your desired alignment size.

## Basic movement: h, j, k, l, w, b

Press `j` to go down

- `5j` will go down 5 line, it's equal to `jjjjj`
  Press `k` to go down
  Press `h` to go right
  Press `l` to go left
  Press `w` to jump over words, press `b` for vice versa.
- `w`, `b` for word hopping. Effectively the same as Option/Ctrl + arrow keys
  `Shigt + g` will go to the bottom of the file
  `c` is a powerful motion (change). You use it just like `d` but at the end of the
  motion you are ejected from `NORMAL` and into `INSERT`.
- So if you wished to delete a word and then type in a new word, `c` is a great
  habit to form.

`ctrl + d` will jump down by half page
`ctrl + u` will jump up by half page

if you have a code block that is in between `{`, `}`, `[`, `]`, etc, then use `%` to jump between open & close bracket => this allow you to read the code in the bracket or delete it. Remember to put the cursor in the open or close bracket first

- Press `x` to delete one character
- `yy` to "copy" a line, called Yank
- `dd` to delete, and yank, a line (`Shift + v + d` also deletes a line) - Use `u` for undo
- `d4j` will delete current line & more 3 lines
- `Shift + d` deletes from the cursor to end of line
  - `di}` will delete everything inside the squirrely braces. Make sure your cursor in the code block first (same for `ci}`)
  - `da{` will delete the curly braces as well (so `va{` will highlight everything in code block, then you can use `Shift + v` to to visual line mode instead of visual mode. Then if you hit `o` you can jump the visual mode and jump up and down to include more lines)
  - `diw` will delete the word (used when the word is too long)
  - `diW` will delete all the character is non whitespace (non contiguous whitespace)
  - `viwp` will select the current line and replace everything in clipboard
- `p` and `P` to paste the contents of the implicit register below / above
- `:reg` show deleted content in history. The last thing which is deleted is always of the top
- [ ] Search about `:reg` in Vim

## Set colorscheme

```text
:colorscheme desert
```

Find more color here: [Vim Color Themes](https://vimcolorschemes.com/i/top)

## Files and Navigations

Open the tree dir by using `vim .` in the current directory
In this time, you can you `:e <searck-key>` to browse file through directory (using `tab`)
There are other ways to open files in vim. You are not restricted to just using the file tree. There is also `:e`. `e` is short for `edit`.

To open up the file navigation when you are in `INSERT` mode, you can use:
`:Ex`: this will replace your screen with file navigation
`:Vex`: this will split your current screen with file navigation

- `:Vex` stands for (V)ertical (ex)plore. Meaning, split the current view experience vertically (direction of line) and insert a netrw at current buffer location.

If you want to move around tab. First press, `ctrl + w`, then

- `h` to go to left window
- `j` to go to below window
- `k` to go to top window
- `l` to go to right window

If you press `Ctrl + w` then `Ctrl + o`, it will close all the window except the one you are pointing

FYI,

- `Ctrl + ^` will jump to previous file
- `Ctrl + i` will jump forward, `Ctrl + o` will jump backward

## Split Screen

Press `Ctrl + w`, then:

- `s` for horizontal
- `v` for vertical

## Marks

Now marks are both incredible and also confusing at the same. Effectively vim gives you the ability to mark files both globally and locally. This means with just a swift couple taps of the finger you could be in a file marked. I find marks definitely the end game of file navigation, but they are hard to do well.

So lets open up 3 files and mark each one.

First lets open one file, `src/sockets.c`. Use your favorite way to open up this file.

```text
:e src/sockets.c
```

Then mark it by typing `m` then an **uppercase** character of your choice.

Repeat with `src/twitch.c` and `src/another.c` with different uppercase characters. Remember the 3 characters you chose.

To navigate to the files you marked simply press `'<MarkLetter>`. So for me, I chose `G` for `sockets.c`, and to navigate there I simply press `'G`.

## Install plugin

We will try to install [`fzf.vim`](https://github.com/junegunn/fzf.vim)
Copy this content and put it between `call plug#begin()` and `call plug#end()`:

```bash
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
Plug 'junegunn/fzf.vim'
```

After that, enter command:

```bash
:so %
```

Then install the plugin:

```viml
:PlugInstall
```

Done. Now you can go to your Git project and try it (read the instruction in the repo - link attached above)
For example:

```bash
:GFiles
```

Note: you can do fuzzy search with this

## Search

Do some basic search

```bash
/some-key-search<CR>
```

Press `n` will jump to the next searched results, and `shift + n` to search backward

(Type this command `:set hls ic` to highlight all search results)

You can search in range by start visual mode and select range, then type `:` and start to search

## Search and Replace

Replace "foo" with "baz" by typing `:s/foo/baz<CR>`

If you type `:s/` then it will search and replace in single line
type `:%s/` for the whole file

If you append `g` like `:s/foo/baz/g`, it will replace all entity
If you append `g` like `:s/foo/baz/gc`, it will ask you for each item to be replaced

## Macros

Press `q` to start marco mode in the line we want to. Then choose the letter to represent your macro, for example `a`
Now start your key stroke
After finish, press `q` to exit macro mode

To run marco, type `@a`

Other shortcut:

- `_` or `^` to go to the first non whitespace character of the line.
  - Press `0` (zero), it will go to the very beginning of the line
- `$` will go to the end of the line
- if you type `dt"`, which mean it will delete from the current position of cursor until the `"` position in the line
- press `f` then `"` it will hop to next quote in the line. (`Shift + f` will jump reverse)
  - press `,` or `;` to go to next quote (you can do the same for character, e.g. `fT`)
- `t` is the same as `f` but it will jump before the character (`Shift + t` will jump reverse)
- `d$` will delete everything from current cursor to the end of line (the same with `Shift + d`)
- `Shift + s` will delete the whole line and respect the indent then go to insert mode
- `s` will just delete one character and then go to insert mode
- [ ] Marco with register, this will allow you modify the marcos

## Indenting

Some variables you might want to set:

```bash
:set tabstop=8     - tabs are at proper location
:set expandtab     - don't use actual tab character (ctrl-v)
:set shiftwidth=4  - indenting is 4 spaces
:set autoindent    - turns it on
:set smartindent   - does the right thing (mostly) in programs
:set cindent       - stricter rules for C programs
```

To indent the current line, or a visual block:

```bash
ctrl-t, ctrl-d  - indent current line forward, backwards
                  (insert mode)
visual > or <   - indent block by sw (repeat with . )
```

## Appendix

### Setup Github Copilot

```output
https://github.com/github/copilot.vim
```

Go to above link and see instruction

### Install Vim plugin

Go to URL `https://github.com/junegunn/vim-plug` and follow instruction.
