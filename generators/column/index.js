const Generator = require("yeoman-generator");
const uuidv4 = require('uuid/v4');

module.exports = class extends Generator {
    constructor(args, options) {
        super(args, options);
    }
    method1() {
        const done = this.async();
        this._promptColumnData()
            .then(results => Object.assign({}, { id: uuidv4().toUpperCase() }, results))
            .then(column => {
                console.log('Defining column template');
                const template = (column.type === 'Choice' || column.type === 'MultiChoice') ? 'column.choice.xml' : 'column.default.xml';
                return Object.assign({}, column, { template });
            })
            .then(column => {
                if ((column.type === 'Choice' || column.type === 'MultiChoice')) {
                    return this._promptChoices(column);
                }
                return column;
            })
            // Copy template with provided data
            .then(column => {
                console.log('Creating column markup file');
                this.fs.copyTpl(
                    this.templatePath(column.template),
                    this.destinationPath(`${column.internalName}.column.xml`),
                    column
                );
            })
            .catch(err => {
                console.error(err);
            });
            done()
    }
    _promptColumnData() {
        return this.prompt([
            {
                type: 'input',
                name: 'displayName',
                message: 'Set the columns display name'
            },
            {
                type: 'input',
                name: 'internalName',
                message: 'Set the columns internal name'
            },
            {
                type: 'list',
                name: 'type',
                message: 'Set the columns type',
                choices: [
                    'Text',
                    'URL',
                    'User',
                    'Note',
                    'UserMulti',
                    'Choice',
                    'MultiChoice'
                ]
            },
            {
                type: 'input',
                name: 'group',
                message: 'Set the columns group name'
            },
            {
                type: 'confirm',
                name: 'hidden',
                message: 'Is this column hidden?',
            },
            {
                type: 'confirm',
                name: 'required',
                message: 'Is this column required?'
            },
        ]);
    }
    _promptChoices(column) {
        return this.prompt([
            {
                type: 'input',
                name: 'choices',
                message: 'Selectable choices (comma-separated)'
            }
        ])
        .then(results => {
            return Object.assign({}, column, { choices: results.choices.split(',') });
        });
    }
}