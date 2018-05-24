import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { routeCodes } from 'config/routes';
import Menu from 'components/Global/Header/Menu';
import DenkmalIcon from '../../../../assets/img/icon_denkmalliste.svg';
import NaturIcon from '../../../../assets/img/icon_naturdenkmaeler.svg';
import CommonsIcon from '../../../../assets/img/icon_commons.svg';
import PublicArtIcon from '../../../../assets/img/icon_public_art.svg';
import KellerIcon from '../../../../assets/img/icon_kellergasse.svg';
import FriedhofIcon from '../../../../assets/img/icon_friedhof.svg';

import __html from './IntroScreen.content.html';

class IntroScreen extends Component {

  render() {
    return (
      <div className='IntroScreen TextPage'>
        <h1>Stell deine Heimat<br />in der Wikipedia vor!</h1>

        <Link className='IntroScreen-CategoryList' to={ routeCodes.ABOUT }>
          <img src={ DenkmalIcon } role='presentation' title='Denkmäler' />
          <img src={ NaturIcon } role='presentation' title='Natur' />
          <img src={ KellerIcon } role='presentation' title='Kellergassen' />
          <img src={ PublicArtIcon } role='presentation' title='Public Arts' />
          <img src={ CommonsIcon } role='presentation' title='Gemeingüter' />
          <img src={ FriedhofIcon } role='presentation' title='Friedhöfe' />
        </Link>

        <div
          dangerouslySetInnerHTML={ { __html } }  // eslint-disable-line react/no-danger
        />

        <hr />
        <footer>
          <Menu />
        </footer>
      </div>
    );
  }

}

export default IntroScreen;
