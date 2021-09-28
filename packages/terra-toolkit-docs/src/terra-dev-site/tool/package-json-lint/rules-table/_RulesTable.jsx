import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import { ThemeContext } from '@cerner/terra-application/lib/theme';
import Table, {
  Header,
  HeaderCell,
  Body,
  Cell,
  Row,
} from 'terra-html-table';

import styles from './RulesTable.module.scss';

// Rules
const requireNoTerraBasePeerDependencyVersions = require('@cerner/package-json-lint/lib/rules/require-no-terra-base-peer-dependency-versions');
const requireNoHardCodedDependencyVersions = require('@cerner/package-json-lint/lib/rules/require-no-hard-coded-dependency-versions');
const requireThemeContextVersions = require('@cerner/package-json-lint/lib/rules/require-theme-context-versions');
const requireNoUnnecessaryDependency = require('@cerner/package-json-lint/lib/rules/require-no-unnecessary-dependency');

const cx = classNames.bind(styles);

const rows = [
  requireNoHardCodedDependencyVersions.documentation,
  requireNoTerraBasePeerDependencyVersions.documentation,
  requireNoUnnecessaryDependency.documentation,
  requireThemeContextVersions.documentation,
];

const RulesTable = () => {
  const theme = useContext(ThemeContext);

  return (
    <div>
      <Table className={cx('table', theme.className)}>
        <Header>
          <HeaderCell className={cx('th')}>
            Rule Name
          </HeaderCell>
          <HeaderCell className={cx('th')}>
            Severity Type
          </HeaderCell>
          <HeaderCell className={cx('th')}>
            Default
          </HeaderCell>
          <HeaderCell className={cx('th')}>
            Description
          </HeaderCell>
        </Header>
        <Body>
          {rows.map((row) => (
            <Row className={cx('tr', 'props-tr')} key={row.ruleName}>
              <Cell className={cx(['td', 'strong', 'props-td'])}>
                {row.ruleName}
              </Cell>
              <Cell className={cx(['td', 'props-td'])}>
                string
              </Cell>
              <Cell className={cx(['td', 'props-td'])}>
                {row.defaultValue}
              </Cell>
              <Cell className={cx(['td', 'props-td'])}>
                {row.description}
              </Cell>
            </Row>
          ))}
        </Body>
      </Table>
    </div>
  );
};

export default RulesTable;
