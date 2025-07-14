<?php

return [
    // required import configurations of other extensions,
    // in case a module imports from another package
    'dependencies' => ['backend'],
    'tags' => [
        'backend.form',
    ],
    'imports' => [
        // recursive definition, all *.js files in this folder are import-mapped
        // trailing slash is required per importmap-specification
        '@mista/ckeditor5_abbreviation/' => 'EXT:ckeditor5_abbreviation/Resources/Public/JavaScript/',
    ],
];
