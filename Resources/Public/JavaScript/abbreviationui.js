/**
 * Based on CKEditor 5 Tutorial Examples - Abbreviation Plugin
 * Original source: https://github.com/ckeditor/ckeditor5-tutorials-examples/blob/main/abbreviation-plugin/part-3/abbreviation/abbreviation.js
 * License: https://github.com/ckeditor/ckeditor5-tutorials-examples/blob/main/LICENSE.md
 *
 * Modifications for TYPO3 Extension by Michael Staatz
 * 2025
 */

import {Plugin} from '@ckeditor/ckeditor5-core';
import {ButtonView, clickOutsideHandler, ContextualBalloon} from '@ckeditor/ckeditor5-ui';
import FormView from './abbreviationview.js';
import getRangeText from './utils.js';

const abbrIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4.5a.5.5 0 01.5-.5H6a.5.5 0 01.47.32L9 11.3l2.53-6.98A.5.5 0 0112 4h2.5a.5.5 0 01.47.68l-4.5 12a.5.5 0 01-.94 0l-4.5-12A.5.5 0 013 4.5zM15 16a1 1 0 100-2 1 1 0 000 2z" /></svg>';

export default class AbbreviationUI extends Plugin {
  static get requires() {
    return [ContextualBalloon];
  }

  init() {
    const editor = this.editor;

    // Create the balloon and the form view.
    this._balloon = this.editor.plugins.get(ContextualBalloon);
    this.formView = this._createFormView();

    editor.ui.componentFactory.add('abbreviation', () => {
      const button = new ButtonView();

      button.label = 'Abbreviation';
      button.tooltip = true;
      button.withText = false;
      button.icon = abbrIcon;

      // Show the UI on button click.
      this.listenTo(button, 'execute', () => {
        this._showUI();
      });

      return button;
    });
  }

  _createFormView() {
    const editor = this.editor;
    const formView = new FormView(editor.locale);

    this.listenTo(formView, 'submit', () => {
      const value = {
        abbr: formView.abbrInputView.fieldView.element.value,
        title: formView.titleInputView.fieldView.element.value
      };
      editor.execute('addAbbreviation', value);

      this._hideUI();
    });

    this.listenTo(formView, 'cancel', () => {
      this._hideUI();
    });

    clickOutsideHandler({
      emitter: formView,
      activator: () => this._balloon.visibleView === formView,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideUI()
    });

    formView.keystrokes.set('Esc', (data, cancel) => {
      this._hideUI();
      cancel();
    });

    return formView;
  }

  _showUI() {
    const selection = this.editor.model.document.selection;

    // Check the value of the command.
    const commandValue = this.editor.commands.get('addAbbreviation').value;

    this._balloon.add({
      view: this.formView,
      position: this._getBalloonPositionData()
    });

    this.formView.abbrInputView.isEnabled = selection.getFirstRange().isCollapsed;

    if (commandValue) {
      this.formView.abbrInputView.fieldView.value = commandValue.abbr;
      this.formView.titleInputView.fieldView.value = commandValue.title;
    }

      // If the command has no value, put the currently selected text (not collapsed)
    // in the first field and empty the second in that case.
    else {
      this.formView.abbrInputView.fieldView.value = getRangeText(selection.getFirstRange());
      this.formView.titleInputView.fieldView.value = '';
    }

    this.formView.focus();
  }

  _hideUI() {
    // Clear the input field values and reset the form.
    this.formView.abbrInputView.fieldView.value = '';
    this.formView.titleInputView.fieldView.value = '';
    this.formView.element.reset();
    this._balloon.remove(this.formView);
    this.editor.editing.view.focus();
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    let target = null;

    // Set a target position by converting view selection range to DOM
    target = () => view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

    return {
      target
    };
  }
}
