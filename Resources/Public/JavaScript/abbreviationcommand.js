/**
 * Based on CKEditor 5 Tutorial Examples - Abbreviation Plugin
 * Original source: https://github.com/ckeditor/ckeditor5-tutorials-examples/blob/main/abbreviation-plugin/part-3/abbreviation/abbreviation.js
 * License: https://github.com/ckeditor/ckeditor5-tutorials-examples/blob/main/LICENSE.md
 *
 * Modifications for TYPO3 Extension by Michael Staatz
 * 2025
 */

import {Command} from '@ckeditor/ckeditor5-core';
import {findAttributeRange} from '@ckeditor/ckeditor5-typing';
import {toMap} from '@ckeditor/ckeditor5-utils';
import getRangeText from './utils.js';

export default class AbbreviationCommand extends Command {
  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const firstRange = selection.getFirstRange();

    if (firstRange.isCollapsed) {
      if (selection.hasAttribute('abbreviation')) {
        const attributeValue = selection.getAttribute('abbreviation');
        const abbreviationRange = findAttributeRange(selection.getFirstPosition(), 'abbreviation', attributeValue, model);

        this.value = {
          abbr: getRangeText(abbreviationRange),
          title: attributeValue,
          range: abbreviationRange
        };
      } else {
        this.value = null;
      }
    } else {
      if (selection.hasAttribute('abbreviation')) {
        const attributeValue = selection.getAttribute('abbreviation');
        const abbreviationRange = findAttributeRange(selection.getFirstPosition(), 'abbreviation', attributeValue, model);

        if (abbreviationRange.containsRange(firstRange, true)) {
          this.value = {
            abbr: getRangeText(firstRange),
            title: attributeValue,
            range: firstRange
          };
        } else {
          this.value = null;
        }
      } else {
        this.value = null;
      }
    }

    this.isEnabled = model.schema.checkAttributeInSelection(selection, 'abbreviation');
  }

  execute({abbr, title}) {
    const model = this.editor.model;
    const selection = model.document.selection;

    model.change(writer => {
      if (selection.isCollapsed) {
        if (this.value) {
          const {end: positionAfter} = model.insertContent(
            writer.createText(abbr, {abbreviation: title}),
            this.value.range
          );
          writer.setSelection(positionAfter);
        } else if (abbr !== '') {
          const firstPosition = selection.getFirstPosition();
          const attributes = toMap(selection.getAttributes());

          attributes.set('abbreviation', title);

          const {end: positionAfter} = model.insertContent(writer.createText(abbr, attributes), firstPosition);

          writer.setSelection(positionAfter);
        }

        writer.removeSelectionAttribute('abbreviation');
      } else {
        const ranges = model.schema.getValidRanges(selection.getRanges(), 'abbreviation');

        for (const range of ranges) {
          writer.setAttribute('abbreviation', title, range);
        }
      }
    });
  }
}
