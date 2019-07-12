# return all records
db.orders.find().pretty();


# find with where condition
db.orders.find( { date:  { $lt: }});

# remove all records
db.orders.deleteMany({});
