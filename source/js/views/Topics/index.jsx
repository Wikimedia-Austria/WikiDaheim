import React, { Component } from 'react';
import DenkmalIcon from '../../../assets/img/icon_denkmalliste.svg';
import NaturIcon from '../../../assets/img/icon_naturdenkmaeler.svg';
import CommonsIcon from '../../../assets/img/icon_commons.svg';
import PublicArtIcon from '../../../assets/img/icon_public_art.svg';
import KellerIcon from '../../../assets/img/icon_kellergasse.svg';
import FriedhofIcon from '../../../assets/img/icon_friedhof.svg';

export default class About extends Component {
  render() {
    return (
      <div className='TextPage'>
        <h1>Themen</h1>

        <div className='TextPage-CategoryInfo'>
          <aside>
            <img src={ DenkmalIcon } role='presentation' />
          </aside>
          <div>
            <h2>Denkmäler</h2>
            <p>
              Dieses Thema umfasst alle vom Bundesdenkmalamt als schützenswert
              ausgewiesenen Objekte.
              Interessant sind vor allem der Zustand und die Besonderheiten des Objekts.
            </p>
          </div>
        </div>

        <div className='TextPage-CategoryInfo'>
          <aside>
            <img src={ NaturIcon } role='presentation' />
          </aside>
          <div>
            <h2>Natur</h2>
            <p>
              Dieses Thema umfasst die in Österreich geschützte Natur, sei es als Naturdenkmal,
              geschützter Landschaftsteil, Naturschutzgebiet oder Nationalpark.
              Vor allem die einzigartigen Aspekte dieses Lebensraums sind interessant.
            </p>
          </div>
        </div>

        <div className='TextPage-CategoryInfo'>
          <aside>
            <img src={ CommonsIcon } role='presentation' />
          </aside>
          <div>
            <h2>Gemeingüter</h2>
            <p>
              Jede Gemeinde verfügt über Gemeingüter, die für alle nutzbar sind
              oder der Allgemeinheit zugute kommen.
              Dazu zählen etwa Feuerwehr, Gemeindeamt bzw. Rathaus und Infrastruktur im Ort.
            </p>
          </div>
        </div>

        <div className='TextPage-CategoryInfo'>
          <aside>
            <img src={ KellerIcon } role='presentation' />
          </aside>
          <div>
            <h2>Kellergassen</h2>
            <p>
              Im Osten Österreichs werden viele Gemeinden durch die Kellergassen geprägt,
              die für die Weinkultur Österreichs von großer Bedeutung sind.
              Die Dokumentation der Kellergassen in ihrem heutigen Zustand
              ist von besonderem Interesse.
            </p>
          </div>
        </div>

        <div className='TextPage-CategoryInfo'>
          <aside>
            <img src={ PublicArtIcon } role='presentation' />
          </aside>
          <div>
            <h2>Public Arts</h2>
            <p>
              Kunst im öffentlichen Raum ist in vielen Gemeinden ein Identitätsfaktor
              und manchmal auch Streitpunkt zugleich.
              Die Dokumentation dieser Kunstwerke in all ihren Facetten ist
              hier besonders interessant.
            </p>
          </div>
        </div>

        <div className='TextPage-CategoryInfo' >
          <aside>
            <img src={ FriedhofIcon } role='presentation' />
          </aside>
          <div>
            <h2>Friedhöfe</h2>
            <p>
              Friedhöfe sind ein zentraler Ort für die Erinnerungskultur in Österreich.
              Vielleicht findet sich ja auch in deinem Ort ein Grabstein einer Person,
              die in Wikipedia einen Artikel hat!
            </p>
          </div>
        </div>
      </div>
    );
  }
}
