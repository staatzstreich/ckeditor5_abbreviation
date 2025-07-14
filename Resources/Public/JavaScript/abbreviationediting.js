/**
 * Based on CKEditor 5 Tutorial Examples - Abbreviation Plugin
 * Original source: https://github.com/ckeditor/ckeditor5-tutorials-examples/blob/main/abbreviation-plugin/part-3/abbreviation/abbreviation.js
 * License: https://github.com/ckeditor/ckeditor5-tutorials-examples/blob/main/LICENSE.md
 *
 * Modifications for TYPO3 Extension by Michael Staatz
 * 2025
 */

import {Plugin} from '@ckeditor/ckeditor5-core';
import AbbreviationCommand from './abbreviationcommand.js';

export default class AbbreviationEditing extends Plugin {
  init() {
    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add('addAbbreviation', new AbbreviationCommand(this.editor));
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.extend('$text', {
      allowAttributes: ['abbreviation']
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    conversion.for('downcast').attributeToElement({
      model: 'abbreviation', view: (modelAttributeValue, {writer}) => {
        return writer.createAttributeElement('abbr', {'data-tooltip': modelAttributeValue}, {priority: 5});
      }
    });

    conversion.for('upcast').elementToAttribute({
      view: {
        name: 'abbr', attributes: ['data-tooltip']
      }, model: {
        key: 'abbreviation', value: viewElement => {
          return viewElement.getAttribute('data-tooltip');
        }
      }
    });
  }
}
