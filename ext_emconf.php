<?php
$EM_CONF[$_EXTKEY] = [
    'title' => 'CKEditor5 Plugin for abbr tag',
    'description' => 'Add abbreviations information through the ckeditor',
    'category' => 'be',
    'state' => 'stable',
    'clearCacheOnLoad' => true,
    'author' => 'Michael Staatz',
    'author_email' => 'kontakt@mstaatz.de',
    'version' => '1.1.3',
    'constraints' => [
        'depends' => [
            'typo3' => '13.4.0-13.4.99',
            'rte_ckeditor' => '13.4.0-13.4.99'
        ],
    ],
];
