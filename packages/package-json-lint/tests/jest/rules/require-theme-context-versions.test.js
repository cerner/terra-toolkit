const requireThemeContextVersions = require('../../../src/rules/require-theme-context-versions');

describe('require-theme-context-versions', () => {
  it('succeeds when there are no dependencies', () => {
    const results = requireThemeContextVersions.create({
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
    const results = requireThemeContextVersions.create({
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
    requireThemeContextVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'warning',
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
    requireThemeContextVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'error',
        },
      },
      projectType: 'module',
      report: (issues) => {
        results = issues;
      },
    }).dependencies({
      '@cerner/terra-docs': '<1.0.0',
      'terra-abstract-modal': '<3.25.0',
      'terra-action-footer': '<2.42.0',
      'terra-action-header': '<2.43.0',
      'terra-alert': '<4.29.0',
      'terra-application-header-layout': '<3.28.0',
      'terra-application-links': '<6.34.0',
      'terra-application-name': '<3.30.0',
      'terra-application-navigation': '<1.37.0',
      'terra-application-utility': '<2.35.0',
      'terra-application': '<1.19.0',
      'terra-avatar': '<3.3.0',
      'terra-badge': '<3.35.0',
      'terra-brand-footer': '<2.24.0',
      'terra-button-group': '<3.39.0',
      'terra-button': '<3.36.0',
      'terra-card': '<3.27.0',
      'terra-cell-grid': '<1.5.0',
      'terra-clinical-data-grid': '<2.25.0',
      'terra-clinical-detail-view': '<3.20.0',
      'terra-clinical-header': '<3.16.0',
      'terra-clinical-item-display': '<3.18.0',
      'terra-clinical-item-view': '<3.19.0',
      'terra-clinical-label-value-view': '<3.20.0',
      'terra-clinical-onset-picker': '<4.21.0',
      'terra-collapsible-menu-view': '<6.34.0',
      'terra-date-input': '<1.14.0',
      'terra-date-picker': '<4.38.0',
      'terra-date-time-picker': '<4.38.0',
      'terra-demographics-banner': '<3.37.0',
      'terra-dialog-modal': '<3.38.0',
      'terra-dialog': '<2.42.0',
      'terra-divider': '<3.27.0',
      'terra-dropdown-button': '<1.14.0',
      'terra-form-checkbox': '<4.3.0',
      'terra-form-field': '<4.3.0',
      'terra-form-fieldset': '<2.42.0',
      'terra-form-input': '<3.5.0',
      'terra-form-radio': '<4.5.0',
      'terra-form-select': '<6.6.0',
      'terra-form-textarea': '<4.5.0',
      'terra-grid': '<6.21.0',
      'terra-html-table': '<1.6.0',
      'terra-hyperlink': '<2.34.0',
      'terra-icon': '<3.32.0',
      'terra-image': '<3.28.0',
      'terra-layout': '<4.24.0',
      'terra-list': '<4.31.0',
      'terra-menu': '<6.34.0',
      'terra-modal-manager': '<6.34.0',
      'terra-navigation-side-menu': '<2.31.0',
      'terra-notification-dialog': '<3.35.0',
      'terra-overlay': '<3.49.0',
      'terra-paginator': '<2.51.0',
      'terra-popup': '<6.35.0',
      'terra-profile-image': '<3.30.0',
      'terra-progress-bar': '<4.23.0',
      'terra-search-field': '<3.51.0',
      'terra-section-header': '<2.37.0',
      'terra-show-hide': '<2.35.0',
      'terra-signature': '<2.30.0',
      'terra-slide-group': '<4.21.0',
      'terra-slide-panel': '<3.27.0',
      'terra-spacer': '<3.40.0',
      'terra-status-view': '<4.27.0',
      'terra-switch': '<1.0.0',
      'terra-table': '<4.8.0',
      'terra-tabs': '<6.35.0',
      'terra-tag': '<2.35.0',
      'terra-text': '<4.31.0',
      'terra-time-input': '<4.29.0',
      'terra-toolbar': '<1.8.0',
    });
    expect(results).toMatchSnapshot();
  });

  it('passes when all versions meet the required version', () => {
    const results = requireThemeContextVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'error',
        },
      },
      projectType: 'module',
    }).dependencies({
      '@cerner/terra-docs': '^1.0.0',
      'terra-abstract-modal': '^3.25.0',
      'terra-action-footer': '^2.42.0',
      'terra-action-header': '^2.43.0',
      'terra-alert': '^4.29.0',
      'terra-application-header-layout': '^3.28.0',
      'terra-application-links': '^6.34.0',
      'terra-application-name': '^3.30.0',
      'terra-application-navigation': '^1.37.0',
      'terra-application-utility': '^2.35.0',
      'terra-application': '^1.19.0',
      'terra-avatar': '^3.3.0',
      'terra-badge': '^3.35.0',
      'terra-brand-footer': '^2.24.0',
      'terra-button-group': '^3.39.0',
      'terra-button': '^3.36.0',
      'terra-card': '^3.27.0',
      'terra-cell-grid': '^1.5.0',
      'terra-clinical-data-grid': '^2.25.0',
      'terra-clinical-detail-view': '^3.20.0',
      'terra-clinical-header': '^3.16.0',
      'terra-clinical-item-display': '^3.18.0',
      'terra-clinical-item-view': '^3.19.0',
      'terra-clinical-label-value-view': '^3.20.0',
      'terra-clinical-onset-picker': '^4.21.0',
      'terra-collapsible-menu-view': '^6.34.0',
      'terra-date-input': '^1.14.0',
      'terra-date-picker': '^4.38.0',
      'terra-date-time-picker': '^4.38.0',
      'terra-demographics-banner': '^3.37.0',
      'terra-dialog-modal': '^3.38.0',
      'terra-dialog': '^2.42.0',
      'terra-divider': '^3.27.0',
      'terra-dropdown-button': '^1.14.0',
      'terra-form-checkbox': '^4.3.0',
      'terra-form-field': '^4.3.0',
      'terra-form-fieldset': '^2.42.0',
      'terra-form-input': '^3.5.0',
      'terra-form-radio': '^4.5.0',
      'terra-form-select': '^6.6.0',
      'terra-form-textarea': '^4.5.0',
      'terra-grid': '^6.21.0',
      'terra-html-table': '^1.6.0',
      'terra-hyperlink': '^2.34.0',
      'terra-icon': '^3.32.0',
      'terra-image': '^3.28.0',
      'terra-layout': '^4.24.0',
      'terra-list': '^4.31.0',
      'terra-menu': '^6.34.0',
      'terra-modal-manager': '^6.34.0',
      'terra-navigation-side-menu': '^2.31.0',
      'terra-notification-dialog': '^3.35.0',
      'terra-overlay': '^3.49.0',
      'terra-paginator': '^2.51.0',
      'terra-popup': '^6.35.0',
      'terra-profile-image': '^3.30.0',
      'terra-progress-bar': '^4.23.0',
      'terra-search-field': '^3.51.0',
      'terra-section-header': '^2.37.0',
      'terra-show-hide': '^2.35.0',
      'terra-signature': '^2.30.0',
      'terra-slide-group': '^4.21.0',
      'terra-slide-panel': '^3.27.0',
      'terra-spacer': '^3.40.0',
      'terra-status-view': '^4.27.0',
      'terra-switch': '^1.0.0',
      'terra-table': '^4.8.0',
      'terra-tabs': '^6.35.0',
      'terra-tag': '^2.35.0',
      'terra-text': '^4.31.0',
      'terra-time-input': '^4.29.0',
      'terra-toolbar': '^1.8.0',
    });
    expect(results).toMatchSnapshot();
  });

  it('succeeds when versions do not meet the required version but package is passed in allowList', () => {
    const results = requireThemeContextVersions.create({
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
