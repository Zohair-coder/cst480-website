---
title: Step 2. Set up your Linux server
sidebar_position: 3
---

# Set up your Linux server

Your server is publicly accessible — anyone with a working internet connection can attempt to connect to it, so we’ll need to harden the server in order to keep it secure.

To ssh into your server, run

`ssh root@_IP_`

If you haven’t logged in yet, you’ll be prompted to change your root password. If you’re using Hetzner, you should’ve been emailed your root password.

> If you already changed your root password but forgot it, you’ll need to delete the server and reprovision a new one from scratch.

Whenever you log into a freshly installed Linux system for the first time, it’s good to make sure the system packages are up to date. Run this command:

```bash
apt update && apt upgrade
```

> If it’s been awhile since you’ve used the command line, you might find this [Unix reference page](https://www.cs.drexel.edu/~nkl43/cs265_winter_2023-24/course_site/misc/unix-reference/) useful.

## Create a non-root user

You logged into your Linode server using the root user. As the root user, every command you run has superuser privileges, so you won’t be prompted for a password even if you (or the program you run) is about to do something dangerous like delete your entire filesystem.

Running as root is error-prone. Instead, we’ll create another user and give them superuser privileges. Whenever you want to run a privileged command, you can run it with sudo. But by default, commands you run won’t be privileged, which provides an extra guard against doing dangerous things by accident.

After logging in as root, to create another user, run the following, replacing USERNAME with whatever username you want (make sure you remember what you chose):

```bash
adduser USERNAME
```

You’ll be prompted to create another password. Save this somewhere secure. You can press enter to use the default value for the other prompts.

Now, we’ll give this user super privileges. Run

```bash
adduser USERNAME sudo
```

The user you just created can now run sudo. Exit the server (you can run the exit command to log out) and run the following, replacing USERNAME with your username and IP with your server’s IPv4 address:

```bash
ssh USERNAME@IP
```

You’ll be prompted for a password — use the one you just created (not the root password). You should now be logged in as that user. Your home directory is `/home/USERNAME`.

There’s no reason to allow logging in as the root user. We’ll never need it since we can do anything privileged with sudo. Run

```bash
# vim doesn't come installed by default
# you can just use vi if you don't feel like installing vim
sudo apt install vim
sudo vim /etc/ssh/sshd_config
```

This is the configuration file for the ssh service. System services are also known as daemons, hence why it’s called sshd_config. Daemons are programs that run constantly in the background. This file is only writable by root, which is why we need sudo. You’ll be prompted for your password the first time you use sudo in a session — you’ll use the same password for sudo that you do for logging in (again, not the root password).

Find the line PermitRootLogin and change the yes to a no. Save and quit (enter command mode with ESC, then type `:wq`), then run

```bash
sudo systemctl restart sshd
```

to restart the ssh daemon, which will prompt it to reload the configuration file and apply the changes.

To check that this worked, try logging in as the root user. ssh should hang and then say permission denied, even when you use the correct password. You will now only be able to log into your server with the user you just created.

## Create ssh keys

ssh keys are an alternative to using your password to log in with ssh. You can run a program to generate a public and private keypair locally on your laptop. Then, you can give the public key to your server, and when you ssh in, ssh will use your local private key file to identify you, and you won’t have to use your password.

ssh keys tend to be more secure than passwords because they’re longer and thus harder to brute force guess (ideally, they’re not brute forceable before the heat death of the universe, assuming the encryption holds up even as computing power increases). Also, if you don’t use a password to encrypt your ssh private key file locally, you won’t have to enter a password to log in — ssh will just use your key file and grant you access immediately.

> Setting up ssh keys is less important for us because we’re going to use Tailscale ssh later, but if you ever want to disable (or temporarily shut down) Tailscale, it’s nice to have them configured so you can log in easily. Plus, it’s useful knowledge because a lot of other systems use ssh keys, like Github.

On your local environment (i.e. not sshed into your server), check to see if you have a .ssh folder in your user directory (`~`). If you don’t, run `mkdir .ssh` to create it, then lock it down with `chmod 700 .ssh`.

> Note that .ssh starts with a period, which means it’s a hidden file, so you’ll need to pass the -a flag to `ls` to see it.

cd into .ssh, then run this command to create a public/private keypair:

```bash
ssh-keygen -t ed25519
```

- The -t flag says to use EdDSA encryption algorithm instead of default RSA algorithm, which is currently out of favor in the security community. EdDSA seems in favor right now.
- When prompted for filename, pick a name. I chose `HOSTNAME_hetzner`, using the name I gave the server when I created it through the Hetzner interface.
  - You can leave the filename blank, and then ssh-keygen will name it after the encryption algorithm you’re using. Using the default filename makes ssh easier to configure, but if you ever want to add more ssh keys later (e.g. to clone a Github repo), you’ll need to choose a filename because your new key will overwrite your old one if you generate a new key using the same algorithm.
- Only use a passphrase if you’re okay with typing that in every time you ssh into your Linode server. A passphrase will encrypt the ssh key on your system, meaning that if someone steals your laptop, they won’t be able to decrypt your key without the password. You can press enter without typing to use an empty passphrase. If you want to use a passphrase, see [here](../ssh-passphrase) for more information.
  - I personally don’t use one because I find it annoying to type it over and over again. But that’s just me.

ssh-keygen will generate two files — one named `KEYFILENAME`, the other named `KEYFILENAME.pub`. The first file is your private key — never, ever share this, as it’s effectively your password. The second file is your public key, which can be shared.

Make sure the private key is only readable/writable by the owner (chmod 600). The public key can be readable (but not writable) by groups other than the owner (chmod 644). The `ssh-keygen` program should do this by default.

Because we gave our ssh key a filename instead of using the default filename, we’re going to have to tell ssh which filename has the key for which server. Open (or create) .ssh/config and add these lines, replacing IP, USERNAME, and KEYFILE with your server’s IPv4 address, the username you picked, and the name you chose for your key file, respectively.

```bash
Host IP
    User USERNAME
    IdentityFile ~/.ssh/KEYFILE
```

You can add a comment with `#` if you want to briefly describe what this key is for (useful for when you forget about this months later).

Now we’ll need to add the public key to the server. From your local environment, run this (replacing KEYFILENAME, USERNAME, AND IP):

```bash
ssh-copy-id -i ~/.ssh/KEYFILENAME.pub USERNAME@IP
```

You’ll need to type your password. If successful, this should append your local public key to a file named `~/.ssh/authorized_keys` on your server.

authorized_keys is a file that will store all public keys that match private keys you want to allow to log into your server. (If when you initially logged in as a new user, you were prompted to add a line to your authorized_keys file, this is what it was referring to). ssh-copy-id should make the .ssh and authorized_keys files writable only by root, though world readable, as your ssh public key is public — it’s the private key on your local laptop that you need to keep private.

> If you don’t have a program called `ssh-copy-id` on your local computer, you can follow these steps instead. Run this command locally (replacing KEYFILENAME, USERNAME, AND IP):

```bash
scp ~/.ssh/KEYFILENAME.pub USERNAME@IP:/home/USERNAME
```

This will copy your public key to your server and put it in your home directory.

Now, ssh into your server (you’ll still need to type your password), then run the following commands (replacing KEYFILENAME):

```bash
if [[ ! -d ~/.ssh ]]; then
  mkdir ~/.ssh
fi
chmod 744 ~/.ssh
mv ~/KEYFILENAME.pub ~/.ssh/authorized_keys
chmod 644 ~/.ssh/authorized_keys
```

This will append your public key file to the `~/.ssh/authorized_keys` file so ssh can find it. You can test that the permissions were set correctly by running `ls -alR ~`.

Now log out and try sshing back in. You should immediately log in and not be prompted for a password, unless you chose a passphrase when creating your ssh key, in which case you’ll need to enter it. If this doesn’t work, try looking around [this page](https://unix.stackexchange.com/questions/36540/why-am-i-still-getting-a-password-prompt-with-ssh-with-public-key-authentication/55481) to figure out why. Usually it’s an issue with permissions.

Once you get the ssh keys working (you’ll know when you can ssh in without being prompted with a password, or if you chose a password for your key, only being prompted for your ssh key passphrase), ssh onto your server and run

```bash
sudo vim /etc/ssh/sshd_config
```

> You’ll still need to enter your user’s password when you want to use sudo — the keypairs were just for ssh.

Find the line that says PasswordAuthentication and change the yes to a no.

Run

```bash
sudo systemctl restart sshd
```

to restart the ssh daemon again.

To test that this worked, on your local laptop, temporarily rename the private key file associated with your server, then try to ssh in again. ssh will give an error saying that it couldn’t find the private key file, but instead of prompting you for a password, it’ll say “Permission denied (publickey)”. This means password logins are disabled.

> If this didn’t work, you may need to delete the default sshd config files; [see here](https://superuser.com/a/1816612).

Note that while disabling password logins makes your server more secure, if you ever lose your ssh keys, you’ll lose access to your server, as you won’t be able to use your password to log in. However, most hosting providers, including Hetzner, provide a recovery console that you can use to get into your servers if you lose access to them. The recovery console will only allow you to log in as root, so keep your root password saved somewhere in case you ever lose access to your ssh keys.

## Set your hostname

Your server will need a hostname when we’re configuring a web server program to serve a website from it. It’ll also be useful when installing Tailscale, as Tailscale will use that to identify your server. This hostname is not the same as your website’s domain name. The domain name is what people will use to visit your site. The hostname is what programs you run will use to identify your server.

You can choose whatever hostname you want. People who run multiple servers sometimes name them after themes: trees, animals, books, characters, etc. You can also give them functional names like `web_server`, use numbers — whatever you want.

> It’s convenient to make your hostname the same as whatever name you gave your server in the Hetzner interface, because you’ll be able to easily identify your server from the command line and the Hetzner dashboard. You can also edit your Hetzner’s server name if you want to change it.

Run (replacing HOSTNAME with a hostname of your choice)

```bash
sudo hostnamectl set-hostname HOSTNAME
```

then log out and ssh back in. You’ll see that your command prompt has changed to reflect your new hostname. Run

```bash
sudo vim /etc/hosts
```

and add the following lines to the bottom of the file (don’t delete any existing lines, replace IPV4, IPV6, HOSTNAME, and DOMAINNAME):

```
IPV4 HOSTNAME.DOMAINNAME HOSTNAME
IPV6 HOSTNAME.DOMAINNAME HOSTNAME
```

For example, if your hostname was `myserver`, your domain name was `mydomain.com`, your IPv4 address was 142.250.80.100, and your IPv6 address was 2607:f8b0:4006:820::2004, you would add these lines:

```
142.250.80.100 myserver.mydomain.com myserver
2607:f8b0:4006:820::2004 myserver.mydomain.com myserver
```

## Set up Tailscale

Even though we’ve set up ssh keys, our server isn’t really secure. Every port is open to the internet, ready to accept any traffic. Attackers can send packets to any port as much as they want, and if they find a port that has a vulnerable program listening, they can get access to our server.

While you haven’t posted your IP address online, attackers can send requests to all possible IPv4 addresses (there are only 2^32 = ~4.3 million of them, and with programs like [MASSCAN](https://github.com/robertdavidgraham/masscan), they can all be tried in a matter of minutes) to discover which ones have listening servers behind them. If you leave your server open, even for just a day, you’ll begin to see failed authentication attempts in your ssh logs, which are stored in /var/log/auth.log. These aren’t targeted attacks — rather, attackers have fleets of servers that run automated scripts searching for easy vulnerabilities.

Since you intend to use this server to host a website, you’ll need to leave ports 80 (for HTTP) and 443 (HTTPS) open to the public, but there’s no reason to leave port 22 (for ssh) open, as you’re the only one sshing into the server. Ideally, you’d configure a firewall that would block all traffic that wasn’t from your IP address, but your IP address changes whenever you change WiFi networks. Even if you only logged into your server from your home internet, your ISP (Internet Service Provider, e.g. Verizon or Comcast) has probably assigned you a dynamic IP address that can change whenever they want.

> Also, attackers can create packets that pretend to be from a different IP address, so even if you had a static IP address, this method of securing your server wouldn’t be foolproof either.

Instead, we can use a VPN (Virtual Private Network) to create a secure tunnel from your local computer to your server and configure your server’s firewall to block any non-web traffic that comes from outside of the VPN tunnel. We’ll use [Tailscale](https://tailscale.com/), which is an VPN built on top of the open source WireGuard VPN. Tailscale has a free plan we can use.

> Some VPNs are used to keep your internet traffic private or circumvent country blocks. They work by rerouting all of your internet traffic to their VPN server, so requests you make to other sites appear to be coming from their servers. Tailscale doesn’t do this by default (you can make it do this by setting up an exit node) — it only reroutes requests made to certain Tailscale IP addresses. Its intended purpose is to create secure peer-to-peer tunnels, which is how we’re using it. You can learn more about how it works [here](https://tailscale.com/blog/how-tailscale-works/).

As an alternative to using a VPN, you could install a program like fail2ban or sshguard, which automatically monitors your ssh logs and adds firewall rules to block users who fail login attempts after a certain number of times. But these programs can be difficult to configure and may require some babysitting to keep running.

Create a Tailscale account. You’ll need to pick an identity provider and you’ll use that account to log into your Tailscale account. Follow their instructions to install Tailscale on your local laptop. You may want to set your preferences to start Tailscale automatically on startup. If you already have a VPN installed, you may have to disable it when using Tailscale; VPNs generally don’t play nicely with each other.

Follow step 1 and step 2 of [these instructions](https://tailscale.com/kb/1077/secure-server-ubuntu-18-04/) to install Tailscale on your server, except that instead of running `sudo tailscale up`, run `sudo tailscale up --ssh`. When you run this command, it’ll print a URL that you need to visit. Paste it into your browser and authenticate with whatever identity provider you chose when you made your Tailscale account. The command line will then print “Success”, and Tailscale will be running.

When you created a Tailscale account, you were assigned a Tailscale node, which has its own IP address (you can see it in your Tailscale web dashboard). This node will act as a tunnel into your server. To log into your server, you can now run (replacing USERNAME with the ssh username you created previously and TAILSCALEIP with the IP address Tailscale assigned to your server)

```bash
ssh USERNAME@TAILSCALEIP
```

and you should be logged into your server the same as if you had run `ssh USERNAME@IP`.

At this point, all we’ve done is create another way to ssh into our server. We’ll now add a firewall that prevents any ssh access from a non-Tailscale source.

## Setting up a firewall

Follow steps 4 onward of [the same instructions](https://tailscale.com/kb/1077/secure-server-ubuntu-18-04/) to set up ufw (which stands for uncomplicated firewall). A firewall allows or blocks network access to a computer via a customizable set of rules. ufw is just a more convenient interface to iptables, a popular firewall program for Linux that’s more configurable than ufw, but also more complicated. Since our firewall rules will be simple, we’ll stick to using ufw.

Run

```bash
sudo apt install ufw
```

to install ufw, and then

```bash
sudo ufw enable
```

to turn it on. If you run

```bash
sudo ufw status verbose
```

you should see that its status is now active, and by default, it’ll deny all incoming packets, allow all outgoing packets, and disable all routing packets (routing is when we take a packet and forward it to another server).

> When computers communicate over a network (like the internet), they send units of data called packets to IP addresses and ports. An IP address uniquely identifies a computer on a network (like the IP address of your server or Tailscale node). A port is an endpoint for packets — programs listen for traffic on a port to receive data. Certain ports are reserved for specific programs. For example, ssh uses port 22, FTP (for unencrypted file transfer, not often used anymore) uses 20, and ports 80 and 443 are reserved for HTTP and HTTPS traffic, respectively. There are many ports used by many different programs.


Since we’re going to run a web server, we want to allow all outgoing packets as we’ll need to send webpages back to visitors. We’ll deny incoming packets by default unless they’re from Tailscale (we’ll allow HTTP/HTTPS traffic later). We’ll leave routing disabled as our server is a web server, not a router. Run these commands:

```bash
sudo ufw allow in on tailscale0
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

If you now run `sudo ufw status verbose`, you’ll see something like this:

```
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
Anywhere on tailscale0     ALLOW IN    Anywhere
Anywhere (v6) on tailscale0 ALLOW IN    Anywhere (v6)
```

This means that incoming packets are dropped by default unless they’re from the tailscale0 device.

> This style of firewall is called whitelisting. With blacklisting, all connections are allowed by default unless you’re on the blacklist. With whitelisting, all connections are denied by default unless you’re on the whitelist. Since attackers procure new IP addresses to hack servers all the time, a blacklist would need constant updating, so a whitelist is more secure and easier to maintain.

> The deny policy will tell the iptables underlying firewall to DROP packets instead of REJECTing them. A rejected packet is discarded and a rejection message is sent to the sender. A dropped packet is discarded, but no rejection message is sent. Dropping can slightly slow down attackers — they’ll have to wait for ssh to timeout before they know their packet wasn’t received, which will slow down brute force attacks. It will also help to hide your server from detection, as if no acknowledgment is sent, it could mean either that the packet was discarded or that no service is listening on that port at all ([source](https://stackoverflow.com/questions/4907173/ufw-linux-firewall-difference-between-reject-and-deny)).

Now run

```bash
sudo ufw reload
sudo systemctl restart sshd
```

to apply the ufw rules and restart ssh. Log out of the server and try to log in with

```bash
ssh USERNAME@IP
```

this should hang forever without logging you in. But

```bash
ssh USERNAME@TAILSCALEIP
```

should work.

Tailscale also assigns your tailnet a domain name, so you can access your server at `HOSTNAME.TAILNETNAME` instead of using the Tailscale IP address. You can see your tailnet’s domain name through the Tailscale web interface.

You’ll know your firewall is working if, after a day or two, your sshd logs (stored in /var/log/auth.log) don’t contain any failed authentication attempts. That’s because the firewall will drop any non-tailscale packets to any port before they’re even read by programs like ssh. If your firewall is misconfigured, then you’ll see failed authentication attempts from botnets trying to break into your site.

You can run `tailscale down` to shut down Tailscale, but note that if you do this, you’ll be automatically logged out, and because of the firewall rules you’ve set up, you’ll be unable to ssh back in. If you need to reboot Tailscale for some reason, you can run `sudo systemctl reload tailscale` to restart the service instead of just stopping it, though if it crashes for some reason, you’ll still be locked out and need to use your hosting provider’s the recovery console to get back in. It’s safest to disable the firewall rules blocking non-Tailscale traffic before fiddling around too much with Tailscale, and re-enable them when you’re done.

