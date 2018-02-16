const Generator = require("yeoman-generator");
const uuidv4 = require('uuid/v4');

module.exports = class extends Generator {
    constructor(args, options) {
        super(args, options);
    }
    method1() {
        const done = this.async();

        this._promptContentTypeData()
            .then(this._addContentTypeId)
            .then(contentType => {
                console.log('Creating contenttype markup file');
                this.fs.copyTpl(
                    this.templatePath('contenttype.xml'),
                    this.destinationPath(`${contentType.name}.contenttype.xml`),
                    contentType
                );
            })
            .catch(err => {
                console.error(err);
            });
            done()
    }
    _promptContentTypeData() {
        return this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'ContentType name'
            },
            {
                type: 'input',
                name: 'description',
                message: 'ContentType description'
            },
            {
                type: 'input',
                name: 'group',
                message: 'ContentType group'
            },
            {
                type: 'list',
                name: 'parent',
                message: 'Select parent content type',
                choices: [
                    'Element',
                    'Document',
                    'Folder'
                ]
            }
        ]);
    }
    _addContentTypeId(contentType) {
        let prefix = '';
        switch (contentType.parent) {
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
        return Object.assign({}, contentType, { id: `${prefix}00${uuidv4().replace(/-/g, '').toUpperCase()}` });
    }
}