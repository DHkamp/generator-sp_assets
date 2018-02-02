const Generator = require("yeoman-generator");
const uuidv4 = require('uuid/v4');

module.exports = class extends Generator {
    constructor(args, options) {
        super(args, options);

        this.generatorConfig = { };
    }
    method1() {
        const done = this.async();

        this.prompt([
            {
                type: 'input',
                name: 'contentTypeName',
                message: 'ContentType name'
            },
            {
                type: 'input',
                name: 'contentTypeDescription',
                message: 'ContentType description'
            },
            {
                type: 'input',
                name: 'contentTypeGroup',
                message: 'ContentType group'
            },
            {
                type: 'list',
                name: 'parentContentType',
                message: 'Select parent content type',
                choices: [
                    'Element',
                    'Document',
                    'Folder'
                ]
            }
        ]).then(results => {
            this.generatorConfig = Object.assign({}, results, {
                id: this._getContentTypeID(results.parentContentType)
            });
            done();
        })
    }
    method2() {
        this.fs.copyTpl(
            this.templatePath('elements.xml'),
            this.destinationPath(`${this.generatorConfig.contentTypeName}.elements.xml`),
            this.generatorConfig
        );
    }
    _getContentTypeID(parent) {
        let prefix = '';
        switch(parent) {
            case 'Element':
                prefix = '0x01';
                break;
            case 'Document':
                prefix = '0x0101';
                break;
            case 'Folder':
                prefix = '0x0120'
                break;
        }
        return `${prefix}00${uuidv4().replace(/-/g, '').toUpperCase()}`;
    }
}