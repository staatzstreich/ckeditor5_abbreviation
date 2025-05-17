/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView, ContextualBalloon, clickOutsideHandler } from '@ckeditor/ckeditor5-ui';
import FormView from './abbreviationview.js';
import getRangeText from './utils.js';
//const abbrIcon = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.628a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/><path d="M8.5 9.125a.3.3 0 0 0-.253-.296L5.11 8.327a.75.75 0 1 1 .388-1.449l4.04.716c.267.072.624.08.893.009l4.066-.724a.75.75 0 1 1 .388 1.45l-3.132.5a.3.3 0 0 0-.253.296v1.357a.3.3 0 0 0 .018.102l1.615 4.438a.75.75 0 0 1-1.41.513l-1.35-3.71a.3.3 0 0 0-.281-.197h-.209a.3.3 0 0 0-.282.198l-1.35 3.711a.75.75 0 0 1-1.41-.513l1.64-4.509a.3.3 0 0 0 .019-.103V9.125Z"/><path clip-rule="evenodd" d="M10 18.5a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17Zm0 1.5c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10Z"/></svg>';
const abbrIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4.5a.5.5 0 01.5-.5H6a.5.5 0 01.47.32L9 11.3l2.53-6.98A.5.5 0 0112 4h2.5a.5.5 0 01.47.68l-4.5 12a.5.5 0 01-.94 0l-4.5-12A.5.5 0 013 4.5zM15 16a1 1 0 100-2 1 1 0 000 2z" /></svg>';
export default class AbbreviationUI extends Plugin {
	static get requires() {
		return [ ContextualBalloon ];
	}

	init() {
		const editor = this.editor;

		// Create the balloon and the form view.
		this._balloon = this.editor.plugins.get( ContextualBalloon );
		this.formView = this._createFormView();

		editor.ui.componentFactory.add( 'abbreviation', () => {
			const button = new ButtonView();

			button.label = 'Abbreviation';
			button.tooltip = true;
			button.withText = false;
      button.icon = abbrIcon;

			// Show the UI on button click.
			this.listenTo( button, 'execute', () => {
				this._showUI();
			} );

			return button;
		} );
	}

	_createFormView() {
		const editor = this.editor;
		const formView = new FormView( editor.locale );

		// Execute the command after clicking the "Save" button.
		this.listenTo( formView, 'submit', () => {
			// Grab values from the abbreviation and title input fields.
			const value = {
				abbr: formView.abbrInputView.fieldView.element.value,
				title: formView.titleInputView.fieldView.element.value
			};
			editor.execute( 'addAbbreviation', value );

			// Hide the form view after submit.
			this._hideUI();
		} );

		// Hide the form view after clicking the "Cancel" button.
		this.listenTo( formView, 'cancel', () => {
			this._hideUI();
		} );

		// Hide the form view when clicking outside the balloon.
		clickOutsideHandler( {
			emitter: formView,
			activator: () => this._balloon.visibleView === formView,
			contextElements: [ this._balloon.view.element ],
			callback: () => this._hideUI()
		} );

		formView.keystrokes.set( 'Esc', ( data, cancel ) => {
			this._hideUI();
			cancel();
		} );

		return formView;
	}

	_showUI() {
		const selection = this.editor.model.document.selection;

		// Check the value of the command.
		const commandValue = this.editor.commands.get( 'addAbbreviation' ).value;

		this._balloon.add( {
			view: this.formView,
			position: this._getBalloonPositionData()
		} );

		// Disable the input when the selection is not collapsed.
		this.formView.abbrInputView.isEnabled = selection.getFirstRange().isCollapsed;

		// Fill the form using the state (value) of the command.
		if ( commandValue ) {
			this.formView.abbrInputView.fieldView.value = commandValue.abbr;
			this.formView.titleInputView.fieldView.value = commandValue.title;
		}
		// If the command has no value, put the currently selected text (not collapsed)
		// in the first field and empty the second in that case.
		else {
			const selectedText = getRangeText( selection.getFirstRange() );

			this.formView.abbrInputView.fieldView.value = selectedText;
			this.formView.titleInputView.fieldView.value = '';
		}

		this.formView.focus();
	}

	_hideUI() {
		// Clear the input field values and reset the form.
		this.formView.abbrInputView.fieldView.value = '';
		this.formView.titleInputView.fieldView.value = '';
		this.formView.element.reset();

		this._balloon.remove( this.formView );

		// Focus the editing view after inserting the abbreviation so the user can start typing the content
		// right away and keep the editor focused.
		this.editor.editing.view.focus();
	}

	_getBalloonPositionData() {
		const view = this.editor.editing.view;
		const viewDocument = view.document;
		let target = null;

		// Set a target position by converting view selection range to DOM
		target = () => view.domConverter.viewRangeToDom( viewDocument.selection.getFirstRange() );

		return {
			target
		};
	}
}
