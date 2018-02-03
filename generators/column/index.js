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
                name: 'displayName',
                message: 'Fieldname display'
            },
            {
                type: 'input',
                name: 'fieldName',
                message: 'Fieldname internal'
            },
            {
                type: 'input',
                name: 'fieldGroup',
                message: 'Field group'
            },
            {
                type: 'list',
                name: 'fieldType',
                message: 'Select field type',
                choices: [
                    'Text',
                    'URL',
                    'User',
                    'Note',
                    'UserMulti',
                    'Choice',
                    'MultiChoice'
                ]
            }
        ]).then(results => {
            this.generatorConfig = Object.assign({}, results, {
                id: this._getFieldID(results.parentContentType)
            });

            if (this.generatorConfig.fieldType === 'Choice' || this.generatorConfig.fieldType ===  'MultiChoice') {
                this._getChoices();
            } else {
                this._createFromTemplate('column.default.xml')
            }
            done();
        })
    }
    _getChoices() {
        const done = this.async();

        this.prompt([
            {
                type: 'input',
                name: 'choices',
                message: 'Selectable choices (comma-separated)'
            }
        ]).then(result => {
            this.generatorConfig = Object.assign({}, this.generatorConfig, {
                choices: result.choices.split(',')
            });
            this._createFromTemplate('column.choice.xml')
            done();
        });
    }
    _createFromTemplate(template) {
        this.fs.copyTpl(
            this.templatePath(template),
            this.destinationPath(`${this.generatorConfig.fieldName}.column.xml`),
            this.generatorConfig
        );
    }
    _getFieldID() {
        return uuidv4().toUpperCase();
    }
}