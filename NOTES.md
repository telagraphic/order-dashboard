# Status Codes


## Pageflex
- Item Status:Unreviewed || Pending Review && Date/Time Created > 5 Days from today

RED
- Declined
- Rejected
- Canceled

YELLOW
- Pending Review

GREEN
- In Process

WHITE
- Completed

## Skyportal

RED
- Cancelled

YELLOW
- Unapproved
- Not Paid

ORANGE
- Order Received

GREEN
- Press

WHITE
- Order Complete

## Vision

- All Types
- All Due (Late)
- Due Today
- Due Tomorrow
- Due This Week
- Due Next Week

- Past Due
- Pickup Ready
- Hold
- Firm Wanted By Date


# Build Scripts

This sets up a static file server:
```
  "public:serve": "browser-sync start --server --ss 'public' --files 'public/scss/**/*.scss, public/*.html'"
```

Static server from public:
```
  "public:serve": "browser-sync start --server --ss 'public/pages' --files 'public/scss/**/*.scss, public/pages/*.html'"
```

Nodemon & Browser-Sync:

```
  "public:serve": "browser-sync start --proxy 'localhost:3000' --files 'public/scss/**/*.scss, public/views/**/*.hbs'"
```

# BROWSER-SYNC

- [Express & Browser-Sync](https://www.npmjs.com/package/connect-browser-sync)
- [Browser-Sync Options](https://browsersync.io/docs/command-line)

# MONGODB

- [Mongo & Homebrew](https://superuser.com/questions/1478156/error-mongodb-unknown-version-mountain-lion)
- [How Find Works](http://thecodebarbarian.com/how-find-works-in-mongoose.html)

# AGENDA

- [Agenda Setup](https://techdai.info/agenda-and-agendash-for-scheduling-in-node-js-with-mongodb/)
- [Agenda Async/Await](https://thecodebarbarian.com/node.js-task-scheduling-with-agenda-and-mongodb)


# EXPRESS

- [Express Router](https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4)
- [PM2](https://www.digitalocean.com/community/tutorials/nodejs-pm2)
- [PM2 Commands](https://hackernoon.com/pm2-to-setup-a-nodejs-application-i3w32zg)

# PUPPETEER

[Headless Timeout Errors?](https://github.com/puppeteer/puppeteer/issues/2963)


# TODO

- Display status icon based on date/status for each service
- Set header and table header to be static on scroll
- Finish Agenda code to run jobs
-


# Mongo CLI

connecting to
```
mongodb://127.0.0.1:27017
```

create database
```
use dbname
```

show databases
```
show dbs
```

return all records
```
db.orders.find().pretty();
```

return database record count
```
db.orders.count();
```


find with where condition
```
db.orders.find( { date:  { $lt: }});
```

remove all records
```
db.orders.deleteMany({});
```

mongoexport
```
mongoexport --host localhost --db pageflex-orders --collection orders --csv --out text.csv --fields firstName,middleName,lastName
mongoexport --host mongodb://127.0.0.1:27017 --db pageflex-orders --collection orders --csv --out orders.csv --fields id,client,date,itemStatus,orderStatus,time,user
```
