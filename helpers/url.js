const queryString = require('query-string');

function buildPath({ province, city }, type) {
  return `/sl/${province}/${city}/sc/inmuebles-en-alquiler/${type}`;
}

function buildQuery({ lowPrice, topPrice, lowestRooms, highestRooms }) {

  return queryString.stringify({
    "q[c][bathrooms_quantity_max][a][0][name]": "j_typed_property",
    "q[c][bathrooms_quantity_max][a][0][ransacker_args][]_key_prop": "bathrooms_quantity",
    "q[c][bathrooms_quantity_max][a][0][ransacker_args][]_key_type": "integer",
    "q[c][bathrooms_quantity_max][p]": "lteq",
    "q[c][bathrooms_quantity_max][v][]": "",
    "q[c][bathrooms_quantity_min][a][0][name]": "j_typed_property",
    "q[c][bathrooms_quantity_min][a][0][ransacker_args][]_key_prop": "bathrooms_quantity",
    "q[c][bathrooms_quantity_min][a][0][ransacker_args][]_key_type": "integer",
    "q[c][bathrooms_quantity_min][p]": "gteq",
    "q[c][bathrooms_quantity_min][v][]": "",
    "q[c][build_square_meters_max][a][0][name]": "j_typed_property",
    "q[c][build_square_meters_max][a][0][ransacker_args][]_key_prop": "build_square_meters",
    "q[c][build_square_meters_max][a][0][ransacker_args][]_key_type": "integer",
    "q[c][build_square_meters_max][p]": "lteq",
    "q[c][build_square_meters_max][v][]": "",
    "q[c][build_square_meters_min][a][0][name]": "j_typed_property",
    "q[c][build_square_meters_min][a][0][ransacker_args][]_key_prop": "build_square_meters",
    "q[c][build_square_meters_min][a][0][ransacker_args][]_key_type": "integer",
    "q[c][build_square_meters_min][p]": "gteq",
    "q[c][build_square_meters_min][v][]": "",
    "q[c][property_type][a][0][name]": "j_typed_property",
    "q[c][property_type][a][0][ransacker_args][]_key_prop": "property_type",
    "q[c][property_type][a][0][ransacker_args][]_key_type": "varchar",
    "q[c][property_type][p]": "eq_any",
    "q[c][rooms_quantity_max][a][0][name]": "j_typed_property",
    "q[c][rooms_quantity_max][a][0][ransacker_args][]_key_prop": "rooms_quantity",
    "q[c][rooms_quantity_max][a][0][ransacker_args][]_key_type": "integer",
    "q[c][rooms_quantity_max][p]": "lteq",
    "q[c][rooms_quantity_max][v][]": highestRooms || '',
    "q[c][rooms_quantity_min][a][0][name]": "j_typed_property",
    "q[c][rooms_quantity_min][a][0][ransacker_args][]_key_prop": "rooms_quantity",
    "q[c][rooms_quantity_min][a][0][ransacker_args][]_key_type": "integer",
    "q[c][rooms_quantity_min][p]": "gteq",
    "q[c][rooms_quantity_min][v][]": lowestRooms || '',
    "q[price_gteq]": lowPrice || '',
    "q[price_lteq]": topPrice || ''
  })
    .replace(/_key_prop/gmi, '')
    .replace(/_key_type/gmi, '');
}

module.exports = {
  buildPath,
  buildQuery
};
