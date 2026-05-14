import '../scss/app.scss';

document.addEventListener('DOMContentLoaded', () => {
    const url = `https://edfenergytest.learning.peoplefluent.net/ekp/api/learningPath?format=json`;
    const username = import.meta.env.username;
    const password = import.meta.env.password;
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));

    fetch(url, {
        headers,
        mode: 'no-cors',
    })
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.log('Something went wrong.', err);
    });

});