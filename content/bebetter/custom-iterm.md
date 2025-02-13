# Custom iTerm

## Step 1- Choose your theme

You can choose your theme here: `https://github.com/mbadolato/iTerm2-Color-Schemes/tree/master`
After that, follow the instruction to setup the theme in iTerm2

## Step 2 - Create the .zshrc file

Check if `.zshrc` is available in your folder, if not create in this directory `touch ~/.zshrc`

## Step 3 - Add these to the file

Add these lines into the last of `.zshrc`

```bash
PS1="%{%F{033}%}%n%{%f%}@%{%F{green}%}%m:%{%F{yellow}%}%~%{$%f%}%  "
export CLICOLOR=1
export LSCOLORS=ExFxBxDxCxegedabagacad
```

## Step 4 - Restart iTerm2

Yay, now restart and use the iTerm

Notice when you modify the theme, to save profile, follow these steps:

- `General` -> `Preferences` -> `Save Current Settings to Folder`

## To setup Git & Github in iTerm2

[Git Credential Manager](https://github.com/GitCredentialManager/git-credential-manager) (GCM) is another way to store your credentials securely and connect to GitHub over HTTPS. With GCM, you don't have to manually [create and store a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens), as GCM manages authentication on your behalf, including 2FA (two-factor authentication).

1. Install Git using [Homebrew](https://brew.sh/):

   ```shell
   brew install git
   ```

2. Install GCM using Homebrew:
   `shell
brew install --cask git-credential-manager
`
   For macOS, you don't need to run `git config` because GCM automatically configures Git for you.
   The next time you clone an HTTPS URL that requires authentication, Git will prompt you to log in using a browser window. You may first be asked to authorize an OAuth app. If your account or organization requires [two-factor auth](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa), you'll also need to complete the 2FA challenge.
   Once you've authenticated successfully, your credentials are stored in the macOS keychain and will be used every time you clone an HTTPS URL. Git will not require you to type your credentials in the command line again unless you change your credentials.

Then just commit your message as regularly
When you `push` it will ask you to prompt a OAuth for the first time.

- [ ] Check if `Git Credential Manager` allow to push from different git account

References:

```output
- https://stackoverflow.com/questions/689765/how-can-i-change-the-color-of-my-prompt-in-zsh-different-from-normal-text#2534676
  References for Git in iTerm2:
- https://docs.github.com/en/get-started/getting-started-with-git/caching-your-github-credentials-in-git
- https://docs.github.com/en/get-started/getting-started-with-git/set-up-git
```
