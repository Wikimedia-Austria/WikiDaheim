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

class IntroScreen extends Component {

  render() {
    return (
      <div className='IntroScreen TextPage'>
        <h1>Stell deine Heimat<br />in der Wikipedia vor!</h1>

        <div className='IntroScreen-CategoryList'>
          <img src={ DenkmalIcon } role='presentation' />
          <img src={ NaturIcon } role='presentation' />
          <img src={ KellerIcon } role='presentation' />
          <img src={ PublicArtIcon } role='presentation' />
          <img src={ CommonsIcon } role='presentation' />
          <img src={ FriedhofIcon } role='presentation' />
        </div>

        <p>
          WikiDaheim ist ein Projekt von Freiwilligen der Wikimedia-Projekte wie Wikipedia,
          das sich mit dem Sammeln von Informationen über Gemeinden in ganz Österreich beschäftigt.
          Gerade in Österreich sind die Möglichkeiten,
          den Charakter eines Ortes mit Bildern oder Texten zu zeigen,
          noch kaum erschlossen worden.
        </p>

        <h2>Wie kann ich beitragen?</h2>

        <p>
          Indem du Informationen zu deiner Heimatgemeinde beiträgst,
          sei es als Text in der Wikipedia oder als Foto,
          hilfst du Wikipedia und ihren Schwesterprojekten dabei,
          das Wissen dieser Welt zu sammeln und für alle frei verfügbar zu machen!
        </p>

        <h3>Fotowettbewerb</h3>

        <p>
          Alle hochgeladenen Bilder nehmen am Fotowettbewerb zu WikiDaheim teil,
          wo die besten Motive zu österreichischen Gemeinden mit Preisen prämiert werden!
          Die Regeln dazu kannst du auf der Seite
          <Link to={ routeCodes.COMPETITION }>
            <span>Wettbewerb</span>
          </Link>
          nachlesen.
        </p>

        <h2>Was ist für Wikipedia & Co. interessant?</h2>

        <p>
          Interessant sind vor allem Informationen und Bilder,
          die noch unbekannte Seiten der Gemeinden Österreichs hervorheben.
          Wenn Dir also bei der Lektüre deines Gemeindeartikels etwas auffällt
          oder die Bilder zu deiner Gemeinde Lücken aufweisen,
          ist das deine Chance, diese Lücken zu füllen und zur Wikipedia beizutragen!
        </p>

        <p>
          Falls Dir dazu nichts Konkretes einfallen möchte, so haben wir Themen vorbereitet,
          wo Wikipedia & Co. deine Hilfe gebrauchen könnten.
          Sei es ein denkmalgeschütztes Objekt im Ort,
          ein Bild von der Feuerwehr oder die heimische Natur,
          alles ist auf die ein oder andere Art wissenswert!
        </p>

        <hr />
        <footer>
          <Menu />
        </footer>
      </div>
    );
  }

}

export default IntroScreen;
