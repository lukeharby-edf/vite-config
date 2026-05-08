import '../scss/app.scss';

document.addEventListener('DOMContentLoaded', () => {
    console.log('sparkline is here');

    const baseURL = 'https://api.com/v2';
    const path = 'endpoint';
    const apiURL = `${baseURL}/${path}`;

    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const filteredArr = arr.map(item => item >= 4);

    const mappedArr = arr.map(item => item * 2);

    console.log(apiURL);
    console.log(filteredArr);
    console.log(mappedArr);

});