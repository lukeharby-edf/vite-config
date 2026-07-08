# Serve fonts with CORS and long cache time

location ~\* \.(?:ttf|ttc|otf|eot|woff|woff2|map)$ {
add_header Access-Control-Allow-Origin "https://slack-wise.tumblr.com" always;
add_header Access-Control-Allow-Methods "GET, OPTIONS, HEAD" always;
add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
add_header Access-Control-Allow-Credentials "true" always;
add_header Access-Control-Expose-Headers "Content-Type, Cache-Control" always;

    expires 365d;
    add_header Cache-Control "public, max-age=31536000" always;

    access_log off;
    # serve static files from the root (adjust root/proxy settings as needed)
    try_files $uri =404;

}

# Optionally handle CORS preflight globally

location / {
if ($request_method = 'OPTIONS') {
add_header Access-Control-Allow-Origin "https://slack-wise.tumblr.com" always;
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS, HEAD" always;
add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
add_header Access-Control-Allow-Credentials "true" always;
add_header Access-Control-Expose-Headers "Content-Type, Cache-Control" always;
return 204;
}

    # existing proxy_pass or try_files here

}
