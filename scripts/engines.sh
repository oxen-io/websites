#!/bin/bash

# This script will add or update the engines block in the package.json files of all packages in the "./apps" and "./packages" directories.
# The engines block is taken from the root package.json file.

# Get the engines block from the root package.json
engines=$(jq '.engines' package.json)
echo "Adding or updating the engines block in the package.json files of all packages..."
echo $engines

# Loop through each package in the "./apps" directory
for app in ./apps/*; do
  if [[ -d "$app" ]]; then
    package_json="$app/package.json"
    # Add or update the engines block in the package.json
    jq --argjson engines "$engines" '. + {engines: $engines}' "$package_json" >"$package_json.tmp" && mv "$package_json.tmp" "$package_json"
  fi
done

# Loop through each package in the "./packages" directory
for package in ./packages/*; do
  if [[ -d "$package" ]]; then
    package_json="$package/package.json"
    # Add or update the engines block in the package.json
    jq --argjson engines "$engines" '. + {engines: $engines}' "$package_json" >"$package_json.tmp" && mv "$package_json.tmp" "$package_json"
  fi
done
