function _log(message) {
    // TODO - uncomment this when deploying
    // return;

    console.log(message);
}

// Initialize mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoidGltb25lYWwiLCJhIjoiY2xjZm04YW5yMGFnYTNvcG1pZTNicGU2diJ9.eYwXLLfgApOlhZbiYYTWAA';

var clickedID = null;
let popup = null;

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/timoneal/clgf75tew00ch01mk1b0zwb1g',
    projection: 'mercator',
    zoom: 6.5,
    center: [-120.8, 47.6],
    maxZoom: 17,
    minZoom: 2
});

map.on('mouseenter', 'selectedLayer', function () {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'selectedLayer', function () {
    map.getCanvas().style.cursor = '';
});

map.on('click', 'selectedLayer', (e) => {
    _log(e);

    if (popup !== null) {
        popup.remove();
        popup = null;
    }

    const label = e.features[0].properties.Title;
    const totalVotes = e.features[0].properties.Votes_total;
    const precinct = e.features[0].properties.Precinct;

    const candidate1 = e.features[0].properties.Name_1;
    const party1 = e.features[0].properties.Party_1;
    const rank1 = e.features[0].properties.Rank_1;
    const votes1 = e.features[0].properties.Votes_1;
    const pct1 = Math.round(e.features[0].properties.Pct_1 * 100) / 100;

    const candidate2 = e.features[0].properties.Name_2;
    const party2 = e.features[0].properties.Party_2;
    const rank2 = e.features[0].properties.Rank_2;
    const votes2 = e.features[0].properties.Votes_2;
    const pct2 = Math.round(e.features[0].properties.Pct_2 * 100) / 100;

    const candidate3 = e.features[0].properties.Name_3;
    const party3 = e.features[0].properties.Party_3;
    const rank3 = e.features[0].properties.Rank_3;
    const votes3 = e.features[0].properties.Votes_3;
    const pct3 = Math.round(e.features[0].properties.Pct_3 * 100) / 100;

    const candidate4 = e.features[0].properties.Name_4;
    const party4 = e.features[0].properties.Party_4;
    const rank4 = e.features[0].properties.Rank_4;
    const votes4 = e.features[0].properties.Votes_4;
    const pct4 = Math.round(e.features[0].properties.Pct_4 * 100) / 100;

    const candidate5 = e.features[0].properties.Name_5;
    const party5 = e.features[0].properties.Party_5;
    const rank5 = e.features[0].properties.Rank_5;
    const votes5 = e.features[0].properties.Votes_5;
    const pct5 = Math.round(e.features[0].properties.Pct_5 * 100) / 100;

    const candidate6 = e.features[0].properties.Name_6;
    const party6 = e.features[0].properties.Party_6;
    const rank6 = e.features[0].properties.Rank_6;
    const votes6 = e.features[0].properties.Votes_6;
    const pct6 = Math.round(e.features[0].properties.Pct_6 * 100) / 100;

    let message;

    if (candidate1 == null) {
        message =
            '<h2>' + label + '</h2>'
            + '<p>No data available</p>';
    } else if (precinct !== undefined) {
        message =
            '<h1>' + label + '</h1>'
            + '<table class="table1">'
            + '<tr><th>ID</th><th>CANDIDATE</th><th>PARTY</th><th>VOTES</th><th>PERCENT</th></tr>'
            + createTableRow(candidate1, party1, rank1, votes1, pct1)
            + createTableRow(candidate2, party2, rank2, votes2, pct2)
            + createTableRow(candidate3, party3, rank3, votes3, pct3)
            + createTableRow(candidate4, party4, rank4, votes4, pct4)
            + createTableRow(candidate5, party5, rank5, votes5, pct5)
            + createTableRow(candidate6, party6, rank6, votes6, pct6)
            + '</table>'
            + '<p>  Total votes: ' + totalVotes + '</p>';
    } else {
            message =
                '<h1>' + label + '</h1>'
                + '<table class="table1">'
                + '<tr><th>ID</th><th>CANDIDATE</th><th>PARTY</th><th>VOTES</th><th>PERCENT</th></tr>'
                + createTableRow(candidate1, party1, rank1, votes1, pct1)
                + createTableRow(candidate2, party2, rank2, votes2, pct2)
                + createTableRow(candidate3, party3, rank3, votes3, pct3)
                + createTableRow(candidate4, party4, rank4, votes4, pct4)
                + createTableRow(candidate5, party5, rank5, votes5, pct5)
                + createTableRow(candidate6, party6, rank6, votes6, pct6)
                + '</table>'
                + '<p>  Total votes: ' + totalVotes + '</p>';
        }

    // Create popup
    popup = new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(message)
        .addTo(map);
});

function createTableRow(candidate, party, rank, votes, percent) {
    if (!candidate) return '';

    const rankColors = {
        1: '#f68f3e',
        2: '#119f92',
        3: '#868fba',
        4: '#fac566',
        5: '#4f93ba',
        6: '#cf635d',
    };

    const rankColor = rankColors[rank] || '#999999'; // Default color if party is not found in the mapping

    return '<tr>'
        + '<td>' + '  ' + '<div class="rank-square" style="background-color:' + rankColor + '"></div>' + '</td>'
        + '<td>' + candidate + '</td>'
        + '<td>' + party + '</td>'
        + '<td>' + votes + '</td>'
        + '<td>' + percent + '%</td>'
        + '</tr>';
}


// Convert the tree data to dropdown menu format
function convertToDropdownFormat(treeData) {
    if (!treeData || !treeData.items) return [];

    return treeData.items.map(item => {
        const children = convertToDropdownFormat(item);
        return {
            value: item.title,
            children
        };
    });
}

let selectedFirstValue = '';
let selectedSecondValue = '';
let selectedThirdValue = '';

fetch('Data/data.json')
    .then(response => response.json())
    .then(treeData => {
        // Convert treeData to dropdown format
        const dropdownData = convertToDropdownFormat(treeData);

        // Populate the first dropdown menu
        const firstDropdown = document.getElementById('first-dropdown');
        const firstDefaultOption = document.createElement('option');
        firstDefaultOption.value = '';
        firstDefaultOption.textContent = 'Select year';
        firstDropdown.appendChild(firstDefaultOption);

        dropdownData.forEach(item => {
            const option = document.createElement('option');
            option.value = item.value;
            option.textContent = item.value;
            firstDropdown.appendChild(option);
        });

        // Update the second dropdown menu when the first dropdown selection changes
        firstDropdown.addEventListener('change', () => {
            const secondDropdown = document.getElementById('second-dropdown');
            selectedFirstValue = firstDropdown.value; // Update selectedFirstValue
            const selectedFirstItem = dropdownData.find(item => item.value === selectedFirstValue);
            secondDropdown.innerHTML = ''; // Clear the previous options

            const secondDefaultOption = document.createElement('option');
            secondDefaultOption.value = '';
            secondDefaultOption.textContent = 'Select position';
            secondDropdown.appendChild(secondDefaultOption);

            if (selectedFirstItem && selectedFirstItem.children) {
                selectedFirstItem.children.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.value;
                    option.textContent = item.value;
                    secondDropdown.appendChild(option);
                });
            }
        });

        // Update the third dropdown menu when the second dropdown selection changes
        const secondDropdown = document.getElementById('second-dropdown');
        secondDropdown.addEventListener('change', () => {
            const thirdDropdown = document.getElementById('third-dropdown');
            selectedSecondValue = secondDropdown.value; // Update selectedSecondValue
            const selectedFirstItem = dropdownData.find(item => item.value === selectedFirstValue);
            const selectedSecondItem = selectedFirstItem && selectedFirstItem.children
                ? selectedFirstItem.children.find(item => item.value === selectedSecondValue)
                : null;
            thirdDropdown.innerHTML = ''; // Clear the previous options

            const thirdDefaultOption = document.createElement('option');
            thirdDefaultOption.value = '';
            thirdDefaultOption.textContent = 'Select layer';
            thirdDropdown.appendChild(thirdDefaultOption);

            if (selectedSecondItem && selectedSecondItem.children) {
                selectedSecondItem.children.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.value;
                    option.textContent = item.value;
                    thirdDropdown.appendChild(option);
                });
            }
        });

        // Call the layerSelected function when the third dropdown selection changes
        const thirdDropdown = document.getElementById('third-dropdown');
        thirdDropdown.addEventListener('change', () => {
            const selectedThirdValue = thirdDropdown.value;

            // Generate the selected path
            const path = selectedFirstValue + '/' + selectedSecondValue + '/' + selectedThirdValue;

            // Close the popup if it is open
            if (popup !== null) {
                popup.remove();
                popup = null;
            }

            // Call the layerSelected function with the selected path
            layerSelected(path);
            return selectedThirdValue;
        });
    });


// Function to load and display the GeoJSON file
// this is agnostic, as long as it receives the absolute path to the GeoJSON file,
function layerSelected(path) {
    _log(`Loading ${path}...`);

    if (
        map.getLayer('selectedLayer')) {
        map.removeLayer('selectedLayer');
        map.removeLayer('selectedLayerOutline');
        map.removeSource('selectedLayer');
    }

    const layers = map.getStyle().layers;
    let firstSymbolId;
    for (const layer of layers) {
        if (layer.type === 'symbol') {
            firstSymbolId = layer.id;
            break;
        }
    };

    map.addSource('selectedLayer', {
        type: 'geojson',
        data: '/WashingtonPrimaryDashboard/Data/' + path + '.geojson'  // uncomment to publish
        // data: '/Data/' + path + '.geojson'               // uncomment to debug
    });

    map.addLayer({
        id: 'selectedLayerOutline',
        type: 'line',
        source: 'selectedLayer',
        layout: {},
        paint: {
            'line-color': '#595959',
            'line-width': 1.25
        }
    });

    map.addLayer({
        id: 'selectedLayer',
        type: 'fill',
        source: 'selectedLayer',
        layout: {},
        paint: {
            'fill-color': [         // fill polygon based on 1st place candidate's party
                'match',
                ['get', 'Rank_1'],
                1, '#f68f3e',
                2, '#119f92',
                3, '#868fba',
                4, '#fac566',
                5, '#4f93ba',
                6, '#cf635d',
                'transparent'
            ],
            'fill-opacity': [       // set fill opacity to margin b/w 1st and 2nd place candidates
                'step',
                ['get', 'Margin'],
                0.2, 5,
                0.3, 10,
                0.4, 15,
                0.5, 20,
                0.6, 25,
                0.7, 30,
                0.8, 101,
                0
            ]
        }
    },
        firstSymbolId);
}


var currentLayer = null;

function loadGeoJSONLayer(url) {
    if (currentLayer) {
        map.removeLayer(currentLayer);
        map.removeSource(currentLayer);
    }

    if (url) {
        map.addSource('dynamic-layer', {
            type: 'geojson',
            data: url
        });

        map.addLayer({
            id: 'dynamic-layer',
            type: 'line',
            source: 'dynamic-layer',
            paint: {
                'line-color': '#595959',
                'line-width': 1.5
            }
        });

        currentLayer = 'dynamic-layer';

        // Move the dynamic layer to the top
        map.moveLayer('dynamic-layer');
    }
}


var layerDropdown = document.getElementById('extras-dropdown');
layerDropdown.addEventListener('change', function () {
    var selectedLayer = layerDropdown.value;
    loadGeoJSONLayer(selectedLayer);
});



const menuToggle = document.getElementById('menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', function () {
    menu.classList.toggle('menu-visible');

    // Toggle the "plus" and "minus" icons
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-minus');
    icon.classList.toggle('fa-plus');
});