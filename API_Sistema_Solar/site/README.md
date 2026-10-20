# Solar System Consult

A web application that lets a user search for a celestial body and view information returned by a public API.

## Technologies

- HTML for the page structure
- CSS for the responsive layout
- JavaScript for form interaction and displaying results
- PHP for requesting the public API and returning JSON
- [Solar System OpenData API](https://api.le-systeme-solaire.net/)

## How it works

1. The user types the name of a body, such as `Earth` or `Mars`.
2. JavaScript sends the name to `consultar.php`.
3. PHP requests the information from the public API.
4. PHP returns data from the API when a server API key is configured, or bundled reference data otherwise.
5. JavaScript displays the result without reloading the page.

## Supported searches

Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Moon and Sun. Names in Portuguese are accepted too, for example `Terra`, `Marte`, `Lua` and `Sol`.

## How to run locally

PHP must be installed. Open a terminal in the project folder and run:

```bash
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

Do not open `index.html` directly as a file. PHP must run through a local server so that `consultar.php` can execute.

With XAMPP, start Apache and open `http://localhost/API_Sistema_Solar/site/`. Do not use the VS Code Live Server extension, because it does not execute PHP files.

## Images

The project can display local images from the `img` folder if the files are added using the names referenced in `verificacao.js`. If an image is missing, the page shows a simple placeholder instead.

## Data sources

- The Solar System OpenData API now requires an API key. Set the `SOLAR_SYSTEM_API_KEY` environment variable in the PHP/Apache server to use live API data; send it only from the server, never from browser JavaScript.
- With XAMPP, add `SetEnv SOLAR_SYSTEM_API_KEY "your-key"` to the Apache configuration for this site and restart Apache. Do not put the key in a committed file.
- Without a key, or if the API is unavailable, the application displays bundled reference values for all supported bodies. Some changing or unavailable fields, such as the known moon counts for the outer planets, are marked as unavailable in reference data.
- API data can be fresher than the bundled reference values. When a field is missing from the selected source, the page displays “Not available”.
