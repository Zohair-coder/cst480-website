---
title: Step 4. Set up your web server
sidebar_position: 5
---

# Set up your web server

There are many web server programs. We could write one ourselves in Express (e.g. `app.use(express.static("public"))), but since all we want to do is serve static files, it makes more sense to use a web server program optimized for that purpose.

Apache is old and used to be more popular (tux uses Apache), but it’s being phased out in favor of Nginx. Since Nginx can be complicated to configure, we’ll use a somewhat newer program called Caddy instead.

Follow [these instructions](https://caddyserver.com/docs/install#debian-ubuntu-raspbian) to install Caddy.

Check that it worked by running

```bash
systemctl status caddy
```

which should say “active (running)”. If you run

```bash
curl localhost:80
```

you’ll see it serve the default Caddy HTML page, stored at /usr/share/caddy/index.html.

Caddy is currently running as a daemon/service managed by systemd, a Linux system daemon manager. You can run other instances of Caddy, but a) they’ll only be able to listen to ports ≥ 1024 unless that Caddy instance was run with root access (and we need to listen to ports 80 and 443 to receive public HTTP and HTTPS traffic) and b) they’ll be run in the foreground, preventing you from running other commands and quitting when you close your terminal. So we’ll use the systemd Caddy service to serve our site.

## Site files and the Caddyfile

You could put your site files in your home directory, but a) you’ll have to be careful not to delete them when you’re mucking about, and b) in order to give your webserver permission to read those files, your home directory will have to be world readable, so you wouldn’t be able to make your home directory private (doing so gives an additional layer of security, because if you misconfigure your webserver, an attacker still won’t have access to your user files — [see here](https://askubuntu.com/a/767534)).

A better and more commonly used location is `/srv` ([source](https://unix.stackexchange.com/a/159177)). Create the folder (replacing DOMAIN with your domain name) `/srv/DOMAIN`, then run (replacing USERNAME with your username and DOMAIN with your domain name)

```bash
sudo chown USERNAME:USERNAME /srv/DOMAIN
```

to make your user the owner of those site files so you won’t need root access to deploy your site. Since the files are world-readable but not world-writable, Caddy will be able to read but not write to them, which is important because if your Caddy webserver is compromised, an attacker won’t have permission to edit your website.

Put an `index.html` file in that folder with some content.

Your web server’s config is stored in `/etc/caddy/Caddyfile`. You can read [here](https://caddyserver.com/docs/caddyfile/concepts#structure) to learn more about Caddyfiles. Open that file for editing (you’ll need sudo access).

Inside the curly braces, replace the line `root * /usr/share/caddy` with `root * /srv/DOMAIN` (replacing DOMAIN). This will tell Caddy what folder contains your site files. Additionally, inside the `:80` block, add this block (replacing DOMAIN):

```plaintext
log {
    output file /var/log/caddy/DOMAIN.log
}
```

This will save logs on all HTTP requests served to the file above. Keep the `file_server` line uncommented and the other lines commented.

Run

```bash
sudo systemctl reload caddy
```

to make Caddy reload its config and apply our changes. If you get an error, run `systemctl status caddy.service` to get more detail. Usually, there will be some syntactic error with the Caddyfile. If this is the case, you can run

```bash
sudo caddy fmt --overwrite
```

in the directory with the Caddyfile, and if the problem is easily fixed, it’ll be automatically repaired. Try reloading again. If Caddy ends up in a weird state, you can try a hard restart:

```bash
sudo systemctl stop caddy
sudo systemctl start caddy
```

Stop/start quits and restarts your server, which will cause your site will go down briefly. Reload is preferred because it changes the config without shutting down your server.

To see if it worked, run

```bash
curl localhost:80
```

You should see the `index.html` file you just put into `/srv/DOMAIN`.

If you want to learn more about the Caddy service, [see here](https://caddyserver.com/docs/running).

## Serving for your domain

Visiting your domain through the browser still won’t work because Caddy is only serving requests made to localhost. Open up your Caddyfile and change the host (the text just before the opening curly brace) to `DOMAIN, www.DOMAIN`. If your domain was `mycoolsite.com`, your Caddyfile would look like this:

```plaintext
mycoolsite.com, www.mycoolsite.com {
    # Set this path to your site's directory.
    root * /srv/mycoolsite.com

    # Enable the static file server.
    file_server

    # Another common task is to set up a reverse proxy:
    # reverse_proxy localhost:8080

    # Or serve a PHP site through php-fpm:
    # php_fastcgi localhost:9000
    log {
        output file /var/log/caddy/mycoolsite.com.log
    }
}
```

Reload Caddy and try curling your site. You still won’t be able to see your site because your server’s firewall is configured to block all non-Tailscale port traffic by default. We’ll change this now.

> Since Caddy is now only serving your site files for your domain, you won’t be able to curl localhost:80 to see your site files anymore.

### Aside: Caddy gives you HTTPS by default

Web servers need to be configured to serve sites over HTTPS. HTTPS is an encrypted version of the HTTP protocol. It’s usually better to serve sites using HTTPS because then other users on the same network as your site visitors can’t see the contents of the pages they visit (and HTTPS is necessary if you want to run a website that takes usernames and passwords, as otherwise, anyone on the same network as you running a traffic sniffing program like [Wireshark](https://www.wireshark.org/) could see their passwords when they try to log in).

Setting up HTTPS usually requires you to a) procure a TLS/SSL certificate from a reputable Certificate Authority, b) put the public and private certificates in specific places on your server, and c) tell your web server where you put them. You can then tell your web server how to handle HTTP requests (should they be ignored, automatically redirected to HTTPS, handled by a separate server, etc.). Additionally, certificates expire, and when they do, you need to provision a new one and follow all the above steps again.

If you were using a web server program like Nginx or Apache (or writing your own web server with Express), you’d need to configure all of this yourself. Luckily, Caddy [does all of that for us](https://caddyserver.com/docs/automatic-https). Caddy automatically provisions certificates, refreshes them when they expire, and redirects all HTTP requests to HTTPS automatically (which you can see if you try visiting the HTTP version of your site explicitly).

## Configuring your firewall (again)

Since we set a default deny policy for ufw previously, we’ll need to specifically whitelist HTTP and HTTPS traffic. Run

```bash
sudo ufw allow http
sudo ufw allow https
sudo ufw reload
```

If you now run `sudo ufw status`, you should see this:

```
Status: active

To                         Action      From
--                         ------      ----
Anywhere on tailscale0     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443                        ALLOW       Anywhere
Anywhere (v6) on tailscale0 ALLOW       Anywhere (v6)
80/tcp (v6)                ALLOW       Anywhere (v6)
443 (v6)                   ALLOW       Anywhere (v6)
```

Try curling your domain name. You’ll need to either pass the -L flag or add https:// before the domain because Caddy will redirect all HTTP requests to HTTPS, and curl doesn’t follow redirects and uses HTTP by default.

If the curl command works, you should see your site files. Now try visiting your domain in a browser. You should see the same files. You should also see them if you visit the www version of your domain.

Congratulations — you are now hosting a site on the public internet.

## Debugging

If you’re not able to see your site when visiting your domain, try the following steps:

- Run `sudo systemctl status caddy` to make sure Caddy is running. Make sure you ran `sudo systemctl reload caddy` to apply your Caddyfile changes.
- Run `sudo ufw status` to make sure HTTP and HTTPS traffic is allowed through. Make sure you ran `sudo ufw reload` to apply your firewall rules.
- Make sure your DNS records are correct. The A and AAAA records should be pointing to your server’s IPv4 and IPv6 addresses, respectively (not your Tailscale IP address).
- Make sure your Caddyfile is correct. Your Caddyfile should have your site’s domain before the curly brace block.
- curl your domain (don’t forget the https:// or the `-L` flag) with the `-v` flag (for verbose). What HTTP status code are you getting? Google it to see what it means.

  - If it’s 404, make sure your site files are in the right place and have the right permissions.

    - If you followed the instructions, your files should be in the folder `/srv/DOMAIN`, not `~/srv/DOMAIN` (recall that `~` is an alias for your home directory, `/home/DOMAIN`). Check that path in the “root” line in your Caddyfile matches the path of your site folder.
    - If the folder that contains your site files (or any of its containing folders) isn’t readable by the caddy user, you may also get a 404. The easiest way to fix this is to make the `/srv/DOMAIN` folder world-readable (`/srv` must also be world-readable, but it is by default, unless you changed it).
    - If you didn’t put an `index.html` file in your site folder, then `curl https://DOMAIN` will return a 404 because HTTP(s) requests to `/` routes are redirected to `/index.html`. Fix this by adding an index.html or pointing the request at any files you did add, e.g. `curl https://DOMAIN/my-file.html`.

  - If you’re getting a 521, this could be any number of issues. Make sure Caddy is working and your firewall is allowing incoming HTTP/HTTPS traffic.

- You can try hard restarting Caddy by running `sudo systemctl stop caddy; sudo systemctl start caddy`.