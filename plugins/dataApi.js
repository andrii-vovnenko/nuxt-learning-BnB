export default function(ctx, inject) {
    const APP_ID = 'I126SVACJ8';
    const API_KEY = 'acef1cc6627095b7f168b481258d78af';

    inject('dataApi', { getHome });

    async function getHome(homeId) {
        const response = await fetch(`https://${APP_ID}-dsn.algolia.net/1/indexes/homes/${homeId}`, {
            headers: {
              'X-Algolia-API-Key': API_KEY,
              'X-Algolia-Application-Id': APP_ID,
            },
        });
        console.log(response);
        const data = await response.json();
        return data;
    }
};