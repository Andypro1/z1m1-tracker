# z1m1-tracker
 Zelda Metroid Crossover Randomizer web tracker for solo or coop tracking

# coop-wss-server.js

 Found in /src/server/coop-wss-server.js (or coop-server.js if you don't want to use encryption).

 Notes on how to host this hands-off:

 Install certbot for your distro
 npm install pm2@latest -g
 
 Set up coop-wss-server.js as a pm2 process (see pm2 docs; it's easy to do)

 Make a crontab entry for the user that runs pm2 (ap, in the example below):

 30 6 * * * certbot renew --deploy-hook "chown ap:ap /etc/letsencrypt/live/terraria.andypro.net/fullchain.pem; chown ap:ap /etc/letsencrypt/live/terraria.andypro.net/privkey.pem; /usr/local/lib/nodejs/node-v14.17.3-linux-x64/bin/pm2 reload z1m1-wss-server" --config-dir /home/ap/.certbot/config --logs-dir /home/ap/.certbot/logs --work-dir /home/ap/.certbot/work

 The above will ask certbot to renew the TLS cert when it's close to expiry.  If it renews, it will then run the deploy-hook which will chown the files to your specified user and then tell pm2 to restart the process which will then pick up the new certificate files.