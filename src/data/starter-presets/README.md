# Built-in starter presets

Place JSON files downloaded from `/dev/presets` in this directory. Every valid
`*.json` file is discovered at build time and published as a read-only starter
preset. Preset IDs must be unique across the directory.

After adding or changing a file, run `npm test` and `npm run build`, then commit
the file and deploy the rebuilt application.
