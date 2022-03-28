

if [ $# -eq 0 ]
  then
    echo "Supply a youtube-dl-compatible video ID/URL as the sole argument!";
    exit 1;
fi

rm -rf downloads/*

youtube-dl --write-info-json --write-thumbnail -o 'downloads/temp.%(ext)s' \
  --restrict-filenames -f 'bestvideo[height<=780]+bestaudio/best[height<=780]' \
  $1

./node_modules/.bin/playwright test --headed
