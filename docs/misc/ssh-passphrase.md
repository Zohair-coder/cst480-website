---
title: Using an ssh passphrase
sidebar_position: 1
---

If you use a passphrase when generating your ssh key, you’ll have to type it every time you ssh. Manually, you can run

```bash
eval `ssh-agent -s`
ssh-add ~/.ssh/<private-key-file>
```

and copy-paste your passphrase, and then for the rest of your session, you won’t have to type it when sshing ([source](https://stackoverflow.com/questions/17846529/could-not-open-a-connection-to-your-authentication-agent/17848593#17848593)). But the next time you log back in, you’ll have to run those commands and enter your passphrase again.

If you’re using this ssh key to log into Linode, you can google to see what credential managers your OS supports. If you’re running macOS or Windows, you may be able to add your ssh passphrase to a secure keychain so you never have to type it when sshing into your Linode server.

If you’re using ssh on your Linode server (say, to clone a git repo), you can install a program called keybase to manages your ssh credentials ([found here](https://unix.stackexchange.com/questions/90853/how-can-i-run-ssh-add-automatically-without-a-password-prompt/90869#90869)). Run

```bash  
sudo apt install keychain
```

and add the following line to your ~/.bash_profile (create it if it doesn’t exist):

```bash
eval `keychain --agents ssh --eval <private-key-file>`
```

All commands in the .bash_profile are run when once when you log in. This will run the keychain program, which will start the ssh-agent and add your private key file to it. You’ll have to type the passphrase when sshing into your Linode server once, but after that, no matter how many times you log in and out, you won’t have to type the passphrase again.

The downside of using keychain is that:

1. Adding new key files requires manually changing your .bash_profile, and it might be difficult to see which passphrase you’re being prompted for from the command line (I haven’t tried this yet). I looked into making the ssh-agent read from the config file or loop through all files in .ssh, but this didn’t seem possible and apparently can introduce problems ([source](https://unix.stackexchange.com/questions/322124/ssh-add-add-all-private-keys-in-ssh-directory#comment922597_322137)).
2. It’s less secure, because with these settings, you’re not prompted to re-enter your credentials (maybe ever? Not sure — I think you can configure keybase to reprompt you every once in awhile, but I didn’t look into this), which makes me wonder whether using a passphrase even benefits you at this point.