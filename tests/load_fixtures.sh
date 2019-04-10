#!/bin/sh
export MYSQL_PWD="$3"
# mysql -u $2 -h $1 $4 < tests/fixtures/data.mysql.sql

mysql -u $2 -h $1 $4 < ../layouts-core/tests/_fixtures/schema/schema.mysql.sql
mysql -u $2 -h $1 $4 < ../layouts-core/tests/_fixtures/data.mysql.sql
