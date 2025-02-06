# Self-hosting Advice

**How risky is it to expose a computer on your network to the internet, if you're somewhat tech-savvy but not very familiar with networking?**

First step to figure out if you actually need to be able to access it from the outside at all. If you just want a NAS, chances are you can put it on a separate VLAN/network that is only accessible within your LAN, so it wouldn't even be accessible from the outside.

If you really need it to be accessible from the outside, make sure you start with everything locked down/not accessible at all from the beginning, then step-by-step open up exactly what you want, and nothing else. Make sure the endpoints accessible is run by software you keep up to date, at least weekly if not daily.

A god option is to setup a wireguard connection between workstation and servers. All traffic has to go through wireguard.

Because wireguard is UDP and only responds to valid requests, there isn't any open port from the outside. Not even ssh.

You'll want to make sure everything stays up to date in case someone finds a vulnerability in whatever software you're currently using. If you have to expose stuff to the outside world, only open the ports you need to. Only allow access to a specific user with a non-default username (or at the very least disable root ssh access), and use long passwords or ssh keys. I think that's generally the bare minimum, but there are online guides to harden your stuff further like using wireguard and fail2ban and stuff
