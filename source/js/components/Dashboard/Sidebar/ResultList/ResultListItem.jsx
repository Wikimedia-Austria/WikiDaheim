import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Truncate from 'react-truncate';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { FormattedMessage } from 'react-intl';
import CategoryName from 'components/Global/CategoryName';

injectTapEventPlugin();
class ResultListItem extends Component {
  static propTypes = {
    item: PropTypes.object,
    category: PropTypes.object,
    isHovered: PropTypes.bool,
    isSelected: PropTypes.bool,
    onHover: PropTypes.func,
    onLeave: PropTypes.func,
    onClick: PropTypes.func,
  };

  render() {
    const {
      item,
      category,
      isHovered,
      isSelected,
      onHover,
      onLeave,
      onClick,
    } = this.props;
    const categoryColor = category.get('color');

    const ItemClass = classNames({
      'ResultListItem': true,
      'ResultListItem--active': isHovered,
      'ResultListItem--selected': isSelected,
    });

    let isAudio = null;
    const photoContainerStyle = {};
    let photoInfoLink = null;

    if (item.get('foto')) {
      const photoLinkString = item.get('foto')
        .replace(/ /g, '_')
        .replace(/\\/, '')
        .replace(/&amp;/g, '%26')
        .replace(/'/g, '%27');


      // audio file extensions from https://commons.wikimedia.org/wiki/Special:MediaStatistics
      isAudio = item.get('foto').match(/\.(webm|wav|mid|midi|kar|flac|ogx|ogg|ogm|ogv|oga|spx|opus)/);

      if (!isAudio) {
        const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${ item.get('foto') }?width=256`;
        photoContainerStyle.backgroundImage = `url('${ url }')`;

        // parse hex categoryColor, make 50% transparent for background in PhotoContainer
        if (categoryColor && categoryColor.match(/^#[0-9A-F]{6}$/i)) {
          const r = parseInt(categoryColor.substring(1, 3), 16);
          const g = parseInt(categoryColor.substring(3, 5), 16);
          const b = parseInt(categoryColor.substring(5, 7), 16);
          photoContainerStyle.backgroundColor = `rgba(${ r }, ${ g }, ${ b }, 0.5)`;
        }
      }

      photoInfoLink = (
        <FormattedMessage
          id='item.photoLinkTitle'
          description='Title for Photo Link'
          defaultMessage='Informationen {isAudio, select,
            yes {zur Audiodatei}
            other {zum Foto}
          }'
          values={ { isAudio } }
        >
          {(title) => (
            <a
              href={ `https://commons.wikimedia.org/wiki/File:${ photoLinkString }` }
              target='_blank'
              rel='noopener noreferrer'
              className='PhotoContainer-InfoButton'
              title={ title }
            >
              <span>{ title }</span>
            </a>
          )}
        </FormattedMessage>
      );
    }

    const photoContainerClass = classNames(
      'PhotoContainer',
      { 'PhotoContainer--Audio': isAudio }
    );

    const locationInfo = item.get('adresse');
    let location = '';

    if (locationInfo) {
      location = (
        <div className='Details-Location'>
          <p>
            <Truncate lines={ 2 }>
              { item.get('adresse') },<br />
              { item.get('gemeinde') }
            </Truncate>
          </p>
        </div>
      );
    }

    /* check if an description exists */
    const descriptionText = item.get('beschreibung');
    let descriptionContent = (<FormattedMessage
      id='item.missingDescription'
      description='Title for Description Missing-Info'
      defaultMessage='Beschreibung fehlt'
    />);

    const descriptionLinkText = category.get('name') === 'commons' ? (
      <FormattedMessage
        id='item.viewCommons'
        description='Title for the Commons Category Link'
        defaultMessage='zur Commons-Kategorie'
      />
    ) : (
      <FormattedMessage
        id='item.viewEntry'
        description='Title for the Object Entry Link'
        defaultMessage='zum Eintrag'
      />
    );

    if (descriptionText && descriptionText.length > 0) {
      descriptionContent = (<p>
        <Truncate lines={ 4 }>
          <span
            dangerouslySetInnerHTML={ { __html: item.get('beschreibung') } } // eslint-disable-line react/no-danger
          />
        </Truncate>
      </p>);
    }

    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className={ ItemClass }
        onMouseEnter={ window.USER_IS_TOUCHING ? null : onHover }
        onMouseLeave={ window.USER_IS_TOUCHING ? null : onLeave }
        onTouchTap={ onClick }
      >
        <div className='Details-Container'>
          <div
            className={ photoContainerClass }
            style={ photoContainerStyle }
          >
            <a
              href={ item.get('uploadLink') }
              target='_blank'
              rel='noopener noreferrer'
              className='PhotoContainer-UploadButton'
              style={ { 'backgroundColor': categoryColor } }
            >
              <FormattedMessage
                id='uploadPhoto'
                description='Text for Photo Upload-Button'
                defaultMessage='Foto hochladen'
              />
            </a>
            { photoInfoLink }
          </div>

          <div className='Details'>
            <div className='Details-Title'>
              <h2>
                <Truncate lines={ 3 }>
                  { item.get('name') ? item.get('name') : (
                    <FormattedMessage
                      id='item.missingTitle'
                      description='Title for Title Missing-Info'
                      defaultMessage='Titel fehlt'
                    />
                  ) }
                </Truncate>
              </h2>
              <div className='Details-Category' style={ { color: categoryColor } }>
                <CategoryName category={ category } />
              </div>
            </div>

            { location }
          </div>
        </div>

        <div className='Details-Container-Expanded'>
          <div className='Details-Text'>

            { descriptionContent }
            <a
              href={ item.get('editLink') ? item.get('editLink').replace('&action=edit', '') : '#' }
              target='_blank'
              rel='noopener noreferrer'
              style={ { color: categoryColor } }
            >
              { descriptionLinkText }
            </a>
          </div>
          <div className='Details-Links'>
            <a
              href={ item.get('uploadLink') }
              target='_blank'
              rel='noopener noreferrer'
              className='Details-Link-Upload'
            >
              <FormattedMessage
                id='uploadPhoto'
                description='Text for Photo Upload-Button'
                defaultMessage='Foto hochladen'
              />
            </a>
            {item.get('artikel_url') ?
              <a
                href={ item.get('artikel_url') }
                className={ classNames({
                  'Details-Link-Article': true,
                  'Details-Link-Article-View': item.get('artikel'),
                }) }
                target='_blank'
                rel='noopener noreferrer'
              >
                {item.get('artikel') ? (
                  <FormattedMessage
                    id='item.readArticle'
                    description='Title for Read Article-Link'
                    defaultMessage='Artikel lesen'
                  />
                ) : (
                  <FormattedMessage
                    id='item.createArticle'
                    description='Title for Create Article-Link'
                    defaultMessage='Artikel anlegen'
                  />
                )}
              </a>
            : null }
          </div>
        </div>
      </div>
    );
  }

}

export default ResultListItem;
