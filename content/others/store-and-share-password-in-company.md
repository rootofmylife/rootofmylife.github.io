# Store and Share Password in Company

## 1

Using cloud version of 1Password, which is easy to audit and manage access for.

Remember, as you give people access to passwords, that those passwords will need to be rotated when those people change to incompatible roles or depart the company. If passwords aren't a total pain in the ass for you, you're probably doing something wrong.

## 2

Don't. Give them access to all systems they need with their own user/password. That way you can revoke them (if/when necessary) without disrupting everyone else.

Also automate as much as is reasonable, e.g. github access to push code to a dev branch, then enqueue merging of it. But a CI/CD pipeline does the actual deploy, the employee doesn't need to access any of the production systems. A very small number still will, but that's a much better situation.

Give the employee 1Password to manage their own passwords.

## 3

**What are the recommended ways to store and give access to passwords?**
Whenever possible, don't. Otherwise, it depends on the scale and security you need. A password manager is one possible solution. Another solution is something like Hashicorp's Vault or OpenBao.

**How can a new hire be given access to all required passwords day 1?**
They should access it through their SSO account, and not need a billion passwords across systems.

**And when such new hire gets promoted, how can we give access to the additional passwords they will need?**
Again, whenever possible, tie access to their SSO account.

## 4

SSO all the way (if you can). Chances are you've got Google Workspace or Microsoft 365 - both allow you to configure SAML based SSO into many SaaS apps either through their respective app galleries or some kind of custom configuration. Otherwise you could look at Okta, but be prepared to fork out serious cash. We use Entra ID (part of Microsoft 365) for SSO in our business, and it generally works well.

There'll be times that employees can't use SSO though. For that I'll add my voice to 1Password - it's well designed such that a breach of the 1PW service itself won't reveal credentials (you'd need peoples vault passwords and secret keys for that). Avoid Lastpass - the UI is awful, and they've been breached in the past.

## 5

We also use opal for dynamic access to things like AWS or our DB service where a temp user with a specific IAM role / temp db user / pass is created for that user's session. For higher level access, someone would approve the request before credentials are generated.

[https://opal.dev/](https://opal.dev/)

## 6

Most environments I have worked with struggle with sharing passwords like OP and it’s a massive pain. One time, dev team was sharing active directory credentials to access service. At some point service account gets locked because someone was using an older password of the account.

Usually a quick problem to solve with 2-3 people in same region (or prevented entirely), but teams across time zones and countries (US vs Vietnam or India). It becomes painful. Doesn’t matter if they are “senior” or green/“junior” engineers.

If I ever have my own company, I want my own internal IdP (identity provider) and all internal and external services integrated with it. Employees issued (multiple) physical hardware keys. This is required to authenticate with work computer and subsequent access to VPN/tail scale.

Individual services and products must support oauth.

Access to public cloud resources? AuthN through company IdP. Admin creates roles for you to access resources necessary for work

Access to database? No shared passwords. get admin to add authorization, then authN via IdP and get access token

Version control? Same as above.

E-mail? Same as above.

Company document repository? AuthN through IdP which requires physical security key.

Access to company laptop/desktop? Plug-in security key. Permissions/roles managed remotely (give bob sys access for dev work but jenny from HR is given very basic system access).

Then once you are done, then remove security key and all established sessions are removed and logged out of computer (or just locked).

Employee leaves? Just disable the account. Maybe leave a small window of access to certain services (ie, email) so they could say their goodbyes, turn in company equipment. Then revoke access completely.

Hostile or state actor obtained security key of active employee? From IdP, mass revoke all access. Can also track what actor accessed as well.

## 7

Most services are connected through SSO, so those won't have passwords and are automatically shut down when the user leaves the company.

All employees also have a 1password account for which we can store individual passwords for the services that are not connected through SSO.

For some services we only have a single token/service account which we need to share within the team. Often they were stored in a `.env` file, but that tend to be a burden for onboarding and quite a bit of maintenance for each individual.

Within my current team we share them using direnv and [https://github.com/tmatilai/direnv-1password](https://github.com/tmatilai/direnv-1password). Secrets are loaded as environment variables whenever the dev enters the projects directory. They are loaded from 1password which is unlocked using fingerprint scanner. This way the secrets are not actually stored on disk.

People leaving the team does still require manual password rotation, but at least not everyone in the team needs to update their `.env` file this way.

## 8

What I describe is more or less what has been the standard at the companies I worked for, no secret sauce here, and I added some extra processes to address the questions you asked.

Get a password manager service (none of the keepass file thrown onto Google Drive), we used 1password, it's good enough I assume. Keep related items in one collection, don't mix unrelated items. Always save passwords in the pw manager, and make sure everyone does that, too. When someone joins, give them access to what makes sense. If someone gets promoted, add them to a new collection. Document who is allowed access to each collection if necessary. When someone leaves, kick them out of the password manager service first, then in a timely fashion, change the passwords (I don't know if you can do it automatically, but if churn isn't too bad, you can also do it manually). Save the new passwords in your passwords manager. As everyone uses the password manager, they will automatically get the new passwords without them even realizing it changed.

Some extra that's also important: if possible, use SSO and everyone uses their own account, eg Okta. Create and share passwords only if needed. When one off accounts are needed, make sure they are created with company email addresses, ideally named after a team rather an individual.

## 9

I have Bitwarden Enterprise deployed and authenticate via our IDP. It's been working well for us, each team has their own collection that they manage. From an IT admin perspective, it's pretty hands off. Any changes to password are automatically synced between users.

## 10

1. SSO everywhere. Okta if budget is no concern and Keycloak if it is.

2. Password manager for the entire company. Even if it's possible to go SSO everywhere, there are still secrets employees will need to manage. Give them a solution or they'll solve it on their own and not in a good way. I like 1Password.

3. All services use a secret solution that can broker short lived secrets and a policy that limits secret TTL to a day or less. I like HashiCorp Vault.

## 11

Best to use SSO for SaaS passwords. This is where your whole team has a Microsoft or Google (or other identity provider) login administered centrally by the company that is further used to authenticate to various services.

As opposed to "login with Facebook etc." logins that are individually administered by each end user for each app.

This is low fruit for many things but often companies require you to be on an expensive SaaS pricing tier to use SSO on their product.

Next problem to solve is Software Engineer's cloud secrets. Use key vaults in your cloud for this. Use SSO to authenticate your team to that cloud.

Enable 2fa as much as possible. TOTP not SMS.

Finally you will need people to save passwords for some stuff. 1Password or Bitwarden etc.

Avoid shared passwords. Sometimes unavoidable in which case rotate them often and when people leave too.

## 12

I work for a financial, we take security seriously. Production secrets like passwords, private keys etc are stored in Hashicorp Vault. They aren't stored on disk anywhere else. Privileged system account that runs the production processes can't be used by interactive users. SREs can get access if they have to but its locked down and every session is recorded. The secrets are rotated regularly. So your new hire never gets to see production passwords effective.

For developers, everything is done in their individual accounts, no system accounts. There is a dev system account that does leak out some times but this is frowned upon. Production data that is synced to dev environments have to be scrambled so devs dont get to see all the real prod data.
