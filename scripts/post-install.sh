# post install for copying font awesome files
mkdir -p src/assets
cp -R node_modules/font-awesome/fonts src/assets
echo 'Fonts copied to assets.'
