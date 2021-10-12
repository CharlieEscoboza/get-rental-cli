const cheerio = require('cheerio');
const subDays = require('date-fns/subDays');
const h = require('highland');
const { getHTML } = require('../helpers/rest');
const { buildPath, buildQuery } = require('../helpers/url');
const { PAGE_URL } = process.env;
const { ITEMS_EXCLUSIVE_WORD } = require('../constants');

function builder(yargs) {
  return yargs.options({
    type: {
      alias: 't',
      type: 'array',
      description: 'Type of property to rent. Accept multiple arguments. i.e.: "-t apartamento casa"',
      default: ['apartamentos'],
      choices: ['apartamentos', 'casas']
    },
    city: {
      alias: 'c',
      type: 'string',
      description: 'City where the property to rent is. Accept multiple arguments. i.e.: "-c santiago-de-los-caballeros"',
      default: 'santiago-de-los-caballeros'
    },
    province: {
      alias: 'p',
      type: 'string',
      description: 'Province where the City where the property to rent is. Accept multiple arguments. i.e.: "-p santiago"',
      default: 'santiago'
    },
    lowPrice: {
      alias: 'lp',
      type: 'number',
      description: 'Lowest budget for the property you want to rent',
      default: 9000
    },
    topPrice: {
      alias: 'tp',
      type: 'number',
      description: 'Highest budget for the property you want to rent',
      default: 12000
    },
    lowestRooms: {
      alias: 'r',
      type: 'number',
      description: 'Number minimum of bedrooms the property should have',
      default: 2
    },
    highestRooms: {
      alias: 'r',
      type: 'number',
      description: 'Number maximum of bedrooms the property should have',
      default: 2
    }
  });
}

function getItemsLinks(item) {
  const image = item.find('.item__image');

  return image ? image.attr('href') : null;
}

function getItemsData(html) {
  const $ = cheerio.load(html);
  const items = [];

  $('#items-container').find('.listing__item').each(function (_, node) {
    items.push($(node));
  });

  return items;
}

function getRentalAdPublicationDateTimestamp(html) {
  const $ = cheerio.load(html);
  const publicationDate = ($('.post__details').find('.post__date').text() || '')
    .replace(/(Publicado:\s|de\s)/gmi, '');

  return new Date(publicationDate).getTime() / 1000;

}

function handler(argv) {
  let url;

  return h(argv.type)
    .ratelimit(1, 1000)
    .map(type =>
      `${PAGE_URL}${buildPath(argv, type)}?${buildQuery(argv)}`
    )
    .flatMap(url => h(getHTML(url)))
    .flatMap(html => getItemsData(html))
    .filter((item) => {
      const title = (item.find('.item__title').text() || '').toLowerCase();
      const match = !ITEMS_EXCLUSIVE_WORD.some(word => title.includes(word));

      return match;
    })
    .map(items => getItemsLinks(items))
    .compact()
    .map(link => {
      url = `${PAGE_URL}${link}`;

      return url;
    })
    .ratelimit(1, 1000)
    .flatMap(url => h(getHTML(url)))
    .filter(html => {
      const publishTimestamp = getRentalAdPublicationDateTimestamp(html);
      const currentTimestamp = ~~(+ new Date() / 1000);
      const yesterdayTimestamp = new Date(subDays(new Date(), 5)).getTime() / 1000;

      return publishTimestamp <= currentTimestamp && publishTimestamp >= yesterdayTimestamp;
    })
    .each(() => console.log(`${url}\n\n`))
}

module.exports = {
  command: 'get-rental',
  desc: 'Get rental properties',
  builder,
  handler
}
