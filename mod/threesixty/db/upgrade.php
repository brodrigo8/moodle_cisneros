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
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

// This file keeps track of upgrades to
// the feedback module
//
// Sometimes, changes between versions involve
// alterations to database structures and other
// major things that may break installations.
//
// The upgrade function in this file will attempt
// to perform all the necessary actions to upgrade
// your older installation to the current version.
//
// If there's something it cannot do itself, it
// will tell you what you need to do.
//
// The commands in here will all be database-neutral,
// using the methods of database_manager class
//
// Please do not forget to use upgrade_set_timeout()
// before any action that may take longer time to finish.

function xmldb_threesixty_upgrade($oldversion) {
    global $CFG, $DB;

    $dbman = $DB->get_manager();

    // Moodle v3.1.0 release upgrade line.
    // Put any upgrade step following this.

    if ($oldversion < 2016021900.09) {

        // Changing type of field fromuser on table threesixty_response to int.
        $table = new xmldb_table('threesixty_response');
        $field = new xmldb_field('fromuser', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0', 'item');
        // Launch change of type for field fromuser.
        $dbman->change_field_type($table, $field);

        $field = new xmldb_field('touser', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0', 'fromuser');
        // Launch change of type for field touser.
        $dbman->change_field_type($table, $field);

        // Threesixty savepoint reached.
        upgrade_mod_savepoint(true, 2016021900.09, 'threesixty');
    }

    return true;
}


