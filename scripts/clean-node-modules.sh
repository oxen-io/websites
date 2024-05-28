#!/bin/bash

# This script will remove all node_modules folders in the monorepo.
echo "Removing all node_modules folders..."

# Loop through each package in the "./apps" directory
for app in ./apps/*; do
  if [[ -d "$app" ]]; then
    # Remove the node_modules folder
    rm -rf "$app/node_modules"
  fi
done

# Loop through each package in the "./packages" directory
for package in ./packages/*; do
  if [[ -d "$package" ]]; then
    # Remove the node_modules folder
    rm -rf "$package/node_modules"
  fi
done

echo "All node_modules folders have been removed."
