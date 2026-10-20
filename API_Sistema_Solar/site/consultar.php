<?php
// This file returns celestial body data from the API or the bundled reference data.

header('Content-Type: application/json; charset=utf-8');

// Keep messages in JSON so JavaScript can show them to the user.
function responder(int $status, array $dados): void
{
    http_response_code($status);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// The page must send a body name using the GET parameter "corpo".
$termo = trim($_GET['corpo'] ?? '');

if ($termo === '') {
    responder(400, ['erro' => 'Type the name of a celestial body before searching.']);
}

// Map common names in Portuguese and English to the names used by the API.
// The API has data for bodies in our Solar System, not every object in space.
$nomes = [
    'mercury' => 'Mercury',
    'mercurio' => 'Mercury',
    'venus' => 'Venus',
    'terra' => 'Earth',
    'earth' => 'Earth',
    'mars' => 'Mars',
    'marte' => 'Mars',
    'jupiter' => 'Jupiter',
    'saturn' => 'Saturn',
    'saturno' => 'Saturn',
    'uranus' => 'Uranus',
    'urano' => 'Uranus',
    'neptune' => 'Neptune',
    'netuno' => 'Neptune',
    'pluto' => 'Pluto',
    'plutao' => 'Pluto',
    'lua' => 'Moon',
    'moon' => 'Moon',
    'sol' => 'Sun',
    'sun' => 'Sun'
];

$chave = mb_strtolower($termo, 'UTF-8');
$chave = strtr($chave, [
    'á' => 'a', 'à' => 'a', 'â' => 'a', 'ã' => 'a',
    'é' => 'e', 'ê' => 'e', 'í' => 'i',
    'ó' => 'o', 'ô' => 'o', 'õ' => 'o',
    'ú' => 'u', 'ü' => 'u', 'ç' => 'c'
]);

if (!isset($nomes[$chave])) {
    responder(404, [
        'erro' => 'Body not recognized. Try Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Moon or Sun.'
    ]);
}

$nomeApi = $nomes[$chave];

$referencia = [
    'Mercury' => ['bodyType' => 'Planet', 'mass' => ['massValue' => 3.3011, 'massExponent' => 23], 'meanRadius' => 2439.7, 'gravity' => 3.7, 'avgTemp' => 440, 'semimajorAxis' => 57909050, 'sideralOrbit' => 87.969, 'sideralRotation' => 1407.6, 'moonCount' => 0],
    'Venus' => ['bodyType' => 'Planet', 'mass' => ['massValue' => 4.8675, 'massExponent' => 24], 'meanRadius' => 6051.8, 'gravity' => 8.87, 'avgTemp' => 737, 'semimajorAxis' => 108208000, 'sideralOrbit' => 224.701, 'sideralRotation' => -5832.5, 'moonCount' => 0],
    'Earth' => ['bodyType' => 'Planet', 'mass' => ['massValue' => 5.97237, 'massExponent' => 24], 'meanRadius' => 6371, 'gravity' => 9.8, 'avgTemp' => 288, 'semimajorAxis' => 149598023, 'sideralOrbit' => 365.256, 'sideralRotation' => 23.934, 'moonCount' => 1],
    'Mars' => ['bodyType' => 'Planet', 'mass' => ['massValue' => 6.4171, 'massExponent' => 23], 'meanRadius' => 3389.5, 'gravity' => 3.71, 'avgTemp' => 210, 'semimajorAxis' => 227939200, 'sideralOrbit' => 686.98, 'sideralRotation' => 24.623, 'moonCount' => 2],
    'Jupiter' => ['bodyType' => 'Planet', 'mass' => ['massValue' => 1.8982, 'massExponent' => 27], 'meanRadius' => 69911, 'gravity' => 24.79, 'avgTemp' => 165, 'semimajorAxis' => 778570000, 'sideralOrbit' => 4332.59, 'sideralRotation' => 9.925],
    'Saturn' => ['bodyType' => 'Planet', 'mass' => ['massValue' => 5.6834, 'massExponent' => 26], 'meanRadius' => 58232, 'gravity' => 10.44, 'avgTemp' => 134, 'semimajorAxis' => 1433529000, 'sideralOrbit' => 10759.22, 'sideralRotation' => 10.656],
    'Uranus' => ['bodyType' => 'Planet', 'mass' => ['massValue' => 8.681, 'massExponent' => 25], 'meanRadius' => 25362, 'gravity' => 8.87, 'avgTemp' => 76, 'semimajorAxis' => 2872463000, 'sideralOrbit' => 30688.5, 'sideralRotation' => -17.24],
    'Neptune' => ['bodyType' => 'Planet', 'mass' => ['massValue' => 1.02413, 'massExponent' => 26], 'meanRadius' => 24622, 'gravity' => 11.15, 'avgTemp' => 72, 'semimajorAxis' => 4495060000, 'sideralOrbit' => 60182, 'sideralRotation' => 16.11],
    'Pluto' => ['bodyType' => 'Dwarf Planet', 'mass' => ['massValue' => 1.303, 'massExponent' => 22], 'meanRadius' => 1188.3, 'gravity' => 0.62, 'avgTemp' => 44, 'semimajorAxis' => 5906380000, 'sideralOrbit' => 90560, 'sideralRotation' => -153.29],
    'Moon' => ['bodyType' => 'Satellite', 'mass' => ['massValue' => 7.342, 'massExponent' => 22], 'meanRadius' => 1737.4, 'gravity' => 1.62, 'avgTemp' => 220, 'semimajorAxis' => 384400, 'sideralOrbit' => 27.322, 'sideralRotation' => 655.72, 'moonCount' => 0],
    'Sun' => ['bodyType' => 'Star', 'mass' => ['massValue' => 1.9885, 'massExponent' => 30], 'meanRadius' => 695700, 'gravity' => 274, 'avgTemp' => 5778, 'sideralRotation' => 609.12, 'moonCount' => 0]
];

$chaveApi = $_SERVER['SOLAR_SYSTEM_API_KEY'] ?? getenv('SOLAR_SYSTEM_API_KEY');

$corpo = null;
$fonte = 'reference';

if (is_string($chaveApi) && trim($chaveApi) !== '') {
    $url = 'https://api.le-systeme-solaire.net/rest/bodies?filter=' .
        rawurlencode('englishName,eq,' . $nomeApi);

    $opcoes = [
        'http' => [
            'method' => 'GET',
            'timeout' => 12,
            'ignore_errors' => true,
            'header' => "Accept: application/json\r\nUser-Agent: SolarSystemConsult/1.0\r\nAuthorization: Bearer " . trim($chaveApi) . "\r\n"
        ]
    ];

    $contexto = stream_context_create($opcoes);
    $resposta = @file_get_contents($url, false, $contexto);

    if ($resposta !== false) {
        $dados = json_decode($resposta, true);

        if (is_array($dados) && isset($dados['bodies'][0]) && is_array($dados['bodies'][0])) {
            $corpo = $dados['bodies'][0];
            $fonte = 'api';
        }
    }
}

if ($corpo === null) {
    $corpo = $referencia[$nomeApi];
    $corpo['englishName'] = $nomeApi;
}

responder(200, ['body' => $corpo, 'source' => $fonte]);
?>
