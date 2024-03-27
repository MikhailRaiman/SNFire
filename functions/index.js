const { onRequest } = require("firebase-functions/v2/https");
const express = require('express');
const app = express();
const { firebaseConfig } = require("./environment");

const admin = require('firebase-admin');
admin.initializeApp(firebaseConfig);

const db = admin.firestore();

app.post('/', (req, res) => {
    const data = req.body;
    const docRef = db.collection(data.table).doc(data.recordId);

    docRef.set(data.data)
        .then(() => {
            res.status(200).send('Data updated successfully');
        })
        .catch((error) => {
            console.error(error);
            res.status(200).send('Error updating data: ' + data);
        });
});

app.get('/', (req, res) => {
    const table = req.query.table;

    var stuff = [];
    db.collection(table).get().then(snapshot => {
        snapshot.forEach(doc => {
            const newdoc = {
                id: doc.id,
                data: doc.data()
            }
            stuff.push(newdoc);
        });

        res.status(200).send(stuff);
    });


});

exports.updateData = onRequest(app);

