var mongoose = require('mongoose');

mongoose.connect(
    (process.env.PRODUCTION === 'true' ? process.env.PRODUCTION_URL : process.env.MONGODB_URL), {useNewUrlParser : true},(err) =>{
        if (err) {
            console.log(err);
            //process.exit(1);
        } else if(process.env.PRODUCTION === 'false'){
            console.log('Database ready to use.',process.env.PRODUCTION == 'true' ? process.env.PRODUCTION_URL : process.env.MONGODB_URL);
        }else {
            console.log('Database ready to use.')
        }
});