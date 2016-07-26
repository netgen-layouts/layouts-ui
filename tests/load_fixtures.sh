#!/bin/sh
export MYSQL_PWD="$2"
mysql -u $1 $3 < ../block-manager/lib/Tests/_fixtures/schema/schema.mysql.sql
mysql -u $1 $3 < ../block-manager/lib/Tests/_fixtures/data.mysql.sql
