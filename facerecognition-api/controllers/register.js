const handleRegister = (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;
    if (!email || !name || !password) {
       return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    //Knex transaction is used when you want to make mor that one chance in many tables to keep it consistent. trx will be the all the chages packed as one
    //so either all gets thru or all fails and all table are kept consistent
    db.transaction(trx => {
        trx.insert ({
            hash:hash,
            email:email
        })
        .into('login') // does a insert into table 'login'
        //.returning('email') // gets the email to use it for the next step
        .then(() =>{
            return trx('users') //trx instead of db to make it part of the transaction.
                .returning('*')
                .insert({
                    email: email,//loginEmail is being passed down as an array of one element, so [0]
                    name: name,
                    joined: new Date()
                })
                .then(user =>{
                    res.json(user[0]);
                })
        })
        .then(trx.commit) // to commit the transaction and make the changes to the data base
        .catch(trx.rollback)
    })        
    .catch(err => {            
        res.status(400).json('unable to register');
    })
}

module.exports = {
    handleRegister: handleRegister
};