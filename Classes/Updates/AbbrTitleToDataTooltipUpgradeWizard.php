<?php

declare(strict_types=1);

/*
 * This file is part of the "ckeditor5_abbreviation" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 */

namespace Michaelstaatz\Ckeditor5Abbreviation\Updates;

use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Install\Attribute\UpgradeWizard;
use TYPO3\CMS\Install\Updates\UpgradeWizardInterface;

#[UpgradeWizard('ckeditor5Abbreviation_abbrTitleToDataTooltip')]
final class AbbrTitleToDataTooltipUpgradeWizard implements UpgradeWizardInterface
{
    public function getTitle(): string
    {
        return 'Update <abbr title="..."> to <abbr data-tooltip="...">';
    }

    public function getDescription(): string
    {
        return 'This wizard updates all occurrences of <abbr title="..."> to <abbr data-tooltip="..."> in the database.';
    }

    public function executeUpdate(): bool
    {
        try {
            $connection = GeneralUtility::makeInstance(ConnectionPool::class)
                ->getConnectionForTable('tt_content');

            $connection->executeQuery('UPDATE tt_content SET bodytext = REPLACE(bodytext, \'<abbr title="\', \'<abbr data-tooltip="\')');
        } catch (\Throwable) {
            return false;
        }

        return true;
    }

    public function getPrerequisites(): array
    {
        return [];
    }

    public function updateNecessary(): bool
    {
        $connection = GeneralUtility::makeInstance(ConnectionPool::class)
            ->getConnectionForTable('tt_content');

        $result = $connection->executeQuery('SELECT COUNT(*) FROM tt_content WHERE bodytext LIKE \'%<abbr title=%\'');
        $count = $result->fetchOne();

        if ($count > 0) {
            return true;
        }

        return false;
    }
}
