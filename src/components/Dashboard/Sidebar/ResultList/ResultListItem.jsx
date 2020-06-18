import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Truncate from 'react-truncate';
import { List } from 'immutable';
import { FormattedMessage } from 'react-intl';
import getFilePath from 'wikimedia-commons-file-path';
import CategoryName from 'components/Global/CategoryName';
import SourceName from 'components/Global/SourceName';

class ResultListItem extends Component {
  static propTypes = {
    item: PropTypes.object,
    category: PropTypes.object,
    isHovered: PropTypes.bool,
    isSelected: PropTypes.bool,
    isScrolling: PropTypes.bool,
    currentLanguage: PropTypes.string,
    onHover: PropTypes.func,
    onLeave: PropTypes.func,
    onClick: PropTypes.func,
    style: PropTypes.object,
  };

  render() {
    const {
      item,
      category,   // main category
      isHovered,
      isSelected,
      isScrolling,
      currentLanguage,
      onHover,
      onLeave,
      onClick,
      style,
    } = this.props;
    const categoryColor = category.get('color');

    const ItemClass = classNames({
      'ResultListItem': true,
      'ResultListItem--active': isHovered,
      'ResultListItem--selected': isSelected,
    });
    const photoContainerStyle = {};

    // parse hex categoryColor, make 50% transparent for background in PhotoContainer
    if (categoryColor && categoryColor.match(/^#[0-9A-F]{6}$/i)) {
      const r = parseInt(categoryColor.substring(1, 3), 16);
      const g = parseInt(categoryColor.substring(3, 5), 16);
      const b = parseInt(categoryColor.substring(5, 7), 16);
      photoContainerStyle.backgroundColor = `rgba(${ r }, ${ g }, ${ b }, 0.5)`;
    }

    let location = '';
    let source = '';
    let descriptionContent = '';
    let descriptionLinkText = '';
    let photoContainerClass = 'PhotoContainer';
    let uploadLink = '#';
    let photoInfoLink = null;
    let isAudio = null;

    if(!isScrolling) {
      // add the currently selected language as caption language
      uploadLink = item.get('uploadLink').replace('captionlang=de', `captionlang=${ currentLanguage }&uselang=${ currentLanguage }`);

      if (item.get('foto')) {
        const photoLinkString = item.get('foto')
          .replace(/ /g, '_')
          .replace(/\\/, '')
          .replace(/&amp;/g, '%26')
          .replace(/'/g, '%27');


        // audio file extensions from https://commons.wikimedia.org/wiki/Special:MediaStatistics
        isAudio = item.get('foto').match(/\.(webm|wav|mid|midi|kar|flac|ogx|ogg|ogm|ogv|oga|spx|opus)/);

        if (!isAudio) {
          const url = getFilePath(item.get('foto'), 256);
          photoContainerStyle.backgroundImage = `url('${ url }')`;
        } else {
          delete photoContainerStyle.backgroundColor;
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

      photoContainerClass = classNames(
        'PhotoContainer',
        { 'PhotoContainer--Audio': isAudio }
      );

      // pre-render the location info (if any)
      const locationInfo = item.get('adresse');


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

      // pre-render the source info (if any)
      let sourceInfo = item.get('source');

      if( !List.isList(sourceInfo) ) sourceInfo = new List([ sourceInfo ]);

      if (sourceInfo) {
        source = (
          <div className='Details-Source'>
            <p>
              <FormattedMessage
                id='item.imageRequestSource'
                description='Title for the Image Request Source Headline'
                defaultMessage='Quellen:'
              />
              <br />
              { sourceInfo.map( src => (
                <a
                  href={ src.get('link') }
                  target='_blank'
                  rel='noopener noreferrer'
                  title={ src.get('title') }
                  key={ src.get('link') }
                >
                  <SourceName source={ src.get('title') } />
                </a>
              ) ) }
            </p>
          </div>
        );
      }


      /* check if an description exists */
      const descriptionText = item.get('beschreibung');
      descriptionContent = (<FormattedMessage
        id='item.missingDescription'
        description='Title for Description Missing-Info'
        defaultMessage='Beschreibung fehlt'
      />);

      descriptionLinkText = category.get('name') === 'commons' ? (
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
    }

    return (
      <div className="ResultListItem-Wrapper" style={ style }>
        <div // eslint-disable-line jsx-a11y/no-static-element-interactions
          className={ ItemClass }
          onMouseEnter={ window.USER_IS_TOUCHING ? null : onHover }
          onMouseLeave={ window.USER_IS_TOUCHING ? null : onLeave }
          onClick={ onClick }
        >
          <div className='Details-Container'>
            <div
              className={ photoContainerClass }
              style={ photoContainerStyle }
            >
              {!isScrolling && (
                <>
                  <a
                    href={ uploadLink }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='PhotoContainer-UploadButton'
                    style={ { 'backgroundColor': categoryColor } }
                  >
                    <span>
                      <FormattedMessage
                        id='uploadPhoto'
                        description='Text for Photo Upload-Button'
                        defaultMessage='Foto hochladen'
                      />
                    </span>
                  </a>
                  { photoInfoLink }
                </>
              ) }
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
                {!isScrolling && (
                  <div className='Details-Category' style={ { color: categoryColor } }>
                    {item.get('categories') && item.get('categories').map(c => <CategoryName category={ c } key={ c } />) }
                  </div>
                )}
              </div>
              {!isScrolling && (
                <div className="Details-Sbs">
                  { location }
                  { source }
                </div>
              )}

            </div>
          </div>

          {!isScrolling && (
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
                  href={ uploadLink }
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
          ) }
          </div>
      </div>
    );
  }

}

export default ResultListItem;
