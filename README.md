# Hearth

The ambient living-room app for our Samsung TV. This repo holds only the code and generic art; personal photos and media live on the TV.

## Layout
- `src/app.js`: the app's source. Run `tools/build.sh` to produce `bundle/app.js` (adds the MQTT and QR libraries from `lib/`).
- `bundle/`: what the TV shell downloads (`version.json` changes trigger an update).
- `admin/`: the phone admin page. It needs the TV's code in the link (`admin/#code`).
- `media/`: scene videos the TV downloads into its own storage.
