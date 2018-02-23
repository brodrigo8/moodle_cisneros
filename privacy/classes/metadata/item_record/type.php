<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle. If not, see <http://www.gnu.org/licenses/>.

/**
 * An item_record which encapsulates a set of data held by a component with
 * Moodle.
 *
 * @package core_privacy
 * @copyright 2018 Zig Tan <zig@moodle.com>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace core_privacy\metadata\item_record;

/**
 * The item_record interface which all item_record types must implement.
 *
 * @copyright 2018 Zig Tan <zig@moodle.com>
 * @package core_privacy\metadata
 */
interface type {

    /**
     * Get the name describing this item record.
     *
     * @return  string
     */
    public function get_name();

    public function get_privacy_fields();

    public function get_summary();
}
