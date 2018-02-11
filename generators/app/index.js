const Generator = require("yeoman-generator");

module.exports = class extends Generator {
    constructor(args, options) {
        super(args, options);
        this.operation = '';
    }
    method1() {
        const done = this.async();

        this.prompt([
            {
                type: 'list',
                name: 'operation',
                message: 'Select operation',
                choices: [
                    'Create Column',
                    'Create ContentType'
                ]
            }
        ]).then(result => {
            this.operation = result.operation;
            done();
        })
    }
    method2() {
        switch(this.operation) {
            case 'Create ContentType':
                this.composeWith('sp_assets:contenttype', {});
                break;
            case 'Create Column':
                this.composeWith('sp_assets:column', {});
                break;
            default:
                this.log('Not yet implemented');
                break;
        }
    }
}