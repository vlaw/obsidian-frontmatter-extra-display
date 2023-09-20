#!/usr/bin/env bash
#
# set -x

# echo "$#"

if (($# == 0)); then
	echo "WARN: sh help.sh build to build release script"
	npm run-script dev
else
	npm run-script build
fi

APP="frontmatter-extra-display"

# SOURCE="$HOME/Repositories/github.com/vlaw/$APP"
SOURCE="$PWD"

DEST="${VAULT:-/Users/luowentao/obsidian-container}/.obsidian/plugins"

INSTALL="$DEST/$APP"

trash "$INSTALL"/main.js || echo "main.js does not exist, skip."
trash "$INSTALL"/manifest.json || echo "manifest.json does not exist, skip."

if [[ -d "$INSTALL" ]]; then
	echo "$INSTALL"
else
	mkdir -p "$INSTALL"
fi

if ! /bin/cp -vf "$SOURCE"/main.js "$SOURCE"/manifest.json "${SOURCE}/styles.css" "$DEST/$APP"; then
	echo "fail~"
else
	terminal-notifier -message 'done~'
fi
