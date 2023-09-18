const Clarifai = require ('clarifai');

const app = new Clarifai.App({
 apiKey: 'efab85dd1afc42c2925f65da4e3197f0'
});

const handleApiCall = (req, res) =>{
    app.model.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}


const handleImage = (req, res, db) => {
    const {id} = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then( entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
    handleImage : handleImage,
    handleApiCall: handleApiCall
};