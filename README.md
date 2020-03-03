# MONGO

# connecting to: mongodb://127.0.0.1:27017

# create database
use dbname

# show databases
show dbs

# return all records
db.orders.find().pretty();

# return database record count
db.orders.count();

# find with where condition
db.orders.find( { date:  { $lt: }});

# remove all records
db.orders.deleteMany({});


# mongoexport
mongoexport --host localhost --db pageflex-orders --collection orders --csv --out text.csv --fields firstName,middleName,lastName
mongoexport --host mongodb://127.0.0.1:27017 --db pageflex-orders --collection orders --csv --out orders.csv --fields id,client,date,itemStatus,orderStatus,time,user
