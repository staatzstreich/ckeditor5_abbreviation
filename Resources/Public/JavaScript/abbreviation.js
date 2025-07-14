/**
 * Based on CKEditor 5 Tutorial Examples - Abbreviation Plugin
 * Original source: https://github.com/ckeditor/ckeditor5-tutorials-examples/blob/main/abbreviation-plugin/part-3/abbreviation/abbreviation.js
 * License: https://github.com/ckeditor/ckeditor5-tutorials-examples/blob/main/LICENSE.md
 *
 * Modifications for TYPO3 Extension by Michael Staatz
 * 2025
 */

import {Plugin} from '@ckeditor/ckeditor5-core';
import AbbreviationEditing from './abbreviationediting.js';
import AbbreviationUI from './abbreviationui.js';

export default class Abbreviation extends Plugin {
  static get requires() {
    return [AbbreviationEditing, AbbreviationUI];
  }
}
