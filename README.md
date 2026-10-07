# PA2 - Matrix Transformations and Perspective

**Student ID:** 241280

## Variant parameters

| Parameter | Value |
| --- | --- |
| Assigned solid | Square pyramid (last digit 0, same as PA1) |
| Orbit period T | 6 s (6 + 0) |
| Cube spin axis | Normalised (1, 1, 1) (digit 8, 8 mod 3 = 2) |
| Orbit plane | Horizontal, tilted 30° about the z-axis (digit 2, 2 mod 3 = 2) |
| Camera | eye (5, 3, 5), FOV 60° (digit 1, 1 mod 2 = 1) |

Fixed for everyone: cube spin 1.2 rad/s, orbit radius 2.5, solid self-spin 2.0 rad/s around its own y-axis, scale pulse s(t) = 0.65 + 0.15 * sin(2*pi*t / 3), camera target (0, 0, 0), up (0, 1, 0).

## How to run

The page must be served from a local web server (not opened as a file).

1. Open the project folder in VS Code.
2. Install the Live Server extension and click "Go Live", or run `python -m http.server 8000` in the project folder and open `http://localhost:8000`.
3. Use current Chrome or Firefox.

glMatrix 2.8.1 is loaded from cdnjs, so an internet connection is required.

## Key map

| Key | Effect |
| --- | --- |
| P | Pause / resume |
| O | Toggle perspective / orthographic |
| + or = / - | FOV +5° / -5° (limited to 20°-100°, perspective only) |
| Left / Right arrow | Orbit the camera eye around the y-axis by 5° |
| R | Reset camera and time |

## Files

- `index.html` - canvas, status label, glMatrix script, index.js
- `index.js` - all JavaScript and GLSL
- `writeup.pdf` - E1-E6 and development log
- `demo.mp4` / `demo.webm` - screen recording