let responseData;
const staffRolesApi = '/api/SelfRoleStatusReport.csv';
const learningPathApi = '/api/learningPath.xml';

const initApi = async () => {
        fetch(staffRolesApi, {
            headers: {
                'content-type': 'text/csv;charset=UTF-8'
            }
        })
        .then(response => response.text())
        .then(data => {
            responseData = data;
            apiCallback();

        })
        .catch((error) => console.error('Error:', error));
};

const csvToJSON = (csv) => {
    const lines = csv.split('\n');
    const result = [];
    let headers;
    // replace any spaces and hyphens with underscores and lower case text
    headers = lines[0].toLowerCase().replace(/ |-/g,'_');
    headers = headers.replace(/"/g, '');
    
    headers = headers.split(',');

    for (let i = 1; i < lines.length; i++) {
        let obj = {};

        if(lines[i] == undefined || lines[i].trim() == '') {
            continue;
        }

        const words = lines[i].split(',');
        for(let j = 0; j < words.length; j++) {
            // replace additional quute marks around strings
            obj[headers[j].trim()] = words[j].replace(/"/g, '');
        }
        

        result.push(obj);
    }

    return result;
}

const apiCallback = () => {
    if (responseData) {
        responseData = csvToJSON(responseData);
        let newResultObject = {};

        responseData = responseData.map((item, index) => {
            return {
                id: item.job_role_reference_code,
                name: item.job_role_name,
                status: item.assignment_type_display_name
            }
        });

        console.log(responseData);
        appendDom();
    }
}

const appendDom = () => {
    const wrapper = document.querySelector('.wrapper');
    responseData.forEach(item => {
        const template = `<li>${item.id}. ${item.name}. ${item.status}</li>`;
        wrapper.insertAdjacentHTML('beforeend', template);
    });
}

initApi();