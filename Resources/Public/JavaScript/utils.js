/**
 * Based on CKEditor 5 Tutorial Examples - Abbreviation Plugin
 * Original source: https://github.com/ckeditor/ckeditor5-tutorials-examples/blob/main/abbreviation-plugin/part-3/abbreviation/util.js
 * License: https://github.com/ckeditor/ckeditor5-tutorials-examples/blob/main/LICENSE.md
 *
 * Modifications for TYPO3 Extension by Michael Staatz
 * 2025
 */

// A helper function that retrieves and concatenates all text within the model range.
export default function getRangeText(range) {
  return Array.from(range.getItems()).reduce((rangeText, node) => {
    if (!(node.is('text') || node.is('textProxy'))) {
      return rangeText;
    }

    return rangeText + node.data;
  }, '');
}
