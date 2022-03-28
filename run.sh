



rm -rf downloads/*

youtube-dl --write-info-json --write-thumbnail -o 'downloads/temp.%(ext)s' --restrict-filenames -f 'bestvideo[height<=780]+bestaudio/best[height<=780]' \
  https://www.youtube.com/watch?v=7N2lgUvEXlQ

./node_modules/.bin/playwright test --headed