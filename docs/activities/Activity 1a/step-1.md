---
title: Step 1. Buy a domain, rent a server
sidebar_position: 2
---

# Buy a domain, rent a server

During our first class, we’ll set up our own public websites. This requires purchasing a domain name and renting space on a shared server. **Since the process of registering a domain can take a few days, you should do the following steps at least 48-72 hours before our first class.**

If you follow the below instructions and purchase a cheap domain, you’ll probably end up spending ~$10/year domain cost + (~$5/month server cost * 3 months in winter term) = ~$25 total during this course to host your sites. Some domains are even cheaper, so you may be able to save money there (I saw some worth only $3/year). If money is an issue, please email me and we’ll see if we can work something out.

## 1) Purchase a domain name from Porkbun

Your domain name will be the name of your website throughout this course. You can choose any domain name you like (as long as it’s classroom appropriate, of course). “Buy” is a misnomer, as domain names are rented through domain name registrars (DNRs). There are many DNRs — I strongly recommend [Porkbun](https://porkbun.com/), as they’re cheap, reputable, and have a good UI.

You can search for available domain names on the Porkbun website. If a domain name is already in use, you won’t be able to rent it. Different domains will have different prices — you should be able to get one for < $20/year, if not lower (mine is $10/year, and I’ve seen some for only $3/year).

> Tip: Single word domains (like bread.com) are usually taken. Short domains or domains similar to memorable phrases may be listed as “premium” domains, which can cost thousands to rent — avoid these. Less popular top level domains (TLDs) like .info are sometimes cheaper. Avoid trendy TLDs like .io unless you’re willing to spend more money. Many DNRs offer a reduced price for the first year; you can cancel the domain after this class is over if you no longer like it or don’t want to pay the renewal price.

When registering a domain:

- Stick with the DNR’s default nameservers if you’re given the option to change them. Nameservers are how you’ll set the DNS records that will point your domain name at the server you’ll rent to serve your site. Using the DNR’s nameservers is the easiest option.
- Make sure any “domain privacy” options are enabled. Domain privacy hides your address and phone number in the public version of the ICANN whois database, which stores the contact information of all site owners (for legal reasons). You don’t want random internet strangers to be able to look up your home address.
- You don’t need any SSL certificates as we’ll be setting those up ourselves.

If you’re using a DNR other than Porkbun, note that you should never have to pay extra for domain privacy. If a DNR tacks on an additional fee for this, you should buy from another DNR.

If you’re an international student, some DNRs might ask you to confirm your identity by giving them your SSN for fraud prevention. **Don’t give out your SSN.** If this happens, try buying a domain from a different DNR — to my knowledge, Porkbun hasn’t ever done this, which is why I recommend it (if Porkbun does request your SSN, let me know so I can stop recommending them). Namecheap did this to some of my students previously, which is why I recommend Porkbun now.

## 2) Rent a server running Debian from Hetzner

You’ll use your server to host your website on the public internet in this course. We’ll rent a small shared instance from a hosting provider.

“Shared” means that the physical server you’ll ssh into and run programs (like your web server) on will also be hosting other people’s programs. This means you should avoid using your shared Linode server to do high compute tasks like train machine learning models, and you might sometimes experience slower performance if other users are using the server heavily. If you want better performance, you can rent a dedicated CPU server, but it’s more expensive, and we won’t need much compute power for our course websites anyway.

To rent a server, you’ll need to pick a hosting provider. I strongly recommend [Hetzner](https://www.hetzner.com/cloud), as they’re cheap and have a good reputation. Hetzner is a European company but they have a couple of servers in the U.S., which is suitable for our purposes.

> If you want to use a different hosting provider, you may, as long as you can get a fresh Debian install on your shared instance so you can follow along with the rest of the instructions. I’ve previously used Linode, but since they were purchased by Akami, they raised their prices a little, so I moved to Hetzner. You may not use platform as a service offerings like Heroku or Fly as they abstract away the sysadmin part of configuring your server, which we’re going to learn in this course.

To rent a server from Hetzner, make an account (make sure you’re on the “Cloud” page, as Hetzner has other products), which will require you to enter your credit card information. Once your account is created, click into the Default project on the [Hetnzer Cloud console](https://console.hetzner.cloud), then click the Add Server button to provision a new server.

- Under “Location”, select a location close to you.
  - Ashburn, VA is the closest to Drexel. This is where your server will be located, and the closer it is physically, the less latency you’ll have when accessing it.
- Under “Image”, select Debian with the latest version (12).
  - Debian is a distribution of Linux. As you learned in CS265, Linux is an open source operating system. Distributions are flavors of Linux that combine the Linux kernel with different userspace programs (like the shell and all the programs you run from the command line).
  - Ubuntu is a popular distribution specifically for desktops because of its GUI, but since we’ll only be sshing into the server from the command line, I prefer Debian since it’s also popular and known for its stability.
- Under “Type”, click “Shared vCPU”, keep the architecture at x86, then pick the cheapest option (which should be the first row).
  - The cheapest shared virtual CPU has 20 GB of traffic per month. Traffic is the amount of bandwidth used. For example, if you’re hosting a web server and your index.html is 1 KB, each time someone visits your homepage, they’ll use up 1 KB of your monthly traffic allowance. If you go over your traffic allowance, most hosting providers will charge you depending on how much you go over ([see here](https://docs.hetzner.com/robot/general/traffic/) for details on Hetzner).
  - It’s extremely unlikely you’ll even remotely approach the traffic limit with your course websites, so don’t worry about this for this course, but if you were hosting a large, popular website, you’d have to look into paying for more monthly bandwidth. Most hosting providers will allow you to view your monthly traffic and potentially set alerts to email you when you approach your monthly limits.
- Under “Networking”, keep both the public IPv4 and IPv6 options checked.
  - You’ll want a public IP address so you can host a public website. While we could save money by only provisioning an IPv6 address, in practice, some users still only have IPv4 addresses, so it’s better to have both.
  - I’ve also had weird issues trying to connect to different websites from a server that only had an IPv6 address, e.g. when trying to push changes to Github, so you’d probably be better off having both even if you didn’t want to host a public site.
- Under “SSH keys”, select nothing. You’ll be emailed the root password to your machine.
- Skip to the end.
- Under “Name”, you can choose a name for this server. This will be the server’s default hostname when you ssh into it and what you’ll see in the Hetzner console interface.
  - You don’t have a pick a name different than the default, but it’s nice to give it a name to distinguish it in case you end up renting other servers for whatever reason. Also, it’s fun. I like to name my servers after species of trees.

Click “Create and Buy Now”. In a few minutes, you should receive an email with your server’s IPv4 address, IPv6 address, and root password. The IPv4 address will look like four blocks of numbers separated by periods, e.g. 216.239.32.878. The IPv6 address is longer and usually separated with colons.

You can log into your server via ssh with the following command, replacing *IP* with the IPv4 address that was emailed to you:

```bash
ssh root@IP
```

When you do this, you’ll be prompted to change your password from the default password. Enter the root password you were emailed, then pick a new password. **Remember your new root password, as if you lose it, you’ll permanently lose access to this machine and you’ll have to delete it and reprovision a new one.**