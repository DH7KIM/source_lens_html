#!/usr/bin/env bash
# Shell sample: variables, quoting, functions, loops, conditions
set -eu

NAME="Source Lens"
COUNT=3
PATH_LIST='/usr/bin:/usr/local/bin'

greet() {
    local who="${1:-world}"
    echo "Hello, $who! ($NAME)"
}

# loop with a counter
for i in $(seq 1 "$COUNT"); do
    greet "user $i"
done

# condition and case
if [ -f "$0" ] && [ "$COUNT" -ge 2 ]; then
    echo "script: $0, count: ${COUNT}"
fi

case "${1:-}" in
    build) echo "building" ;;
    clean) echo "cleaning" ;;
    *)     echo "usage: $0 build|clean" ;;
esac

exit 0
