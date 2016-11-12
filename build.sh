npm run build
rm -rf dist/public
cp src/public dist/public -R
echo navigating to dist/public
cd dist/public
echo Runing sw-precache
sw-precache --config=../../sw-precache-config.js
echo navigating back
cd ../
