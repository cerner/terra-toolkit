const requireNoTerraBasePeerDependencyVersions = require('../../../src/rules/require-no-terra-base-peer-dependency-versions');

describe('require-no-terra-base-peer-dependency-versions', () => {
  it('succeeds when there are no dependencies', () => {
    const results = requireNoTerraBasePeerDependencyVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'error',
        },
      },
      projectType: 'module',
    }).dependencies({});
    expect(results).toMatchSnapshot();
  });

  it('succeeds when there are dependencies not in the list to check', () => {
    const results = requireNoTerraBasePeerDependencyVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'error',
        },
      },
      projectType: 'module',
    }).dependencies({
      a: '^1.0.0',
    });
    expect(results).toMatchSnapshot();
  });

  it('fails as a warning when versions do not meet the required version', () => {
    let results;
    requireNoTerraBasePeerDependencyVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'warn',
        },
      },
      projectType: 'module',
      report: (issues) => {
        results = issues;
      },
    }).dependencies({
      'terra-action-footer': '^1.0.0',
    });
    expect(results).toMatchSnapshot();
  });

  it('fails when versions do not meet the required version', () => {
    let results;
    requireNoTerraBasePeerDependencyVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'error',
        },
      },
      projectType: 'devModule',
      report: (issues) => {
        results = issues;
      },
    }).dependencies({
      'terra-action-footer': '2.5.0',
      'terra-action-header': '2.8.0',
      'terra-aggregator': '4.6.0',
      'terra-alert': '3.8.0',
      'terra-arrange': '3.5.0',
      'terra-avatar': '2.11.0',
      'terra-badge': '3.7.0',
      'terra-brand-footer': '2.3.0',
      'terra-button-group': '3.7.0',
      'terra-button': '3.7.0',
      'terra-card': '3.4.0',
      'terra-clinical-data-grid': '2.3.0',
      'terra-clinical-detail-view': '3.3.0',
      'terra-clinical-header': '3.2.0',
      'terra-clinical-item-display': '3.2.0',
      'terra-clinical-item-view': '3.2.0',
      'terra-clinical-label-value-view': '3.3.0',
      'terra-clinical-onset-picker': '4.0.0',
      'terra-collapsible-menu-view': '5.4.0',
      'terra-content-container': '3.5.0',
      'terra-date-picker': '3.9.0',
      'terra-date-time-picker': '3.10.0',
      'terra-demographics-banner': '3.6.0',
      'terra-dialog-modal': '2.6.0',
      'terra-disclosure-manager': '4.1.0',
      'terra-divider': '3.4.0',
      'terra-dynamic-grid': '3.4.0',
      'terra-embedded-content-consumer': '3.1.0',
      'terra-form-checkbox': '3.6.0',
      'terra-form-field': '3.5.0',
      'terra-form-fieldset': '2.8.0',
      'terra-form-input': '2.7.0',
      'terra-form-radio': '3.7.0',
      'terra-form-select': '5.10.0',
      'terra-form-textarea': '3.7.0',
      'terra-grid': '5.6.0',
      'terra-heading': '4.1.0',
      'terra-hookshot': '5.4.0',
      'terra-hyperlink': '2.6.0',
      'terra-icon': '3.5.0',
      'terra-image': '3.4.0',
      'terra-infinite-list': '3.0.0',
      'terra-list': '4.2.0',
      'terra-menu': '5.4.0',
      'terra-modal-manager': '5.6.0',
      'terra-notification-dialog': '2.6.0',
      'terra-overlay': '3.7.0',
      'terra-paginator': '2.8.0',
      'terra-popup': '5.6.0',
      'terra-profile-image': '3.4.0',
      'terra-progress-bar': '4.1.0',
      'terra-responsive-element': '4.4.0',
      'terra-scroll': '2.4.0',
      'terra-search-field': '3.7.0',
      'terra-section-header': '2.7.0',
      'terra-show-hide': '2.6.0',
      'terra-signature': '2.8.0',
      'terra-slide-group': '3.1.0',
      'terra-slide-panel-manager': '4.6.0',
      'terra-slide-panel': '3.1.0',
      'terra-spacer': '3.5.0',
      'terra-status-view': '3.8.0',
      'terra-status': '4.1.0',
      'terra-table': '3.7.0',
      'terra-tabs': '5.4.0',
      'terra-tag': '2.7.0',
      'terra-text': '4.1.0',
      'terra-theme-provider': '3.1.0',
      'terra-time-input': '3.5.0',
      'terra-toggle-button': '3.5.0',
      'terra-toggle-section-header': '2.5.0',
      'terra-toggle': '3.5.0',
      'terra-visually-hidden-text': '2.4.0',
    });
    expect(results).toMatchSnapshot();
  });

  it('passes when all versions meet the required version', () => {
    const results = requireNoTerraBasePeerDependencyVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'error',
        },
      },
      projectType: 'module',
    }).dependencies({
      'terra-action-footer': '^2.6.0',
      'terra-action-header': '^2.9.0',
      'terra-aggregator': '^4.7.0',
      'terra-alert': '^3.9.0',
      'terra-arrange': '^3.6.0',
      'terra-avatar': '^2.12.0',
      'terra-badge': '^3.8.0',
      'terra-brand-footer': '^2.4.0',
      'terra-button-group': '^3.8.0',
      'terra-button': '^3.8.0',
      'terra-card': '^3.5.0',
      'terra-clinical-data-grid': '^2.4.0',
      'terra-clinical-detail-view': '^3.4.0',
      'terra-clinical-header': '^3.3.0',
      'terra-clinical-item-display': '^3.3.0',
      'terra-clinical-item-view': '^3.3.0',
      'terra-clinical-label-value-view': '^3.4.0',
      'terra-clinical-onset-picker': '^4.1.0',
      'terra-collapsible-menu-view': '^5.5.0',
      'terra-content-container': '^3.6.0',
      'terra-date-picker': '^3.10.0',
      'terra-date-time-picker': '^3.11.0',
      'terra-demographics-banner': '^3.7.0',
      'terra-dialog-modal': '^2.7.0',
      'terra-disclosure-manager': '^4.2.0',
      'terra-divider': '^3.5.0',
      'terra-dynamic-grid': '^3.5.0',
      'terra-embedded-content-consumer': '^3.2.0',
      'terra-form-checkbox': '^3.7.0',
      'terra-form-field': '^3.6.0',
      'terra-form-fieldset': '^2.9.0',
      'terra-form-input': '^2.8.0',
      'terra-form-radio': '^3.8.0',
      'terra-form-select': '^5.11.0',
      'terra-form-textarea': '^3.8.0',
      'terra-grid': '^5.7.0',
      'terra-heading': '^4.2.0',
      'terra-hookshot': '^5.5.0',
      'terra-hyperlink': '^2.7.0',
      'terra-icon': '^3.6.0',
      'terra-image': '^3.5.0',
      'terra-infinite-list': '^3.1.0',
      'terra-list': '^4.3.0',
      'terra-menu': '^5.5.0',
      'terra-modal-manager': '^5.7.0',
      'terra-notification-dialog': '^2.7.0',
      'terra-overlay': '^3.8.0',
      'terra-paginator': '^2.9.0',
      'terra-popup': '^5.7.0',
      'terra-profile-image': '^3.5.0',
      'terra-progress-bar': '^4.2.0',
      'terra-responsive-element': '^4.5.0',
      'terra-scroll': '^2.5.0',
      'terra-search-field': '^3.8.0',
      'terra-section-header': '^2.8.0',
      'terra-show-hide': '^2.7.0',
      'terra-signature': '^2.9.0',
      'terra-slide-group': '^3.2.0',
      'terra-slide-panel-manager': '^4.7.0',
      'terra-slide-panel': '^3.2.0',
      'terra-spacer': '^3.6.0',
      'terra-status-view': '^3.9.0',
      'terra-status': '^4.2.0',
      'terra-table': '^3.8.0',
      'terra-tabs': '^5.5.0',
      'terra-tag': '^2.8.0',
      'terra-text': '^4.2.0',
      'terra-theme-provider': '^3.2.0',
      'terra-time-input': '^3.6.0',
      'terra-toggle-button': '^3.6.0',
      'terra-toggle-section-header': '^2.6.0',
      'terra-toggle': '^3.6.0',
      'terra-visually-hidden-text': '^2.5.0',
    });
    expect(results).toMatchSnapshot();
  });

  it('succeeds when versions do not meet the required version but package is passed in allowList', () => {
    const results = requireNoTerraBasePeerDependencyVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'error',
          allowList: ['terra-action-footer'],
        },
      },
      projectType: 'module',
    }).dependencies({
      'terra-action-footer': '^1.0.0',
    });
    expect(results).toMatchSnapshot();
  });
});
