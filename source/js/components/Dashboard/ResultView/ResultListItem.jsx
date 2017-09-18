import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Truncate from 'react-truncate';
import md5 from 'js-md5';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ResultListItemDetail from './ResultListItemDetail';

injectTapEventPlugin();
class ResultListItem extends Component {
  static propTypes = {
    item: PropTypes.object,
    categoryColor: PropTypes.string,
    editLinkText: PropTypes.string,
    isHovered: PropTypes.bool,
    isSelected: PropTypes.bool,
    onHover: PropTypes.func,
    onLeave: PropTypes.func,
    onClick: PropTypes.func,
  };

  render() {
    const {
      item,
      categoryColor,
      editLinkText,
      isHovered,
      isSelected,
      onHover,
      onLeave,
      onClick,
    } = this.props;

    const ItemClass = classNames({
      'ResultListItem': true,
      'ResultListItem--active': isHovered,
      'ResultListItem--selected': isSelected,
    });

    let photoContainerClass = 'PhotoContainer';
    const photoContainerStyle = {};
    let photoInfoLink = null;
    if (item.get('foto')) {
      const hashString = item.get('foto')
        .replace(/ /g, '_')
        .replace(/\\/, '');

      const photoLinkString = hashString
        .replace(/&amp;/g, '%26')
        .replace(/'/g, '%27');
      let photoLinkTitle = 'Informationen zum Foto';

      const hash = md5(hashString);
      const hp1 = hash.substring(0, 1);
      const hp2 = hash.substring(0, 2);

      if (item.get('foto').match(/\.(webm|wav|mid|midi|kar|flac|ogx|ogg|ogm|ogv|oga|spx|opus)/)) {
        // audio file extensions from https://commons.wikimedia.org/wiki/Special:MediaStatistics
        photoContainerClass += ' PhotoContainer--Audio';
        photoLinkTitle = 'Informationen zur Audiodatei';
      } else {
        photoContainerStyle.backgroundImage = `url('https://upload.wikimedia.org/wikipedia/commons/thumb/${ hp1 }/${ hp2 }/${ photoLinkString }/256px-${ photoLinkString }')`;
      }

      photoInfoLink = (
        <a
          href={ `https://commons.wikimedia.org/wiki/File:${ photoLinkString }` }
          target='_blank'
          rel='noopener noreferrer'
          className='PhotoContainer-InfoButton'
          title={ photoLinkTitle }
        >
          <span>{ photoLinkTitle }</span>
        </a>
      );
    }

    // parse hex categoryColor, make 50% transparent for background in PhotoContainer
    if (categoryColor && categoryColor.match(/^#[0-9A-F]{6}$/i)) {
      const r = parseInt(categoryColor.substring(1, 3), 16);
      const g = parseInt(categoryColor.substring(3, 5), 16);
      const b = parseInt(categoryColor.substring(5, 7), 16);
      photoContainerStyle.backgroundColor = `rgba(${ r }, ${ g }, ${ b }, 0.5)`;
    }

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

    const articleLinkUrl = item.get('artikel_url');
    let articleLink = '';

    if (articleLinkUrl) {
      articleLink = (
        <a
          href={ articleLinkUrl }
          style={ { 'color': categoryColor } }
          target='_blank'
          rel='noopener noreferrer'
        >
          {item.get('artikel') ? 'Artikel lesen' : 'Artikel anlegen'}
        </a>
      );
    }

    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className={ ItemClass }
        onMouseEnter={ window.USER_IS_TOUCHING ? null : onHover }
        onMouseLeave={ window.USER_IS_TOUCHING ? null : onLeave }
        onTouchTap={ onClick }
      >
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
            <span>Foto hochladen</span>
          </a>
          { photoInfoLink }
        </div>

        <div className='Details'>
          <div className='Details-left'>
            <div className='Details-Title'>
              <h2>
                <Truncate lines={ 3 }>
                  { item.get('name') ? item.get('name') : 'Titel fehlt' }
                </Truncate>
              </h2>
              {articleLink}
            </div>

            { location }
          </div>
          <div className='Details-right'>
            <ResultListItemDetail
              className='Details-Description'
              value={ item.get('beschreibung') }
              editLink={ item.get('editLink') ? item.get('editLink').replace('&action=edit', '') : '#' }
              editLinkText={ editLinkText }
              errorText='Beschreibung fehlt'
              color={ categoryColor }
            >
              <p>
                <Truncate lines={ 4 }>
                  <span
                    dangerouslySetInnerHTML={ { __html: item.get('beschreibung') } } // eslint-disable-line react/no-danger
                  />
                </Truncate>
              </p>
            </ResultListItemDetail>
          </div>
        </div>
      </div>
    );
  }

}

export default ResultListItem;
