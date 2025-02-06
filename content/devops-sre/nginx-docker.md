# Nginx Docker

## Creating custom images based on NGINX

To create your own Docker image, save the following text to a file called `Dockerfile`:

```dockerfile
FROM nginx
COPY index.html /usr/share/nginx/html/index.html
```

Build the new image with the command:

```bash
docker build . -t mynginx
```

This builds a new image called `mynginx`. Run the new image with the command:

```bash
docker run -p 8080:80 mynginx
```

Note that you didn't mount any directories this time. However, when you open `http://localhost:8080/index.html` your custom HTML page is displayed because it was embedded in your custom image.

## Advanced NGINX configuration

NGINX exposes its functionality via configuration files. The default NGINX image comes with a simple default configuration file designed to host static web content. This file is located at `/etc/nginx/nginx.conf` in the default image, has a following content

```Dockerfile
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```

There's no need to understand this configuration file in detail, but there is one line of interest that instructs NGINX to load additional configuration files from the `/etc/nginx/conf.d` directory:

```bash
include /etc/nginx/conf.d/*.conf;
```

The default `/etc/nginx/conf.d` file configures NGINX to function as a web server. Specifically the `location /` block loading files from `/usr/share/nginx/html` is why you mounted your HTML files to that directory previously:

```bash
server {
    listen       80;
    server_name  localhost;

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}

```

You can take advantage of the instruction to load any `*.conf` configuration files in `/etc/nginx` to customize NGINX.

In this example you add a health check via a custom location listening on port 90 that responds to requests to the `/nginx-health` path with a HTTP 200 OK.

Save the following text to a file called `health-check.conf`:

```bash
server {
    listen       90;
    server_name  localhost;

    location /nginx-health {
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

Modify the `Dockerfile` to copy the configuration file to `/etc/nginx/conf.d`:

```Dockerfile
FROM nginx
COPY index.html /usr/share/nginx/html/index.html
COPY health-check.conf /etc/nginx/conf.d/health-check.conf
```

Build the image with the command:

```bash
docker build . -t mynginx
```

Run the new image with the command. Note the new port exposed on 9090:

```bash
docker run -p 8080:80 -p 9090:90 mynginx
```

Now open `http://localhost:9090/nginx-health`. The health check response is returned to indicate that the web server is up and running.
