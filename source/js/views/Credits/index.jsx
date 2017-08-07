import React, { Component } from 'react';

export default class Credits extends Component {
  render() {
    return (
      <div className='TextPage TextPage-Credits'>
        <h1>Credits</h1>

        <p>
          WikiDaheim ist ein Projekt der österreichischen Wikimedia-Community
          mit Unterstützung von Wikimedia Österreich.
        </p>

        <h2>Kontakt</h2>
        <p>
          <a href='mailto:wikidaheim@wikimedia.at'>wikidaheim@wikimedia.at</a>
        </p>

        <p>Fragen, Anregungen und Kritik können auch auf der
          <a
            href='https://de.wikipedia.org/w/index.php?title=Wikipedia_Diskussion:WikiDaheim&action=edit&section=new'
            target='_blank'
            rel='noopener noreferrer'
          >
            Projektseite in der Wikipedia
          </a>
          hinterlassen werden.
        </p>

        <h2>Umsetzung</h2>

        <p>
          <strong>Design</strong><br />
          <a
            href='http://www.mooi-design.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            MOOI Design
          </a>
        </p>

        <p>
          <strong>Frontend-Entwicklung</strong><br />
          <a
            href='http://www.benereiter.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Benedikt Reiter
          </a><br />
          <a
            href='https://github.com/reiterbene/WikiDaheim'
            target='_blank'
            rel='noopener noreferrer'
          >
            Quellcode auf GitHub
          </a>
        </p>

        <p>
          <strong>Datenbankimplementierung und Schnittstelle</strong><br />
          <a
            href='http://demus.at/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Ruben Demus
          </a>
        </p>

        <h2>Quellen</h2>
        <p>
          Die in den Themenkategorien verwendeten Texte stammen aus Wikipedia
          unter &quot;Creative Commons Attribution-ShareAlike 3.0 Unported&quot;.
        </p>

        <h2>Lizensierung</h2>
        <p>
          Sämtliche Inhalte und Elemente von WikiDaheim
          sind mit der Lizenz CC-BY-SA 3.0 nachnutzbar.
        </p>
      </div>
    );
  }
}
