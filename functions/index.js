

'use strict';

 const functions = require('firebase-functions');
 const fetch = require('node-fetch');
 
 const admin = require('firebase-admin');
 admin.initializeApp();



exports.Prediction = functions.https.onRequest(async (req, res) => {
    const input = req.query.text;
    const id = input;

    const docRef = admin.firestore().collection("predictionsCollection").doc("predictionsDocument");
    const docSnapshot = await docRef.get();
    const value = docSnapshot.data()[id];

    if (value){        // prediction for this input exists
        res.send(value);
    } else {          // prediction for this input no exists

        var data = {
            text: input
        };

        const response = await fetch('https://pl-core-news-sm-qw4epicmqa-ew.a.run.app/predict/', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body : JSON.stringify(data)
        });

        const myJson = await response.json();
        const docRef = admin.firestore().collection("predictionsCollection").doc("predictionsDocument");
        const updateObj = {};
        updateObj[id] = myJson
        docRef.update(updateObj);
            
        res.send(myJson);
    }

  });



 