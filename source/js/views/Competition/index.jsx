import React, { Component } from 'react';

export default class Competition extends Component {
  render() {
    return (
      <div className='TextPage TextPage-Competition'>
        <h1>Fotowettbewerb WikiDaheim</h1>

        <p>
          Stell deine Heimat mit deinen Fotos in der Wikipedia vor.
        </p>
        <p>
          Hilf mit die Wikipedia-Seiten zu österreichischen Gemeinden zu
          bebildern und zeige so mit frei verfügbaren Bildern deren
          einzigartigen Charakter!
        </p>

        <h2>Wettbewerbszeitraum</h2>
        <p>
          Von 28. Juli 2017 bis Mitternacht (24:00, MESZ) am 7. Oktober 2017
          war es möglich, Bilder auf dieser Website hochzuladen.
          {/* (Alternative für erfahrene BenutzerInnen:
          direkt über Wikimedia Commons unter Verwendung der
          Vorlage {'{{WikiDaheim|2017|at|topic=}}'} hochladen.) */}
        </p>

        {/*
        <h2>Mach mit!</h2>
        <p>
          Auch du kannst teilnehmen, ob mit Landschaftspanorama, Einzeldenkmal,
          Weitwinkel oder Makroaufnahme!
        </p>

        <p>
          Dazu musst du dich als BenutzerIn bei Wikimedia Commons,
          der zentralen Bilddatenbank für alle Wikimedia-Projekte, anmelden.
          Das kann mit dem richtigen Namen oder mit einem Nickname (Spitznamen) geschehen.
          Auch deine E-Mail-Adresse musst du bekanntgeben. Diese wird nicht veröffentlicht.
          Nur im Gewinnfall bekommst du ein E-Mail und kannst dann deinen Namen und Adresse
          der Wettbewerbsleitung bekanntgeben. Auch da ist eine Veröffentlichung deiner Daten
          ohne deine Zustimmung nicht vorgesehen.
        </p>

        <p>
          Die Einreichung erfolgt über den Uploadbutton.
        </p>
        */}

        <p>
          <strong>Information:</strong><br />
          Die zehn besten Bilder von denkmalgeschützten Objekten wurden automatisch
          auch Teil des internationalen Wettbewerbs <a
            href='http://www.wikilovesmonuments.org/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Wiki Loves Monuments
          </a>.
        </p>

        <h2>Regeln</h2>

        <ul>
          <li>Das teilnehmende Bild muss in Österreich fotografiert worden sein.</li>
          <li>Das Bild muss während des Wettbewerbszeitraums hochgeladen worden sein.</li>
          <li>Das Bild kann vor und während des Wettbewerbszeitraums aufgenommen worden sein.</li>
          <li>Der dokumentarische Ansatz steht vor dem künstlerischen Aspekt.</li>
          <li>
            Fotos müssen unter einer <a
              href='https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Free_Creative_Commons_licenses'
              target='_blank'
              rel='noopener noreferrer'
            >
              freien Creative-Commons-Lizenz
            </a> auf <a
              href='https://commons.wikimedia.org/wiki/Hauptseite'
              target='_blank'
              rel='noopener noreferrer'
            >
              Wikimedia Commons
            </a> veröffentlicht werden.
          </li>
          <li>Eine aussagekräftige Beschreibung/Kategorisierung ist ausdrücklich erwünscht.</li>
          <li>
            In den Benutzereinstellungen auf Wikimedia Commons muss die Einstellung
            „E-Mail-Empfang von anderen Benutzern ermöglichen“ aktiviert sein sowie eine
            funktionstüchtige E-Mail-Adresse angegeben werden. Sonst ist uns eine Kontaktaufnahme
            leider nicht möglich.
          </li>

        </ul>

        <h2>Sollte ich etwas besonders beachten?</h2>

        <p>
          Fotos sollten den <a
            href='https://commons.wikimedia.org/wiki/Commons:Policies_and_guidelines/de'
            target='_blank'
            rel='noopener noreferrer'
          >
            Richtlinien und Empfehlungen
          </a> von Wikimedia Commons entsprechen. Insbesondere von Manipulationen und Bearbeitungen
          in der Form von Rahmen und sichtbaren <a
            href='https://commons.wikimedia.org/wiki/Commons:Watermarks'
            target='_blank'
            rel='noopener noreferrer'
          >
            Wasserzeichen
          </a> sollte abgesehen werden.
          Eine Auflösung von 2 Megapixel sollte nicht unterschritten werden.
          Die <a
            href='https://commons.wikimedia.org/wiki/Commons:Bild-Richtlinien'
            target='_blank'
            rel='noopener noreferrer'
          >
            Leitlinie für Qualitätsbilder
          </a> ist eine gute Anlaufstelle für die Kriterien, die Fotos erfüllen sollten.
        </p>

        <h2>Preise</h2>
        <p>
          <strong>von Wikimedia Österreich</strong><br />
          <strong>1. Preis:</strong> eine Reise zur <a
            href='https://wikimania2018.wikimedia.org/wiki/Wikimania'
            target='_blank'
            rel='noopener noreferrer'
          >
            Wikimania 2018
          </a> nach Südafrika<br />
          <strong>2.–10. Preis:</strong> Gutscheine für Fotoequipment oder Fotoentwicklung
        </p>

        <h2>Jury</h2>
        <p>
          Eine Vorjury aus WikipedianerInnen sichtet alle Einsendungen,
          überprüft die Einhaltung der Wettbewerbsregeln und übermittelt eine Auswahl
          von ca. 500 Fotos an die Jury, welche die Gewinner ermittelt.
        </p>
      </div>
    );
  }
}
