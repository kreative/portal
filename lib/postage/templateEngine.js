const fs = require('fs');
const axios = require('axios');

class TemplateEngine {

    constructor(templatesUrl) {
        this.templatesUrl = templatesUrl;
    }

    async loadTemplate(templateName, variables) {
        const fileUrl = `${this.templatesUrl}/${templateName}.html`;

        axios.get(fileUrl)
        .catch(error => {
            console.log(error);
        })
        .then(response => {
            console.log(response.data);
        })

        // const html = fs.readFileSync(file);
        // const sections = html.splice("$$$");
        // let completedHTML = "";
        //
        // for (let i = 0; i < variables.length; i++) {
        //     completedHTML += sections[i] + variables[i];
        // }
        //
        // completedHTML += sections[variables.length + 1];
        // return completedHTML;
    }
}

module.exports = TemplateEngine;