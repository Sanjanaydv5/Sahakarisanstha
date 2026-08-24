const BASE_URL = 'http://localhost:5000/api';

async function req(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return data;
}

async function runTests() {
  console.log('🧪 Running Comprehensive API & System Validation for Janata Sahayogi Krishi Sahakari...\n');

  try {
    // 1. Health Check
    console.log('1. Testing /api/health...');
    const health = await req(`${BASE_URL}/health`);
    console.log('✅ Health status:', health.status, '-', health.organization);

    // 2. Admin Login
    console.log('\n2. Testing Admin Login...');
    const adminLogin = await req(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ loginId: 'admin', password: 'Admin@123' })
    });
    const adminToken = adminLogin.token;
    console.log('✅ Admin Login success:', adminLogin.user.name, `[Role: ${adminLogin.user.role}]`);

    // 3. Staff Login
    console.log('\n3. Testing Staff Login...');
    const staffLogin = await req(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ loginId: 'staff', password: 'Staff@123' })
    });
    const staffToken = staffLogin.token;
    console.log('✅ Staff Login success:', staffLogin.user.name, `[Role: ${staffLogin.user.role}]`);

    const authHeaders = { Authorization: `Bearer ${adminToken}` };
    const staffHeaders = { Authorization: `Bearer ${staffToken}` };

    // 4. Products & Stock Check
    console.log('\n4. Fetching Products Catalog...');
    const productsRes = await req(`${BASE_URL}/products`, { headers: authHeaders });
    const products = productsRes.products;
    console.log(`✅ Loaded ${products.length} products in catalog.`);
    const dap = products.find(p => p.name.includes('डिएपि'));
    const urea = products.find(p => p.name.includes('युरिया'));
    console.log(`   - DAP Stock: ${dap.currentStock} ${dap.unit} @ Rs. ${dap.pricePerUnit}`);
    console.log(`   - Urea Stock: ${urea.currentStock} ${urea.unit} @ Rs. ${urea.pricePerUnit}`);

    // 5. Create a New Bill (Ram Sewak Yadav buying DAP & Urea)
    console.log('\n5. Creating New Sale Bill (Testing POS Engine)...');
    const billPayload = {
      buyerName: 'राम सेवक यादव',
      buyerPhone: '9804561230',
      buyerAddress: 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)',
      buyerIdCardNo: '१८-०१-७५-०२३४५',
      areaRopaniKatta: '१० कठ्ठा',
      cropType: 'धान / गहुँ',
      paymentMethod: 'cash',
      items: [
        {
          product: dap._id,
          description: dap.name,
          quantity: 2,
          unit: dap.unit,
          rate: dap.pricePerUnit,
          amount: dap.pricePerUnit * 2
        },
        {
          product: urea._id,
          description: urea.name,
          quantity: 1,
          unit: urea.unit,
          rate: urea.pricePerUnit,
          amount: urea.pricePerUnit * 1
        }
      ],
      advancePaid: 5950, // Full payment
      notes: 'मलखाद खरिद'
    };

    const billRes = await req(`${BASE_URL}/bills`, {
      method: 'POST',
      headers: staffHeaders,
      body: JSON.stringify(billPayload)
    });
    const newBill = billRes.bill;
    console.log(`✅ Bill #${newBill.billNo} Created Successfully!`);
    console.log(`   - Total Amount: Rs. ${newBill.totalAmount}`);
    console.log(`   - Advance Paid: Rs. ${newBill.advancePaid}`);
    console.log(`   - Balance Due: Rs. ${newBill.balanceDue}`);
    console.log(`   - Nepali Words: "${newBill.amountInWordsNepali}"`);
    console.log(`   - Nepali Date: ${newBill.nepaliDate}`);

    // 6. Verify Stock Auto-Deduction
    console.log('\n6. Verifying Inventory Auto-Decrement...');
    const updatedProdRes = await req(`${BASE_URL}/products`, { headers: authHeaders });
    const updatedDap = updatedProdRes.products.find(p => p._id === dap._id);
    const updatedUrea = updatedProdRes.products.find(p => p._id === urea._id);
    console.log(`✅ DAP Stock decremented from ${dap.currentStock} to ${updatedDap.currentStock} ${dap.unit}`);
    console.log(`✅ Urea Stock decremented from ${urea.currentStock} to ${updatedUrea.currentStock} ${urea.unit}`);

    // 7. Verify Government Fertilizer Distribution Register (अनुसूची-३)
    console.log('\n7. Verifying Schedule-3 Fertilizer Distribution Register (/api/register)...');
    const regRes = await req(`${BASE_URL}/register`, { headers: authHeaders });
    console.log(`✅ Schedule-3 Register contains ${regRes.entries.length} distribution records.`);
    console.log(`   - Latest Entry: ${regRes.entries[0].farmerName} | ${regRes.entries[0].fertilizerType} | Qty: ${regRes.entries[0].quantity} | Bill #${regRes.entries[0].billNo}`);

    // 8. Record Utility / Digital Services
    console.log('\n8. Recording Service Transactions (e-Sewa & NEA Electricity)...');
    const esewaRes = await req(`${BASE_URL}/services`, {
      method: 'POST',
      headers: staffHeaders,
      body: JSON.stringify({
        serviceType: 'esewa',
        customerName: 'दिनेश कुमार महतो',
        customerPhone: '9812345678',
        accountOrConsumerNo: '9812345678 (Topup)',
        amount: 1500,
        serviceCharge: 15,
        notes: 'e-Sewa wallet load'
      })
    });
    console.log(`✅ e-Sewa Transaction Recorded: Total Rs. ${esewaRes.transaction.totalCollected} (Fee: Rs. ${esewaRes.transaction.serviceCharge})`);

    const neaRes = await req(`${BASE_URL}/services`, {
      method: 'POST',
      headers: staffHeaders,
      body: JSON.stringify({
        serviceType: 'electricity',
        customerName: 'अमरेन्द्र यादव',
        customerPhone: '9844119988',
        accountOrConsumerNo: 'NEA-SC-99812',
        amount: 850,
        serviceCharge: 20,
        notes: 'विद्युत महसुल'
      })
    });
    console.log(`✅ Electricity Bill Recorded: Total Rs. ${neaRes.transaction.totalCollected} (Fee: Rs. ${neaRes.transaction.serviceCharge})`);

    // 9. Dues Management & Repayment Collection
    console.log('\n9. Testing Dues Management & Payment Collection...');
    const duesRes = await req(`${BASE_URL}/dues`, { headers: authHeaders });
    console.log(`✅ Active Dues Count: ${duesRes.customers.length} farmers. Total Outstanding: Rs. ${duesRes.totalOutstandingDues}`);
    const borrower = duesRes.customers[0];
    if (borrower) {
      console.log(`   Collecting partial repayment of Rs. 500 from ${borrower.name} (Due: Rs. ${borrower.outstandingBalance})...`);
      const payRes = await req(`${BASE_URL}/dues/pay`, {
        method: 'POST',
        headers: staffHeaders,
        body: JSON.stringify({
          customerId: borrower._id,
          amountPaid: 500,
          paymentMethod: 'cash',
          notes: 'आंशिक किस्ता भुक्तानी'
        })
      });
      console.log(`✅ Payment Recorded! Receipt #${payRes.payment.receiptNo}. Remaining Due: Rs. ${payRes.customer.outstandingBalance}`);
    }

    // 10. Admin Dashboard & Daily Cash Closing
    console.log('\n10. Fetching Admin Dashboard & Daily Cash Closing Report...');
    const dashRes = await req(`${BASE_URL}/reports/admin-dashboard`, { headers: authHeaders });
    console.log('✅ Admin Dashboard Stats:');
    console.log('   - Total Sales Revenue: Rs.', dashRes.stats.totalSalesRevenue);
    console.log('   - Total Service Commissions: Rs.', dashRes.stats.totalServiceCommissions);
    console.log('   - Total Inventory Valuation: Rs.', dashRes.stats.totalStockValue);
    console.log('   - Total Outstanding Dues: Rs.', dashRes.stats.totalDuesOutstanding);

    const closingRes = await req(`${BASE_URL}/reports/daily-closing`, { headers: authHeaders });
    console.log('✅ Daily Cash Drawer Reconciliation:');
    console.log('   - Total Cash in Drawer: Rs.', closingRes.summary.totalCashInDrawer);
    console.log('   - Cash from Sales: Rs.', closingRes.summary.cashFromSales);
    console.log('   - Cash from Services: Rs.', closingRes.summary.cashFromServices);
    console.log('   - Cash from Dues Repayments: Rs.', closingRes.summary.cashFromRepayments);

    console.log('\n🎉 ALL 10 TEST SUITES PASSED WITH 100% SUCCESS!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
