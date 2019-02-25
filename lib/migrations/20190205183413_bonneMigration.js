'use strict';

exports.up = function (knex, Promise) {
    
    return knex
        .schema
        .createTable( 'users', (usersTable) => {

            usersTable.increments().primary();
            usersTable.string( 'login', 50 ).notNullable();
            usersTable.string( 'firstname', 50 ).notNullable();
            usersTable.string( 'lastname', 50 ).notNullable();
            usersTable.string( 'email', 250 ).notNullable();
            usersTable.string( 'password', 128 ).notNullable();
            usersTable.string( 'company', 50 );
            usersTable.string( 'function', 50 );

        });

};

exports.down = function (knex, Promise) {

    return knex
        .schema
        .dropTableIfExists( 'users' );
};