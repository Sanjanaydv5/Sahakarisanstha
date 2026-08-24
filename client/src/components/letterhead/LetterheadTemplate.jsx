import React, { useState } from 'react';
import { toDevanagari, getCurrentBSDateString } from '../../utils/nepaliConverter';
import { Printer, Download, Save, RefreshCw } from 'lucide-react';

export const LetterheadTemplate = ({ orgSettings }) => {
  const org = orgSettings || {
    nameNepali: 'जनता सहयोगी कृषि सहकारी संस्था लिमिटेड',
    addressNepali: 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)',
    phones: ['9844111621', '9814850746'],
    registrationNo: '६८८/०६७/०६८',
    panNo: '६१४२५५४०१',
    establishedYearBS: '२०६७',
    establishedUnder: 'सहकारी ऐन २०४८ नियम २०४९ अन्तर्गत स्थापित'
  };

  const [patraSankhya, setPatraSankhya] = useState('२०८०/०८१');
  const [chalaniNo, setChalaniNo] = useState('१४२');
  const [nepaliDate, setNepaliDate] = useState(getCurrentBSDateString());
  const [recipient, setRecipient] = useState('श्री कृषि ज्ञान केन्द्र / स्थानीय तह,\nमहोत्तरी ।');
  const [subject, setSubject] = useState('मलखाद अनुदान सिफारिस सम्बन्धमा ।');
  const [bodyText, setBodyText] = useState(
    'प्रस्तुत विषयमा यस जनता सहयोगी कृषि सहकारी संस्था लिमिटेडमा आबद्ध स्थानीय कृषकहरूलाई चालू बालीको लागि रासायनिक मल (युरिया/डीएपी/पोटास) समयमै उपलब्ध गराउन आवश्यक कोटा विनियोजन गरिदिनुहुन सिफारिस साथ अनुरोध गरिन्छ ।\n\nसंलग्न विवरण बमोजिमका कृषकहरूको विवरण यसै पत्रसाथ संलग्न राखी पठाइएको व्यहोरा अनुरोध छ ।'
  );
  const [signatoryName, setSignatoryName] = useState('राम पुकार यादव');
  const [signatoryRole, setSignatoryRole] = useState('अध्यक्ष / व्यवस्थापक');

  return (
    <div className="flex flex-col items-center w-full">
      {/* Control bar */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-4 no-print bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">आधिकारिक लेटरप्याड सम्पादक (Official Letter Pad)</h3>
          <p className="text-xs text-slate-500">पत्रको विवरण सम्पादन गरी प्रिन्ट गर्नुहोस्</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>पत्र प्रिन्ट गर्नुहोस् (Print Letter)</span>
          </button>
        </div>
      </div>

      {/* Physical Letterhead Sheet (Exact match to Photo 2) */}
      <div className="print-area bg-white w-full max-w-3xl min-h-[950px] p-8 md:p-12 border border-slate-300 shadow-2xl rounded-sm text-slate-900 leading-relaxed text-sm flex flex-col justify-between">
        <div>
          {/* Top Header metadata */}
          <div className="flex justify-between items-start text-xs font-bold text-slate-800">
            <div>
              <p>दर्ता नं.: <span>{org.registrationNo}</span></p>
            </div>
            <div className="text-center">
              <span className="text-[11px] font-semibold text-slate-700">
                ({org.establishedUnder})
              </span>
            </div>
            <div className="text-right">
              <p>स्थायी लेखा नम्बर: <span>{org.panNo}</span></p>
            </div>
          </div>

          {/* Cooperative Emblem & Title */}
          <div className="text-center mt-3 border-b-2 border-slate-900 pb-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight font-devanagari">
              {org.nameNepali}
            </h1>
            <p className="text-sm font-bold text-slate-800 mt-1 flex items-center justify-center gap-3">
              <span>{org.addressNepali}</span>
              <span>✆ {org.phones?.join(', ')}</span>
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              स्था.: {org.establishedYearBS}
            </p>
          </div>

          {/* Letter Reference Numbers & Date Row */}
          <div className="flex justify-between items-center text-xs font-bold text-slate-900 mt-4 border-b border-slate-200 pb-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span>प.सं. (पत्र संख्या) :</span>
                <input
                  type="text"
                  value={patraSankhya}
                  onChange={(e) => setPatraSankhya(e.target.value)}
                  className="border-b border-dotted border-slate-600 px-1 font-semibold outline-none bg-transparent w-24 no-print-border"
                />
              </div>
              <div className="flex items-center gap-1">
                <span>च.नं. (चलानी नं) :</span>
                <input
                  type="text"
                  value={chalaniNo}
                  onChange={(e) => setChalaniNo(e.target.value)}
                  className="border-b border-dotted border-slate-600 px-1 font-semibold outline-none bg-transparent w-24 no-print-border"
                />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span>मिति:</span>
              <input
                type="text"
                value={nepaliDate}
                onChange={(e) => setNepaliDate(e.target.value)}
                className="border-b border-dotted border-slate-600 px-2 font-semibold outline-none bg-transparent w-28 text-center no-print-border"
              />
            </div>
          </div>

          {/* Recipient Field (श्री ...) */}
          <div className="mt-6">
            <div className="flex items-start gap-2">
              <span className="font-bold text-sm">श्री :</span>
              <textarea
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                rows={2}
                className="w-full border border-transparent hover:border-slate-200 focus:border-slate-400 rounded p-1 font-semibold text-sm outline-none resize-none bg-transparent"
              />
            </div>
          </div>

          {/* Subject Field (विषय: ...) */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 border-b-2 border-slate-900 pb-1">
              <span className="font-extrabold text-base">विषय:</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="font-bold text-base outline-none bg-transparent text-center min-w-[300px]"
              />
            </div>
          </div>

          {/* Body Content */}
          <div className="mt-6">
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              rows={12}
              className="w-full p-2 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded font-medium text-sm leading-loose outline-none resize-none bg-transparent"
            />
          </div>
        </div>

        {/* Bottom Signatory */}
        <div className="mt-12 flex justify-end">
          <div className="text-center w-56 space-y-1">
            <div className="h-12 flex items-end justify-center">
              <span className="text-xs text-slate-400 italic">.............................................</span>
            </div>
            <input
              type="text"
              value={signatoryName}
              onChange={(e) => setSignatoryName(e.target.value)}
              className="font-bold text-sm text-center w-full outline-none bg-transparent"
            />
            <input
              type="text"
              value={signatoryRole}
              onChange={(e) => setSignatoryRole(e.target.value)}
              className="text-xs text-slate-600 font-semibold text-center w-full outline-none bg-transparent"
            />
            <p className="text-[10px] text-slate-500 font-semibold">(कार्यालय छाप)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
