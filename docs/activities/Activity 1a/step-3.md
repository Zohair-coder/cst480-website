---
title: Step 3. Configure your DNS records
sidebar_position: 4
---

# Configure your DNS records

Domain name system (DNS) records associate domain names with server IP addresses. A machine’s IP address uniquely identifies it on a network. Since we provisioned servers with public IPv4 and IPv6 addresses, those addresses uniquely identify our server on the public Internet. We’ll set DNS records for our domain that will redirect requests to our domain to our server, allowing us to run a web server on our server that users can see by visiting our domain.

> You can also have private IP addresses that uniquely identify a machine on a private network. Larger companies (like Drexel) will often do this for their private Wi-Fi networks. Each local computer connected to the network gets its IP address, but all HTTP requests to websites will go through the network’s router, so the websites you visit while on the network will only see the router’s IP, and all users on the same Wi-Fi network will appear to have the same IP address. The local IP addresses are assigned by the router and aren’t public, so you can’t host a website using those IP addresses — you have to purchase a public IP address as we did.

Visit your domain name registrar’s site. Find where you can edit DNS records for your domain (instructions for Porkbun are [here](https://kb.porkbun.com/article/68-how-to-edit-dns-records)).

Depending on your DNR’s UI, you may need to create each record one at a time by submitting a form. The form will usually have the fields “type”, “host”, and “answer”. Create each of the following DNS records:

| Type   | Host                          | Answer                   | What it does                                                                                   |
|--------|-------------------------------|--------------------------|-------------------------------------------------------------------------------------------------|
| `A`    | *Leave blank to use your domain name* | *Your server’s IPv4 address* | Will tell DNS to route requests to your domain to your server                                      |
| `AAAA` | *Leave blank to use your domain name* | *Your server’s IPv6 address* | Will tell DNS to route requests to your domain to your server                                      |
| `CNAME`| `www`                         | *Your domain name*       | Sets your canonical domain name — any DNS requests for www.DOMAIN will be replaced with a DNS request for DOMAIN; see [here](https://www.cloudflare.com/learning/dns/dns-records/dns-cname-record) and [here](https://serverfault.com/a/145782) for more information |
| `TXT`  | `_dmarc`                      | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s` | Tells other servers your server doesn’t send email, so if an email spammer sends emails pretending to be from your server’s IP, it’ll make it easier for other email servers to know it’s spam; not necessary for running your site, but a nice “good internet citizen” thing to do |
| `TXT`  | `*._domainkey`                | `v=DKIM1; p=`           | Same as above                                                                                  |
| `TXT`  | *Your domain name*            | `v=spf1 -all`           | Same as above                                                                                  |

When typing your domain, you’ll type your second level domain and top level domain, e.g. `google.com`.

## Propagation

It can take up to 48 hours for DNS records to propagate. Additionally, DNS records are cached very aggressively, so if you later change your DNS records, you may find that if you try visiting your domain after you change your records, it’ll use the cached records instead of the new ones. In this case, you may need to clear your browser’s cache or wait 48 hours for them to propagate.

You can visit your domain in your browser, but because we’re not running a web server on our server, you’ll just get a network error. We can now set up a static web server.