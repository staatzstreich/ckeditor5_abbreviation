# TYPO3 Extension `ckeditor5_abbreviation`

This extension ships a simple plugin for the ckeditor to allow editors setting abbreviations. The plugin itself has been taken from https://github.com/ckeditor/ckeditor5-tutorials-examples/tree/main/abbreviation-plugin/part-3 without some changes.

## Installation

Use `ddev composer req michaelstaatz/ckeditor5-abbreviation:13.4` or download the extension from TER.

## Usage

All it takes to enable the plugin are the following changes in your `RTE.yaml`:

1. Import the configuration from the extension:

```yaml
editor:
  config:
    importModules:
      - '@mista/ckeditor5_abbreviation/abbreviation.js'
    htmlSupport:
      allow:
        - { name: 'abbr', attributes: true, classes: true, styles: true }
    contentCss:
      - "EXT:ckeditor5_abbreviation/Resources/Public/Css/Abbr.css"
```

2. Enable the plugin:

```yaml
editor:
  config:
    toolbar:
      items:
        - abbreviation
```

3. Load the CSS - File

```text
page.includeCSS.abbreviation-tooltip = EXT:ckeditor5_abbreviation/Resources/Public/Css/AbbreviationTooltip.css
```

## Credits

This extension was created by Michael Staatz with ♥ and is inspired by the extension [rte_ckeditor_abbr](https://extensions.typo3.org/extension/rte_ckeditor_abbr)
