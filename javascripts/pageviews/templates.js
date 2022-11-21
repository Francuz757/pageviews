/**
 * Templates used by Chart.js in the Pageviews application.
 * Functions used within our app must be in the global scope.
 * All quotations must be double-quotes or properly escaped.
 * @type {Object}
 */
const templates = {
  chartLegend(scope) {
    const dataList = (entity, multiEntity = false) => {
      let editsLink;

      if (!$.isNumeric(entity.num_edits)) {
        $('.legend-block--revisions .legend-block--body').html(
          `<span class='text-muted'>${$.i18n('data-unavailable')}</span>`
        );
      }

      if (multiEntity) {
        editsLink = scope.formatNumber(entity.num_edits);
      } else {
        const [, endDate] = scope.getDates();

        editsLink = scope.getHistoryLink(
          entity.label,
          scope.formatNumber(entity.num_edits),
          scope.isMonthly() ? endDate.endOf('month') : endDate,
          entity.num_edits
        );
      }

      // cache basic info message
      const basicInfoMsg = $.i18n('basic-information');

      let pageviewsHash = {
        [$.i18n('pageviews')]: scope.formatNumber(entity.sum)
      };

      // If there's a spike in pageviews show the median.
      if (scope.shouldBeLogarithmic(scope.outputData.map(set => set.data))) {
        pageviewsHash[$.i18n('median')] = scope.formatNumber(entity.median);
      }

      pageviewsHash[$.i18n(`${$('#date-type-select').val()}-average`)] = scope.formatNumber(entity.average);

      let infoHash = {
        [$.i18n('pageviews')]: pageviewsHash,
        [$.i18n('revisions')]: {
          [$.i18n('edits')]: editsLink,
          [$.i18n('editors')]: scope.formatNumber(entity.num_users)
        },
        [basicInfoMsg]: {
          [$.i18n('watchers')]: entity.watchers ? scope.formatNumber(entity.watchers) : $.i18n('unknown'),
          [$.i18n('size')]: entity.length ? scope.formatNumber(entity.length) : ''
        }
      };

      if (!multiEntity) {
        const assessmentNode = entity.assessment ? `${scope.getAssessmentBadge(entity)}  ${entity.assessment.upcase()}` : '';
        Object.assign(infoHash[basicInfoMsg], {
          [$.i18n('protection')]: entity.protection,
          [$.i18n('class')]: assessmentNode
        });
      }

      let markup = '';

      for (let block in infoHash) {
        const blockId = block.toLowerCase().score();
        markup += `<div class='legend-block legend-block--${blockId}'>
          <h5>${block}</h5><hr/>
          <div class='legend-block--body'>`;
        for (let key in infoHash[block]) {
          const value = infoHash[block][key];
          if (!value) continue;
          markup += `
            <div class="linear-legend--counts">
              ${key}:
              <span class='pull-right'>
                ${value}
              </span>
            </div>`;
        }
        markup += '</div></div>';
      }

      if (!multiEntity) {
        markup += `
          <div class="linear-legend--links">
            <a href="${scope.getLangviewsURL(entity.label)}" target="_blank">${$.i18n('all-languages')}</a>
            &bullet;
            <a href="${scope.getRedirectviewsURL(entity.label)}" target="_blank">${$.i18n('redirects')}</a>
          </div>`;
      }

      return markup;
    };

    if (scope.outputData.length === 1) {
      return dataList(scope.outputData[0]);
    }

    const sum = scope.outputData.reduce((a,b) => a + b.sum, 0);

    // Get overall median.
    let summedDataset = new Array(scope.outputData[0].data.length).fill(0);
    scope.outputData.forEach(dataset => {
      dataset.data.forEach((val, index) => {
        summedDataset[index] += val;
      });
    });
    const median = scope.getMedian(summedDataset);

    const totals = {
      sum,
      median,
      average: Math.round(sum / (scope.outputData[0].data.filter(el => el !== null)).length),
      num_edits: scope.entityInfo.totals ? scope.entityInfo.totals.num_edits : null,
      num_users: scope.entityInfo.totals ? scope.entityInfo.totals.num_users : null,
      watchers: scope.outputData.reduce((a, b) => a + b.watchers || 0, 0),
      length: scope.outputData.reduce((a, b) => a + b.length, 0)
    };

    return dataList(totals, true);
  },

  tableRow(scope, item, last = false) {
    const tag = last ? 'th' : 'td';
    const linksRow = last ? '' : `
        <a href="${scope.getLangviewsURL(item.label)}" target="_blank">${$.i18n('all-languages')}</a>
        &bull;
        <a href="${scope.getRedirectviewsURL(item.label)}" target="_blank">${$.i18n('redirects')}</a>
      `;
    const numUsers = $.isNumeric(item.num_users) ? scope.formatNumber(item.num_users) : '?';
    let historyRow;

    if ($.isNumeric(item.num_edits)) {
      const getHistoryLink = () => {
        const [, endDate] = scope.getDates();

        return scope.getHistoryLink(
          item.label,
          scope.formatNumber(item.num_edits),
          scope.isMonthly() ? endDate.endOf('month') : endDate,
          item.num_edits
        );
      };

      historyRow = last ? scope.formatNumber(item.num_edits) : getHistoryLink();
    } else {
      historyRow = '?';
    }

    $('.table-view--average .col-heading').text(
      $.i18n(`${$('#date-type-select').val()}-average`)
    );

    return `
      <tr>
        <${tag} class='table-view--color-col'>
          <span class='table-view--color-block' style="background:${item.color}"></span>
        </${tag}>
        <${tag} class='table-view--title'>${last ? item.label : scope.getPageLink(item.label)}</${tag}>
        <${tag} class='table-view--class'>${scope.getAssessmentBadge(item)}</${tag}>
        <${tag} class='table-view--views'>${scope.formatNumber(item.sum)}</${tag}>
        <${tag} class='table-view--average'>${scope.formatNumber(item.average)}</${tag}>
        <${tag} class='table-view-edits table-view--edit-data'>${historyRow}</${tag}>
        <${tag} class='table-view-editors table-view--edit-data'>${numUsers}</${tag}>
        <${tag} class='table-view--size'>${item.length ? scope.formatNumber(item.length) : '?'}</${tag}>
        <${tag} class='table-view--protection'>${item.protection}</${tag}>
        <${tag} class='table-view--watchers'>${item.watchers ? scope.formatNumber(item.watchers) : $.i18n('unknown')}</${tag}>
        <${tag}>${linksRow}</${tag}>
      </tr>
    `;
  }
};

module.exports = templates;
