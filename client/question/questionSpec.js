// Copyright 2017 The TIE Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Unit tests for question.js file
 */
describe('question.js', function() {
  var WRONG_LANGUAGE_ERRORS;
  var PARAGRAPH_TYPE_TEXT;
  var PARAGRAPH_TYPE_CODE;
  var PARAGRAPH_TYPE_ERROR;
  var RUNTIME_ERROR_FEEDBACK_MESSAGES;
  var FEEDBACK_CATEGORIES;
  var SYSTEM_GENERATED_TIPS;
  var ALLOWED_PARAGRAPH_TYPES;
  var CORRECTNESS_STATES;
  var CORRECTNESS_STATE_INPUT_DISPLAYED;
  var CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED;
  var CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED;
  var CORRECTNESS_STATE_NO_MORE_FEEDBACK;
  var CORRECTNESS_FEEDBACK_TEXT;
  var ALL_SUPPORTED_LANGUAGES;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    WRONG_LANGUAGE_ERRORS = $injector.get('WRONG_LANGUAGE_ERRORS');
    PARAGRAPH_TYPE_TEXT = $injector.get('PARAGRAPH_TYPE_TEXT');
    PARAGRAPH_TYPE_CODE = $injector.get('PARAGRAPH_TYPE_CODE');
    PARAGRAPH_TYPE_ERROR = $injector.get('PARAGRAPH_TYPE_ERROR');
    RUNTIME_ERROR_FEEDBACK_MESSAGES = $injector.get(
      'RUNTIME_ERROR_FEEDBACK_MESSAGES');
    FEEDBACK_CATEGORIES = $injector.get('FEEDBACK_CATEGORIES');
    SYSTEM_GENERATED_TIPS = $injector.get('SYSTEM_GENERATED_TIPS');
    ALLOWED_PARAGRAPH_TYPES = [
      PARAGRAPH_TYPE_CODE, PARAGRAPH_TYPE_TEXT, PARAGRAPH_TYPE_ERROR];

    CORRECTNESS_STATES = $injector.get('CORRECTNESS_STATES');
    CORRECTNESS_STATE_INPUT_DISPLAYED = $injector.get(
      'CORRECTNESS_STATE_INPUT_DISPLAYED');
    CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED = $injector.get(
      'CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED');
    CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED = $injector.get(
      'CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED');
    CORRECTNESS_STATE_NO_MORE_FEEDBACK = $injector.get(
      'CORRECTNESS_STATE_NO_MORE_FEEDBACK');

    CORRECTNESS_FEEDBACK_TEXT = $injector.get('CORRECTNESS_FEEDBACK_TEXT');
    ALL_SUPPORTED_LANGUAGES = $injector.get('ALL_SUPPORTED_LANGUAGES');
  }));

  describe('WRONG_LANGUAGE_ERRORS', function() {
    it('should have the correct keys and valid values', function() {
      WRONG_LANGUAGE_ERRORS.python.forEach(function(error) {
        expect(typeof error.errorName).toBe('string');
        expect(typeof error.regExString).toBe('string');
        expect(typeof error.allowMultiline).toBe('boolean');
        expect(Array.isArray(error.feedbackParagraphs)).toBe(true);

        error.feedbackParagraphs.forEach(function(paragraph) {
          expect(typeof paragraph.type).toEqual('string');
          expect(ALLOWED_PARAGRAPH_TYPES.indexOf(paragraph.type) !== -1).toBe(
            true);
          expect(typeof paragraph.content).toEqual('string');
        });
      });
    });
  });

  describe('SYSTEM_GENERATED_TIPS', function() {
    it('should have the correct keys and valid values', function() {
      ALL_SUPPORTED_LANGUAGES.forEach(function(language) {
        expect(SYSTEM_GENERATED_TIPS.hasOwnProperty(language));
        SYSTEM_GENERATED_TIPS[language].forEach(function(tip) {
          expect(typeof tip.type).toBe('string');
          expect(typeof tip.regexString).toBe('string');
          expect(typeof tip.message).toBe('string');
        });
      });
    });
  });

  describe('RUNTIME_ERROR_FEEDBACK_MESSAGES', function() {
    it('should have the correct keys and valid values', function() {
      RUNTIME_ERROR_FEEDBACK_MESSAGES.python.forEach(function(error) {
        expect(error.checker('test')).toBe(false);
        expect(typeof error.generateMessage(['NameError: name \'key\' is not ',
          'defined KeyError: blah on line 47 AttributeError: \'key\' ',
          'object has no attribute \'length\''].join(''))).toEqual('string');
      });
    });

    it('should handle an empty key', function() {
      var errorString = 'KeyError: "" on line 47';
      RUNTIME_ERROR_FEEDBACK_MESSAGES.python.forEach(function(error) {
        if (error.checker(errorString)) {
          expect(error.generateMessage(
            errorString)).toEqual([
              "The key \"\" is not in the dictionary you're ",
              "trying to retrieve from. Double-check to make sure everything ",
              "is spelled correctly and that you have included all ",
              "necessary key-value pairs."].join(''));
        }
      });
    });
  });

  describe('FEEDBACK_CATEGORIES', function() {
    it('should have identical keys and values', function() {
      for (var key in FEEDBACK_CATEGORIES) {
        expect(key).toEqual(FEEDBACK_CATEGORIES[key]);
      }
    });
  });

  describe('CORRECTNESS_STATES', function() {
    it('should have consistent values with individual constants', function() {
      expect(CORRECTNESS_STATES).toEqual([
        CORRECTNESS_STATE_INPUT_DISPLAYED,
        CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED,
        CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED,
        CORRECTNESS_STATE_NO_MORE_FEEDBACK
      ]);
    });
  });

  describe('CORRECTNESS_FEEDBACK_TEXT', function() {
    it([
      'should verify that correctness states match the keys in the ',
      'correctness feedback specifications'
    ].join(''), function() {
      var correctnessFeedbackTextKeys = Object.keys(CORRECTNESS_FEEDBACK_TEXT);
      expect(CORRECTNESS_STATES.slice().sort()).toEqual(
        correctnessFeedbackTextKeys.sort());
    });
  });
});
