import React from 'react';
import { toDevanagari, formatNPR, numberToWordsNepali } from '../../utils/nepaliConverter';
import { Printer } from 'lucide-react';

export const BillVoucherPrint = ({ bill, orgSettings, onPrint }) => {
  if (!bill) return null;

  const org = orgSettings || {
    nameNepali: 'जनता सहयोगी कृषि सहकारी संस्था लिमिटेड',
    addressNepali: 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)',
    phones: ['9844111621', '9814850746'],
    panNo: '६१४२५५४०१'
  };

  const panDigits = (org.panNo || '६१४२५५४०१').replace(/\D/g, '').split('');

  // Physical receipt has ~10 row slots
  const totalSlots = Math.max(8, bill.items?.length || 0);
  const rows = [...(bill.items || [])];
  while (rows.length < totalSlots) {
    rows.push(null);
  }

  const getPaymentMethodNepali = (method) => {
    switch (method) {
      case 'cash': return 'नगद';
      case 'cheque': return 'चेक';
      case 'credit': return 'उधारो';
      default: return 'अन्य';
    }
  };

  const words = bill.amountInWordsNepali || numberToWordsNepali(bill.totalAmount);

  return (
    <div className="flex flex-col items-center">
      {/* Action toolbar (hidden on print) */}
      <div className="w-full max-w-md flex justify-end mb-3 no-print">
        <button
          onClick={onPrint || (() => window.print())}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition"
        >
          <Printer className="w-4 h-4" />
          <span>भौचर प्रिन्ट गर्नुहोस् (Print Physical Bill)</span>
        </button>
      </div>

      {/* Exact replica of the yellow physical voucher from reference image */}
      <div className="print-area voucher-paper w-[390px] min-h-[640px] p-4 bg-[#fefce8] border-2 border-slate-900 shadow-xl text-slate-900 rounded-sm leading-tight text-xs selection:bg-amber-200">
        {/* Top Header */}
        <div className="text-center border-b-2 border-slate-900 pb-2">
          <h2 className="text-base font-extrabold tracking-tight text-slate-950 font-devanagari">
            {org.nameNepali}
          </h2>
          <p className="text-[11px] font-bold text-slate-800 mt-0.5">
            {org.addressNepali} ✆ {org.phones?.join(' ✆ ')}
          </p>
        </div>

        {/* PAN No & Date Row */}
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[11px]">पान नं.</span>
            <div className="flex border border-slate-900">
              {panDigits.map((digit, idx) => (
                <span
                  key={idx}
                  className="w-4 h-4 text-center border-r border-slate-900 last:border-r-0 font-bold text-[10px] flex items-center justify-center bg-white"
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-bold text-[11px]">मिति:</span>
            <span className="font-bold border-b border-slate-900 px-2 min-w-[70px] text-center">
              {bill.nepaliDate}
            </span>
          </div>
        </div>

        {/* Buyer Info Fields */}
        <div className="mt-2 space-y-1 text-[11px]">
          <div className="flex items-center">
            <span className="font-bold whitespace-nowrap">क्रेताको नाम:</span>
            <span className="font-bold border-b border-slate-900 flex-1 ml-1 px-1">
              {bill.buyerName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center flex-1">
              <span className="font-bold whitespace-nowrap">ठेगाना:</span>
              <span className="border-b border-slate-900 flex-1 ml-1 px-1">
                {bill.buyerAddress}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-bold whitespace-nowrap">मो.:</span>
              <span className="font-bold border-b border-slate-900 ml-1 px-1 min-w-[85px]">
                {bill.buyerPhone || '—'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <div className="text-[10.5px]">
              <span className="font-bold">भुक्तानीको तरिका: </span>
              <span className="font-semibold px-1 py-0.5 border border-slate-800 bg-white rounded-xs">
                {getPaymentMethodNepali(bill.paymentMethod)}
              </span>
            </div>

            <div className="flex items-center">
              <span className="font-bold mr-1">बिल नं.:</span>
              <span className="border-2 border-slate-900 bg-white px-2.5 py-0.5 font-extrabold text-sm tracking-wider font-mono">
                {toDevanagari(bill.billNo) || bill.billNo}
              </span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full mt-2.5 voucher-table text-[10.5px]">
          <thead>
            <tr className="bg-amber-100/60 font-extrabold text-center border-b border-slate-900">
              <th className="py-1 px-1 w-8 border-r border-slate-900">सि.नं.</th>
              <th className="py-1 px-1.5 border-r border-slate-900 text-left">विवरण</th>
              <th className="py-1 px-1 w-14 border-r border-slate-900">परिमाण</th>
              <th className="py-1 px-1 w-12 border-r border-slate-900">दर</th>
              <th className="py-1 px-1.5 w-16 text-right">रकम रु.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, idx) => (
              <tr key={idx} className="h-6 border-b border-slate-900/60">
                <td className="text-center border-r border-slate-900 py-0.5 font-semibold">
                  {item ? toDevanagari(idx + 1) : ''}
                </td>
                <td className="px-1.5 border-r border-slate-900 py-0.5 font-medium">
                  {item ? item.description : ''}
                </td>
                <td className="text-center border-r border-slate-900 py-0.5">
                  {item ? `${toDevanagari(item.quantity)} ${item.unit || ''}` : ''}
                </td>
                <td className="text-center border-r border-slate-900 py-0.5">
                  {item ? toDevanagari(item.rate) : ''}
                </td>
                <td className="text-right px-1.5 py-0.5 font-bold">
                  {item ? toDevanagari(item.amount) : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bottom Totals & Words */}
        <div className="mt-2 border-t-2 border-slate-900 pt-1.5 flex justify-between gap-2 text-[11px]">
          <div className="flex-1 pr-2">
            <div className="text-[10px]">
              <span className="font-bold">अक्षरेपी रु.: </span>
              <span className="font-semibold underline decoration-dotted">
                {words}
              </span>
            </div>
            <div className="mt-8 flex justify-between text-[9px] text-slate-700 font-semibold">
              <div>..................................<br />क्रेताको हस्ताक्षर</div>
              <div>..................................<br />फाँटवाला / विक्रेता</div>
            </div>
          </div>

          {/* Right Totals Box */}
          <div className="w-36 border border-slate-900 divide-y divide-slate-900 text-[11px] bg-white">
            <div className="flex justify-between px-2 py-0.5">
              <span className="font-bold">जम्मा:</span>
              <span className="font-bold">रु. {toDevanagari(bill.totalAmount)}</span>
            </div>
            <div className="flex justify-between px-2 py-0.5">
              <span className="font-bold">पेश्की:</span>
              <span className="font-semibold">रु. {toDevanagari(bill.advancePaid || 0)}</span>
            </div>
            <div className="flex justify-between px-2 py-0.5 bg-amber-50">
              <span className="font-bold text-red-700">बाँकी:</span>
              <span className="font-bold text-red-700">रु. {toDevanagari(bill.balanceDue || 0)}</span>
            </div>
          </div>
        </div>

        {/* Void watermark if cancelled */}
        {bill.status === 'void' && (
          <div className="mt-2 text-center text-red-600 font-extrabold text-sm border-2 border-red-600 p-1 uppercase">
            *** रद्द गरिएको बिल (VOIDED) ***
          </div>
        )}
      </div>
    </div>
  );
};
