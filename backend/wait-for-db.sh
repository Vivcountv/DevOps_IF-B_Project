#!/bin/sh
set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" 3306; do
  echo "Waiting for MySQL at $host:3306..."
  sleep 3
done

echo "MySQL is up - executing command"
exec $cmd
