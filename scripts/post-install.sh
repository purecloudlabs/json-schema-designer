# post install for copying font awesome files
mkdir -p src/assets
rm -rf src/assets/fonts
cp -R node_modules/@fortawesome/fontawesome-free/webfonts src/assets
echo 'Fonts copied to assets.'
