import React from 'react';
import { toDevanagari, formatNPR } from '../../utils/nepaliConverter';
import { Printer, Download } from 'lucide-react';

export const DistributionRegisterPrint = ({ entries, orgSettings, onPrint, onExportCSV }) => {
  const org = orgSettings || {
    nameNepali: 'जनता सहयोगी कृषि सहकारी संस्था लिमिटेड',
    addressNepali: 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)',
    phones: ['9844111621', '9814850746'],
    registrationNo: '६८८/०६७/०६८',
    panNo: '६१४२५५४०१'
  };

  const totalQty = entries.reduce((sum, e) => sum + (e.quantity || 0), 0);
  const totalAmount = entries.reduce((sum, e) => sum + (e.salePrice || 0), 0);

  // Fill up min 12 rows for official look
  const displayRows = [...entries];
  while (displayRows.length < 10) {
    displayRows.push(null);
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top Buttons (Hidden during Print) */}
      <div className="w-full flex justify-end gap-3 mb-4 no-print">
        {onExportCSV && (
          <button
            onClick={onExportCSV}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>CSV / Excel निर्यात (Export)</span>
          </button>
        )}
        <button
          onClick={onPrint || (() => window.print())}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition"
        >
          <Printer className="w-4 h-4" />
          <span>अनुसूची-३ रजिस्टर प्रिन्ट गर्नुहोस् (Print Register)</span>
        </button>
      </div>

      {/* Official Government Form Schedule-3 Replica */}
      <div className="print-area bg-white p-6 border border-slate-400 shadow-xl w-full max-w-5xl rounded-sm text-slate-900 text-xs">
        {/* Top Header metadata */}
        <div className="flex justify-between items-start text-[11px] font-semibold text-slate-800 border-b pb-2">
          <div>
            <p>प्रमाणपत्र दर्ता नं.: <strong>{org.registrationNo}</strong></p>
            <p>स्थायी लेखा नं. (PAN): <strong>{org.panNo}</strong></p>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold px-3 py-0.5 border border-slate-800 rounded bg-slate-50">
              अनुसूची-३
            </span>
            <p className="text-[10px] text-slate-600 mt-1">(सहकारी ऐन २०४८ नियम २०४९ अन्तर्गत स्थापित)</p>
          </div>
        </div>

        {/* Organization Name Header */}
        <div className="text-center my-3">
          <h2 className="text-xl font-extrabold text-slate-950 font-devanagari tracking-tight">
            {org.nameNepali}
          </h2>
          <p className="text-xs font-bold text-slate-700 mt-0.5">
            {org.addressNepali} ✆ {org.phones?.join(', ')}
          </p>
          <div className="inline-block mt-2 px-4 py-1 border-2 border-slate-900 bg-amber-50">
            <h3 className="text-base font-extrabold tracking-wide uppercase">
              मलको बिक्री वितरण विवरण (Sales Register)
            </h3>
          </div>
        </div>

        {/* Schedule-3 Table Matching Physical Form 3 */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full register-table text-[10px] text-left border-collapse border border-slate-800">
            <thead>
              <tr className="bg-slate-100 font-extrabold text-center border-b-2 border-slate-900">
                <th className="py-2 px-1 w-7 border border-slate-800">सि.नं.</th>
                <th className="py-2 px-1.5 border border-slate-800 text-left">कृषकको नाम</th>
                <th className="py-2 px-1 border border-slate-800">परिचय पत्र नं.</th>
                <th className="py-2 px-1 border border-slate-800">ठेगाना</th>
                <th className="py-2 px-1 border border-slate-800">सम्पर्क फोन नं.</th>
                <th className="py-2 px-1 border border-slate-800">क्षेत्रफल (रोपनी/कठ्ठा)</th>
                <th className="py-2 px-1.5 border border-slate-800">मलको प्रकार</th>
                <th className="py-2 px-1 w-12 border border-slate-800">परिमाण</th>
                <th className="py-2 px-1 w-16 border border-slate-800 text-right">बिक्री मूल्य रु.</th>
                <th className="py-2 px-1 w-12 border border-slate-800 text-center">बिल नं.</th>
                <th className="py-2 px-1 w-16 border border-slate-800 text-center">बिल मिति</th>
                <th className="py-2 px-2 border border-slate-800 text-center w-24">खरिद गर्ने कृषकको सही छाप</th>
                <th className="py-2 px-1.5 border border-slate-800 text-left">कृषकले कुन बालीको लागि मल खरिद गरेको उल्लेख गर्ने</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((entry, idx) => (
                <tr key={idx} className="h-7 border-b border-slate-700">
                  <td className="text-center font-bold border border-slate-700 py-1">
                    {entry ? toDevanagari(idx + 1) : ''}
                  </td>
                  <td className="font-semibold border border-slate-700 px-1.5 py-1">
                    {entry ? entry.farmerName : ''}
                  </td>
                  <td className="text-center border border-slate-700 px-1 py-1 font-mono text-[9.5px]">
                    {entry ? (toDevanagari(entry.idCardNo) || entry.idCardNo || '—') : ''}
                  </td>
                  <td className="border border-slate-700 px-1 py-1">
                    {entry ? entry.address : ''}
                  </td>
                  <td className="text-center border border-slate-700 px-1 py-1">
                    {entry ? entry.phone : ''}
                  </td>
                  <td className="text-center border border-slate-700 px-1 py-1">
                    {entry ? entry.areaRopaniKatta : ''}
                  </td>
                  <td className="font-medium border border-slate-700 px-1.5 py-1">
                    {entry ? entry.fertilizerType : ''}
                  </td>
                  <td className="text-center font-bold border border-slate-700 px-1 py-1">
                    {entry ? `${toDevanagari(entry.quantity)} ${entry.unit || ''}` : ''}
                  </td>
                  <td className="text-right font-bold border border-slate-700 px-1.5 py-1">
                    {entry ? toDevanagari(entry.salePrice) : ''}
                  </td>
                  <td className="text-center font-bold border border-slate-700 px-1 py-1">
                    {entry ? toDevanagari(entry.billNo) : ''}
                  </td>
                  <td className="text-center border border-slate-700 px-1 py-1">
                    {entry ? entry.billDateBS : ''}
                  </td>
                  <td className="text-center border border-slate-700 px-1 py-1 text-[8px] text-slate-400">
                    {entry ? 'सही / ल्याप्चे' : ''}
                  </td>
                  <td className="border border-slate-700 px-1.5 py-1 font-medium">
                    {entry ? (entry.cropType || 'धान / गहुँ') : ''}
                  </td>
                </tr>
              ))}

              {/* Total Summary Row */}
              <tr className="bg-slate-100 font-extrabold border-t-2 border-slate-900">
                <td colSpan={7} className="text-right px-3 py-1.5 font-bold border border-slate-800">
                  कुल जम्मा (Grand Total):
                </td>
                <td className="text-center py-1.5 border border-slate-800 font-extrabold text-emerald-800">
                  {toDevanagari(totalQty)}
                </td>
                <td className="text-right px-1.5 py-1.5 border border-slate-800 font-extrabold text-emerald-800">
                  रु. {toDevanagari(totalAmount)}
                </td>
                <td colSpan={4} className="border border-slate-800"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Official Verification Signatures Block (matches physical form 3) */}
        <div className="mt-8 pt-4 border-t-2 border-slate-800 grid grid-cols-2 gap-8 text-[11px] font-semibold">
          <div>
            <p className="mb-8">पेश गर्ने विक्रेताको हस्ताक्षर: ....................................................</p>
            <p>मिति: ........................................</p>
          </div>
          <div className="space-y-1">
            <p>प्रमाणित गर्ने कर्मचारीको नाम: ....................................................</p>
            <p>थर: ........................................ पद: ........................................</p>
            <p className="mt-4">दस्तखत र कार्यालयको छाप: ....................................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};
