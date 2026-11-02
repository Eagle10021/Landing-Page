# 01blue.org Landing Page

The front door of [01blue.org](https://01blue.org): a single page that lists my projects and where to find them.

## Design
- **Colour**: in dark mode the page is deep cobalt (`#0b2e6f`) with Miku teal (`#39c5bb`) highlights. In light mode it flips: pale paper with cobalt text and Teto red (`#c8304f`) highlights. It follows the system theme until the toggle is used, then remembers the choice.
- **Type**: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) throughout, with the condensed width for the wordmark.
- **Motion** ([anime.js](https://animejs.com) v4): one entrance sequence on load, wordmark letters that stretch wide under the pointer and spring back, project names that nudge on hover, and a circular wipe when the theme changes. All of it is off under *reduce motion*, and the page works without it.
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
