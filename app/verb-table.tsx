"use client";

import { useState } from "react";
import type { Verb } from "./data";
import { ipa, ipaKey, ipaLabel } from "./ipa";
import { meaning } from "./spanish";
import { playVerb, speakText } from "./tts";

/** Lista completa de verbos en tabla, con pronunciacion. Tocar un verbo lo abre en la tarjeta. */
export default function VerbTable({ verbs, onOpen }: { verbs: Verb[]; onOpen: (base: string) => void }) {
  const [showKey, setShowKey] = useState(false);

  return (
    <section className="guide verbTable" aria-label="Lista completa de verbos">
      <div className="guideHead">
        <div>
          <p className="eyebrow">Lista completa</p>
          <h3>{verbs.length} verbos irregulares</h3>
        </div>
        <button className="esToggle" onClick={() => setShowKey((current) => !current)} aria-expanded={showKey}>
          {showKey ? "Ocultar símbolos" : "Cómo leer la pronunciación"}
        </button>
      </div>

      {showKey && (
        <div className="ipaKey">
          <p className="instructions">La pronunciación está en símbolos fonéticos (IPA), con acento americano. Los que más cuestan:</p>
          <ul>
            {ipaKey.map((item) => (
              <li key={item.symbol}>
                <span className="ipaSymbol">{item.symbol}</span>
                <button className="link" onClick={() => speakText(item.example)}>{item.example}</button>
                <span className="statNote">{item.hint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Base form</th>
              <th scope="col">Past simple</th>
              <th scope="col">Past participle</th>
              <th scope="col">Significado</th>
              <th scope="col"><span className="srOnly">Audio</span></th>
            </tr>
          </thead>
          <tbody>
            {verbs.map((verb) => {
              const sounds = ipa(verb.base);
              const forms = [verb.base, verb.past, verb.participle];
              return (
                <tr key={verb.base}>
                  {forms.map((form, index) => (
                    <td key={index}>
                      {index === 0 ? (
                        <button className="link verbLink" onClick={() => onOpen(verb.base)}>{form}</button>
                      ) : (
                        <strong>{form.replace("/", ", ")}</strong>
                      )}
                      {sounds && <span className="ipa">{ipaLabel(sounds[index])}</span>}
                    </td>
                  ))}
                  <td className="meaningCell">{meaning(verb.base)}</td>
                  <td>
                    <button className="ico ico-play secondary" onClick={() => playVerb(verb)} aria-label={`Escuchar ${verb.base}`}>Escuchar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
