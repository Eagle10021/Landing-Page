# 01blue.org Landing Page

The front door of [01blue.org](https://01blue.org): a single page that lists my projects and where to find them.

## Design
The name comes from Hatsune Miku's shoulder number, 01.

- **Themes**: *Miku* (dark): deep navy, Miku teal, and the red of her "01". *Teto* (light): soft rose with Teto red and teal. It follows the system theme until the toggle is used, then remembers the choice.
- **Type**: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque), condensed for the wordmark, with [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) for addresses.
- **Motion** ([anime.js](https://animejs.com) v4):
  - one entrance sequence on load;
  - a music-visualiser bar under the wordmark;
  - clicking the wordmark plays a short synth tune (Web Audio, only on click);
  - wordmark letters stretch under the pointer;
  - frosted glass cards that tilt toward the mouse with a spotlight;
  - a living background of drifting motes and music notes over a perspective grid;
  - blinds in the other singer's colour when the theme changes.

  All of it is off under *reduce motion*, and the page still works if anime.js can't load.
- Plain HTML, CSS and JS. No build step.

## Links
**On 01blue.org**
- **Portfolio**: [manifest.01blue.org](https://manifest.01blue.org)
- **Mega Kit Pinouts**: [pinouts.01blue.org](https://pinouts.01blue.org)
- **Cursorport**: [cursorport.01blue.org](https://cursorport.01blue.org)
- **BeamNG Livery Maker**: [eagle10021.github.io/BeamNG-Livery-Maker](https://eagle10021.github.io/BeamNG-Livery-Maker/)

**On GitHub**
- [Legion Control](https://github.com/Eagle10021/Legion-Controller)
- [Arona SDDM Login](https://github.com/Eagle10021/Arona-SDDM-Login)
- [Algonquin Printing on Linux](https://github.com/Eagle10021/AC-Print-Guide-Linux)

To add a project, copy one `<li>` in `index.html` and change its link, name, description and address.

**When you change `styles.css` or `script.js`**, bump the `?v=` number on its link in `index.html`. Cloudflare caches those files for hours, and the new number makes visitors fetch the new version straight away.
