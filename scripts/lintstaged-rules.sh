#!/bin/bash

# Get the content of the root .lintstagedrc.json file
lintstagedrc=$(cat ./.lintstagedrc.json)

# Loop through each package in the "./apps" directory
for app in ./apps/*; do
  if [[ -d "$app" ]]; then
    lintstagedrc_path="$app/.lintstagedrc.json"
    # Copy the content of the root .lintstagedrc.json file to the package's .lintstagedrc.json file
    echo "$lintstagedrc" >"$lintstagedrc_path"
  fi
done

# Loop through each package in the "./packages" directory
for package in ./packages/*; do
  if [[ -d "$package" ]]; then
    lintstagedrc_path="$package/.lintstagedrc.json"
    # Copy the content of the root .lintstagedrc.json file to the package's .lintstagedrc.json file
    echo "$lintstagedrc" >"$lintstagedrc_path"
  fi
done
