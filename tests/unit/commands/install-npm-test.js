'use strict';

const expect = require('chai').expect;
const MockProject = require('../../helpers/mock-project');
const commandOptions = require('../../factories/command-options');
const InstallNpmCommand = require('../../../lib/commands/install-npm');

describe('install:npm command', function() {
  let command;

  let msg =
      'This command has been removed. Please use `npm install ' +
      '<packageName> --save-dev --save-exact` instead.';

  beforeEach(function() {
    let project = new MockProject();

    project.isEmberCLIProject = function() {
      return true;
    };

    let options = commandOptions({
      project,
    });

    command = new InstallNpmCommand(options);
  });

  it('throws a friendly silent error with args', function() {
    return command.validateAndRun(['moment', 'lodash']).then(function() {
      expect(false, 'should reject with error').to.be.ok;
    }).catch(function(error) {
      expect(error.message).to.equal(
        msg, 'expect error to have a helpful message'
      );
    });
  });

  it('throws a friendly silent error without args', function() {
    return command.validateAndRun([]).then(function() {
      expect(false, 'should reject with error').to.be.ok;
    }).catch(function(error) {
      expect(error.message).to.equal(
        msg, 'expect error to have a helpful message'
      );
    });
  });
});
