import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { toggleFilterMenu } from 'actions/menu';
import { FormattedMessage } from 'react-intl';
import CategoryFilter from './CategoryFilter';
import PropertyFilter from './PropertyFilter';

@connect(state => {
  return {
    showFilterMenu: state.menu.get('showFilterMenu'),
  };
})
class FilterList extends Component {
  static propTypes = {
    showFilterMenu: PropTypes.bool,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { dispatch } = this.props;

    dispatch(toggleFilterMenu());
  }

  render() {
    const { showFilterMenu } = this.props;

    const ItemClass = classNames({
      'FilterSection': true,
      'FilterSection--active': showFilterMenu,
    });

    return (
      <section className={ ItemClass }>
        <FormattedMessage
          id='filter.title'
          description='Title of the Filter Menu'
          defaultMessage='Filter'
        >
          {(text) => (
            <h1>{ text }</h1>
          )}
        </FormattedMessage>

        <FormattedMessage
          id='filter.categoryFilterTitle'
          description='Title of the Categories-Filter'
          defaultMessage='Themen'
        >
          {(text) => (
            <h2>{ text }</h2>
          )}
        </FormattedMessage>

        <CategoryFilter />

        <FormattedMessage
          id='filter.propertyFilterTitle'
          description='Title of the Properties-Filter'
          defaultMessage='Eigenschaften'
        >
          {(text) => (
            <h2>{ text }</h2>
          )}
        </FormattedMessage>

        <PropertyFilter />

        <footer>
          <FormattedMessage
            id='filter.finishedButton'
            description='Title of the Filter Menu Finish-Button'
            defaultMessage='Fertig'
          >
            {(text) => (
              <button
                className='FilterFinished-Button'
                onClick={ this.toggle }
              >
                { text }
              </button>
            )}
          </FormattedMessage>
        </footer>
      </section>
    );
  }

}

export default FilterList;
