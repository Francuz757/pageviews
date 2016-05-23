/**
 * @file Configuration for Massviews application
 * @author MusikAnimal
 * @copyright 2016 MusikAnimal
 */

/**
 * Configuration for Massviews application.
 * This includes selectors, defaults, and other constants specific to Massviews
 * @type {Object}
 */
const config = {
  agentSelector: '#agent_select',
  chart: '.aqs-chart',
  dateRangeSelector: '#range_input',
  defaults: {
    dateRange: 'latest-20',
    project: 'en.wikipedia.org',
    params: {
      sort: 'original',
      source: 'category',
      sourceProject: '',
      direction: -1,
      massData: [],
      total: 0,
      view: 'list'
    }
  },
  linearLegend: `
    <strong><%= $.i18n('totals') %>:</strong>
    <%= formatNumber(chartData.sum) %> (<%= formatNumber(Math.round(chartData.average)) %>/<%= $.i18n('day') %>)
  `,
  pageLimit: 500,
  placeholders: {
    category: 'https://en.wikipedia.org/wiki/Category:Folk_musicians_from_New_York',
    pagepile: '12345'
  },
  platformSelector: '#platform_select',
  sourceButton: '#source_button',
  sourceInput: '#source_input',
  formStates: ['initial', 'processing', 'complete', 'invalid'],
  timestampFormat: 'YYYYMMDD00',
  validParams: {
    direction: ['-1', '1'],
    sort: ['title', 'views', 'original'],
    source: ['pagepile', 'category'],
    view: ['list', 'chart']
  }
};

module.exports = config;