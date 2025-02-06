# Nginx Multi Domain

## Multiple domain and subdomain with one server

The default configuration file for Nginx is `/etc/nginx/nginx.conf`, and we’re free to add our domains to this configuration.

However, it is strongly recommended not do. The single, biggest reason not to combine all domains in one configuration is that it will become very unwieldy, and cumbersome to maintain.

Rather, it is advised to create individual configuration files for each domain, placing them in the ==`/etc/nginx/sites-available`== directory.

## Create the web root and configuration file

1. Create the root directory to host our website’s files.

   ```bash
   sudo mkdir -p /var/www/domain-one.com/public_html
   ```

   Create **index.html files** for the domains. Starting with the domain-one website, add the following command.

   ```bash
   sudo vi /var/www/domain-one.com/public_html/index.html
   ```

   The content for `index.html`

   ```html
   <html>
     <title>www.domain-two.com</title>
     <h1>Welcome to www.example1.com Website</h1>
   </html>
   ```

2. Create the Nginx configuration file under `/etc/nginx/sites-available`. For easy reference, name the configuration file after the domain name.

   ```bash
   sudo touch /etc/nginx/sites-available/domain-one.com.conf
   ```

3. Open the configuration file in a text editor.

   ```bash
   sudo vi /etc/nginx/sites-available/domain-one.com.conf
   ```

4. We set the server directive and tell Nginx that this configuration maps to all domain requests that match domain-one.com over port 80.

   ```vi
   server {
       listen 80;
       listen [::]:80;
       server_name domain-one.com www.domain-one.com;
   }
   ```

5. Nginx needs to know which directory to serve content from. We’ll also want to let Nginx know which type of files to serve by default, when no file is specified. So, let’s define those settings by adding the following lines to our configuration. Place them in between the server curl braces, underneath **server_name**

   ```vi
   root /var/www/domain-one.com/public_html;

   index index.html index.htm;
   ```

6. Finally, let’s tell Nginx to attempt to serve the request as a file. If a file doesn’t exist, attempt a directory; otherwise, show a 404 Page not found error.

   ```vi
   location / {
       try_files $uri $uri/ =404;
   }
   ```

7. The configuration file should now look similar to the following example.

   ```bash
   server {
       listen 80;
       listen [::]:80;
       server_name domain-one.com www.domain-one.com;

       root /var/www/domain-one.com/public_html;

       index index.html index.htm;

       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

8. Validate the configuration file has no syntax errors. This is good practice for doing any work on a production server, as a simple syntax error will prevent the Nginx service from starting, preventing visitors from accessing your site.

   ```bash
   sudo nginx -t -c /etc/nginx/sites-available/domain-one.com.conf
   ```

9. Provided no errors were found, enable the site. To do so we’ll need to create a symbolic link of the site configuration file in the sites-enabled directory.

   ```sudo
   sudo ln -s /etc/nginx/sites-available/domain-two.com.conf /etc/nginx/sites-enabled/domain-two.com.conf
   ```

10. Restart the Nginx service.

    ```bash
    sudo systemctl start nginx
    ```

### Our second domain will be, creatively, named domain-two.com.  Let’s begin setting it up

1. Create the directory to be used as our web root.

   ```bash
   sudo mkdir -p /var/www/domain-two.com/public_html
   ```

   Create **index.html files** for the domains. Starting with the domain-two website, add the following command.

   ```bash
   sudo vi /var/www/domain-two.com/public_html/index.html
   ```

   The content for `index.html`

   ```html
   <html>
     <title>www.domain-two.com</title>
     <h1>Welcome to www.example1.com Website</h1>
   </html>
   ```

2. Create the configuration file. As with our first domain, we’ll name it after the domain name.

   ```bash
   sudo touch /etc/nginx/sites-available/domain-two.com.conf
   ```

3. Configure the settings exactly the same as the first domain, except change the domain name and root directory.

   ```vi
   server {
       listen 80;
       listen [::]:80;
       server_name domain-two.com www.domain-two.com;

       root /var/www/domain-two.com/public_html;

       index index.html index.htm;

       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

4. Save your changes and exit the text editor.

5. Validate the configuration file, checking it for syntax errors.

   ```bash
   sudo nginx -t -c /etc/nginx/sites-available/domain-two.com
   ```

6. Provided no errors were found, enable the site. To do so we’ll need to create a symbolic link of the site configuration file in the sites-enabled directory.

   ```bash
   sudo ln -s /etc/nginx/sites-available/domain-two.com.conf /etc/nginx/sites-enabled/domain-two.com.conf
   ```

7. Start or restart Nginx.

   ```bash
   sudo systemctl start nginx
   ```

8. Test your configuration

## Multiple domain

First, we need to create two server blocks, one for each domain, as shown below. Here, our first domain is named example1.com, and the second one is example2.com. We need to specify the directory from which the content is passing and the file type. For that purpose, we need to add that details in our configuration like below.

```vi
server {
    listen 80;
       root /var/www/html/example1.com;
       index index.html;
       server_name example1.com;
       location / {
           try_files $uri $uri/ =404;
       }
}

server {
   listen 80;
   root /var/www/html/example2.com;
   index index.html;
   server_name example2.com;
   location / {
       try_files $uri $uri/ =404;
   }
}
```

Restart the NGINX server to apply changes.

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## For subdomain

Create a server block like this

```vi
server {
    server_name example.com;
    # the rest of the config
}

server {
    server_name sub1.example.com;
    # sub1 config
}

server {
    server_name sub2.example.com;
    # sub2 config
}
```

## Configured with `certbot`

Add the following configuration for common_config_file:

```vi
# Default server configuration
server {
    listen 80;
    listen [::]:80;

    index index.php index.html index.htm;

    server_name _;

    location / {
            # as directory, then fall back to displaying a 404.
            try_files $uri $uri/ =404;
    }
}


server {

    index index.html;
    server_name ikrypted.in www.ikrypted.in; # managed by Certbot

    location / {
        # First attempt to serve request as file, then
        try_files $uri $uri/ /index.html;
    }

    ssl_certificate /etc/letsencrypt/live/ikrypted.in/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/ikrypted.in/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.ikrypted.in) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = ikrypted.in) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80 ;
    listen [::]:80 ;
    server_name ikrypted.in www.ikrypted.in;
    return 404; # managed by Certbot
}

server {
     root /var/www/html;
    index index.php index.html index.htm;
    server_name www.govinshinde.tech govinshinde.tech; # managed by Certbot

    location / {
        # First attempt to serve request as file, then
        try_files $uri $uri/ /index.html;
    }

    listen [::]:443 ssl; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/govinshinde.tech/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/govinshinde.tech/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
server {
    if ($host = www.govinshinde.tech) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = govinshinde.tech) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80 ;
    listen [::]:80 ;
    server_name www.govinshinde.tech govinshinde.tech;
    return 404; # managed by Certbot
}
```

Add the following configuration for default:

```vi
# Default server configuration
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Redirect all HTTP traffic to HTTPS
    return 301 https://$host$request_uri;
}

# Configuration for govinshinde.tech
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name govinshinde.tech www.govinshinde.tech;

    ssl_certificate /etc/letsencrypt/live/govinshinde.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/govinshinde.tech/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/wordpress;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Configuration for ikrypted.in
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ikrypted.in www.ikrypted.in;

    ssl_certificate /etc/letsencrypt/live/ikrypted.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ikrypted.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/html/ikrypted.in;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
