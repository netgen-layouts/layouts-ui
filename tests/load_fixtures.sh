#!/bin/sh
export MYSQL_PWD="$2"
# mysql -u $1 $3 < tests/fixtures/ez.sql

mysql -u $1 $3 < ../block-manager/tests/_fixtures/schema/schema.mysql.sql
mysql -u $1 $3 < ../block-manager/tests/_fixtures/data.mysql.sql
