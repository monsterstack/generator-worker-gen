'use strict';
let Generator = require('yeoman-generator');
let chalk = require('chalk');
let yosay = require('yosay');
let mkdirp = require('mkdirp');
let _ = require('lodash');

let userConfigs;

module.exports = Generator.extend({

  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the striking ' + chalk.red('worker-gen') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'serviceName',
        message: 'What\'s the NAME of the worker that you want to create right now?',
        store: false
      },
      {
        type: 'input',
        name: 'serviceDescription',
        message: 'What\'s the DESCRIPTION of the worker that you want to create right now?',
        store: false
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
      userConfigs = props;
    }.bind(this));
  },

  writing: function () {

    let serviceNameValid = userConfigs.serviceName.replace(/\W+/g,"");
    let serviceRootPath = '../outputs/' + serviceNameValid;

    mkdirp.sync(serviceRootPath);
    mkdirp.sync(serviceRootPath + '/config');
    mkdirp.sync(serviceRootPath + '/libs');


    //rootPath
    this.fs.copyTpl(//template
      this.templatePath('announcement.json'),
      this.destinationPath(serviceRootPath+'/announcement.json'),
      {
        serviceName: userConfigs.serviceName
      }
    );
    this.fs.copy(
      this.templatePath('typeQuery.json'),
      this.destinationPath(serviceRootPath+'/typeQuery.json')
    );
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath(serviceRootPath+'/package.json'),
      {
        serviceName: userConfigs.serviceName,
        serviceDescription: userConfigs.serviceDescription
      }
    );
    this.fs.copy(
      this.templatePath('README.md'),
      this.destinationPath(serviceRootPath+'/README.md')
    );
    this.fs.copy(
      this.templatePath('worker.js'),
      this.destinationPath(serviceRootPath+'/worker.js')
    );

    //config
    this.fs.copy(
      this.templatePath('default.json'),
      this.destinationPath(serviceRootPath+'/config/default.json')
    );

  },

  install: function () {
    this.installDependencies();
  }
});
