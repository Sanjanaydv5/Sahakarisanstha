import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { OrgSettings } from '../models/OrgSettings.js';
import { Product } from '../models/Product.js';
import { Customer } from '../models/Customer.js';
import { Bill } from '../models/Bill.js';
import { StockEntry } from '../models/StockEntry.js';
import { SalesRegisterEntry } from '../models/SalesRegisterEntry.js';
import { ServiceTransaction } from '../models/ServiceTransaction.js';
import { PaymentRecord } from '../models/PaymentRecord.js';
import { connectDB } from './db.js';
import { getNepaliDate } from '../utils/nepaliDate.js';
import { numberToNepaliWords } from '../utils/numberToWordsNepali.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting Database Seeding for Janata Sahayogi Krishi Sahakari...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      OrgSettings.deleteMany({}),
      Product.deleteMany({}),
      Customer.deleteMany({}),
      Bill.deleteMany({}),
      StockEntry.deleteMany({}),
      SalesRegisterEntry.deleteMany({}),
      ServiceTransaction.deleteMany({}),
      PaymentRecord.deleteMany({})
    ]);

    // 1. Seed Org Settings
    const orgSettings = await OrgSettings.create({
      nameNepali: 'जनता सहयोगी कृषि सहकारी संस्था लिमिटेड',
      nameEnglish: 'Janata Sahayogi Krishi Sahakari Sanstha Limited',
      addressNepali: 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)',
      addressEnglish: 'Lohaspatti-2, Madhepura, Mahottari',
      phones: ['9844111621', '9814850746'],
      registrationNo: '६८८/०६७/०६८',
      panNo: '६१४२५५४०१',
      panNoEnglish: '614255401',
      establishedYearBS: '२०६७',
      establishedUnder: 'सहकारी ऐन २०४८ नियम २०४९ अन्तर्गत स्थापित',
      nextBillNumber: 252, // Starting sequence
      dispatchPrefix: 'चलानी-',
      letterheadConfig: {
        patraSankhya: '२०८०/०८१',
        defaultSubject: 'मलखाद अनुदान सिफारिस सम्बन्धमा ।'
      }
    });

    // 2. Seed Default Users
    const adminUser = await User.create({
      name: 'प्रशासक (Admin)',
      username: 'admin',
      email: 'admin@janatasahakari.org',
      password: 'Admin@123',
      role: 'admin',
      phone: '9844111621',
      isActive: true,
      mustChangePassword: false
    });

    const managerUser = await User.create({
      name: 'सहकारी व्यवस्थापक (Manager)',
      username: 'manager',
      email: 'manager@janatasahakari.org',
      password: 'Manager@123',
      role: 'manager',
      phone: '9814850746',
      isActive: true,
      mustChangePassword: false
    });

    const staffUser = await User.create({
      name: 'लेखापाल / काउन्टर कर्मचारी (Staff)',
      username: 'staff',
      email: 'staff@janatasahakari.org',
      password: 'Staff@123',
      role: 'staff',
      phone: '9800000000',
      isActive: true,
      mustChangePassword: false
    });

    console.log('✅ Users created: Admin, Manager, Staff');

    // 3. Seed Products (Agro inputs & fertilizers)
    const nepaliDateStr = getNepaliDate().formattedDevanagari;

    const productsData = [
      {
        name: 'डिएपि रासायनिक मल (DAP Fertilizer)',
        nameEnglish: 'DAP Fertilizer (50 kg)',
        category: 'fertilizer',
        unit: 'बोरा (50 kg)',
        currentStock: 150,
        reorderLevel: 25,
        pricePerUnit: 2450,
        costPrice: 2200,
        description: 'उच्च गुणस्तरको डीएपी रासायनिक मल - ५० केजी बोरा'
      },
      {
        name: 'युरिया रासायनिक मल (Urea Fertilizer)',
        nameEnglish: 'Urea Fertilizer (50 kg)',
        category: 'fertilizer',
        unit: 'बोरा (50 kg)',
        currentStock: 220,
        reorderLevel: 30,
        pricePerUnit: 1050,
        costPrice: 950,
        description: 'नेपाल सरकार अनुदानित युरिया मल - ५० केजी बोरा'
      },
      {
        name: 'पोटास रासायनिक मल (Potash Fertilizer)',
        nameEnglish: 'Potash Fertilizer (50 kg)',
        category: 'fertilizer',
        unit: 'बोरा (50 kg)',
        currentStock: 65,
        reorderLevel: 15,
        pricePerUnit: 1850,
        costPrice: 1650,
        description: 'म्युरियट अफ पोटास (MOP) रासायनिक मल'
      },
      {
        name: 'जिंक सल्फेट मल (Zinc Sulphate)',
        nameEnglish: 'Zinc Sulphate (25 kg)',
        category: 'fertilizer',
        unit: 'बोरा (25 kg)',
        currentStock: 35,
        reorderLevel: 10,
        pricePerUnit: 1250,
        costPrice: 1050,
        description: 'माटोको सूक्ष्म पोषक तत्व परिपूर्ति गर्ने जिंक मल'
      },
      {
        name: 'उन्नत धानको बीउ (Hybrid Paddy Seed)',
        nameEnglish: 'Paddy Seed (5 kg)',
        category: 'seed',
        unit: 'प्याकेट (5 kg)',
        currentStock: 80,
        reorderLevel: 20,
        pricePerUnit: 750,
        costPrice: 620,
        description: 'उन्नत जातको धानको बीउ - ५ केजी प्याकेट'
      },
      {
        name: 'उन्नत गहुँको बीउ (NL-971 Wheat Seed)',
        nameEnglish: 'Wheat Seed (40 kg)',
        category: 'seed',
        unit: 'बोरा (40 kg)',
        currentStock: 45,
        reorderLevel: 15,
        pricePerUnit: 2200,
        costPrice: 1900,
        description: 'NL-971 उन्नत गहुँको बीउ - ४० केजी'
      },
      {
        name: 'कीटनाशक विषादी (Chlorpyrifos)',
        nameEnglish: 'Chlorpyrifos 20% EC (1 Ltr)',
        category: 'pesticide',
        unit: 'लिटर',
        currentStock: 8, // Low stock trigger
        reorderLevel: 10,
        pricePerUnit: 850,
        costPrice: 700,
        description: 'बालीनालीमा लाग्ने कीरा नियन्त्रण गर्ने विषादी'
      }
    ];

    const products = await Product.insertMany(productsData);

    // Create Initial Stock Entries for products
    for (const p of products) {
      await StockEntry.create({
        product: p._id,
        type: 'in',
        quantity: p.currentStock,
        previousStock: 0,
        newStock: p.currentStock,
        unitPrice: p.costPrice,
        totalAmount: p.currentStock * p.costPrice,
        supplierName: 'कृषि सामग्री कम्पनी लिमिटेड, जनकपुर',
        supplierInvoiceNo: 'KSCL-INV-401',
        nepaliDate: nepaliDateStr,
        reference: 'Initial Stock Ingestion',
        performedBy: managerUser._id,
        notes: 'Cooperative inventory baseline'
      });
    }

    console.log(`✅ ${products.length} Products & Stock Entries seeded.`);

    // 4. Seed Customers / Farmers (लोहारपट्टी-२, मधेपुरा)
    const customersData = [
      {
        name: 'राम सेवक यादव',
        idCardNo: '१८-०१-७५-०२३४५',
        address: 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)',
        phone: '9804561230',
        area: '१० कठ्ठा',
        cropType: 'धान / गहुँ',
        outstandingBalance: 1450,
        totalPurchases: 7450,
        createdBy: staffUser._id
      },
      {
        name: 'राम पुकार साह',
        idCardNo: '१८-०१-७२-०८९१२',
        address: 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)',
        phone: '9814789012',
        area: '१ बिघा (२० कठ्ठा)',
        cropType: 'उखु / धान',
        outstandingBalance: 0,
        totalPurchases: 12500,
        createdBy: staffUser._id
      },
      {
        name: 'विरेन्द्र महतो',
        idCardNo: '१८-०१-६९-०४४११',
        address: 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)',
        phone: '9844112233',
        area: '५ कठ्ठा',
        cropType: 'तरकारी खेती / मकै',
        outstandingBalance: 2100,
        totalPurchases: 5600,
        createdBy: staffUser._id
      },
      {
        name: 'सीता देवी थारु',
        idCardNo: '१८-०१-७६-०११२३',
        address: 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)',
        phone: '9807123456',
        area: '७ कठ्ठा',
        cropType: 'धान / तोरी',
        outstandingBalance: 0,
        totalPurchases: 4900,
        createdBy: staffUser._id
      },
      {
        name: 'सुनिल कुमार यादव',
        idCardNo: '१८-०१-७४-०६५४३',
        address: 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)',
        phone: '9812345678',
        area: '१५ कठ्ठा',
        cropType: 'धान / गहुँ / दलहन',
        outstandingBalance: 3500,
        totalPurchases: 15400,
        createdBy: staffUser._id
      }
    ];

    const customers = await Customer.insertMany(customersData);
    console.log(`✅ ${customers.length} Farmers / Customers seeded.`);

    // 5. Seed Sample Bill #251 matching the photo voucher
    const dapProduct = products.find(p => p.name.includes('डिएपि'));
    const ureaProduct = products.find(p => p.name.includes('युरिया'));
    const potashProduct = products.find(p => p.name.includes('पोटास'));

    const bill251Items = [
      {
        product: dapProduct._id,
        description: 'डिएपि रासायनिक मल',
        quantity: 2,
        unit: 'बोरा',
        rate: 2450,
        amount: 4900
      },
      {
        product: ureaProduct._id,
        description: 'युरिया रासायनिक मल',
        quantity: 2,
        unit: 'बोरा',
        rate: 1050,
        amount: 2100
      }
    ];

    const bill251Total = 7000;
    const bill251Advance = 5550;
    const bill251Balance = 1450;

    const sampleBill251 = await Bill.create({
      billNo: 251,
      date: new Date(),
      nepaliDate: nepaliDateStr,
      customer: customers[0]._id,
      buyerName: customers[0].name,
      buyerAddress: customers[0].address,
      buyerPhone: customers[0].phone,
      buyerIdCardNo: customers[0].idCardNo,
      areaRopaniKatta: customers[0].area,
      cropType: customers[0].cropType,
      paymentMethod: 'cash',
      items: bill251Items,
      totalAmount: bill251Total,
      advancePaid: bill251Advance,
      balanceDue: bill251Balance,
      amountInWordsNepali: numberToNepaliWords(bill251Total),
      status: 'partial',
      createdBy: staffUser._id,
      notes: 'मलखाद बिक्री बिल'
    });

    // Create Sales Register Entries for Bill 251
    for (const item of bill251Items) {
      await SalesRegisterEntry.create({
        farmerName: customers[0].name,
        idCardNo: customers[0].idCardNo,
        address: customers[0].address,
        phone: customers[0].phone,
        areaRopaniKatta: customers[0].area,
        fertilizerType: item.description,
        quantity: item.quantity,
        unit: item.unit,
        salePrice: item.amount,
        billNo: 251,
        billDateBS: nepaliDateStr,
        billDateAD: new Date(),
        cropType: customers[0].cropType,
        dispatchNo: 'चलानी-२५१',
        billRef: sampleBill251._id,
        customerRef: customers[0]._id,
        productRef: item.product,
        performedBy: staffUser._id
      });
    }

    // Additional Register Entries for other farmers
    await SalesRegisterEntry.create({
      farmerName: customers[1].name,
      idCardNo: customers[1].idCardNo,
      address: customers[1].address,
      phone: customers[1].phone,
      areaRopaniKatta: customers[1].area,
      fertilizerType: 'युरिया रासायनिक मल',
      quantity: 5,
      unit: 'बोरा',
      salePrice: 5250,
      billNo: 250,
      billDateBS: nepaliDateStr,
      billDateAD: new Date(Date.now() - 86400000),
      cropType: 'उखु खेती',
      dispatchNo: 'चलानी-२५०',
      customerRef: customers[1]._id,
      productRef: ureaProduct._id,
      performedBy: staffUser._id
    });

    await SalesRegisterEntry.create({
      farmerName: customers[3].name,
      idCardNo: customers[3].idCardNo,
      address: customers[3].address,
      phone: customers[3].phone,
      areaRopaniKatta: customers[3].area,
      fertilizerType: 'पोटास रासायनिक मल',
      quantity: 2,
      unit: 'बोरा',
      salePrice: 3700,
      billNo: 249,
      billDateBS: nepaliDateStr,
      billDateAD: new Date(Date.now() - 172800000),
      cropType: 'धान बाली',
      dispatchNo: 'चलानी-२४९',
      customerRef: customers[3]._id,
      productRef: potashProduct._id,
      performedBy: staffUser._id
    });

    console.log('✅ Bill #251 and Schedule-3 Fertilizer Distribution Register records seeded.');

    // 6. Seed Service Transactions (e-Sewa, NEA electricity, Money transfer, Photocopy)
    const servicesData = [
      {
        serviceType: 'esewa',
        customerName: 'दीपक कुमार मण्डल',
        customerPhone: '9801234567',
        accountOrConsumerNo: '9801234567 (Wallet Topup)',
        pagesOrQuantity: 1,
        amount: 2500,
        serviceCharge: 25,
        totalCollected: 2525,
        nepaliDate: nepaliDateStr,
        createdBy: staffUser._id,
        notes: 'e-Sewa wallet load'
      },
      {
        serviceType: 'electricity',
        customerName: 'श्याम सुन्दर राय',
        customerPhone: '9844001122',
        accountOrConsumerNo: 'NEA-SC-104928 (Jaleshwar Branch)',
        pagesOrQuantity: 1,
        amount: 1420,
        serviceCharge: 20,
        totalCollected: 1440,
        nepaliDate: nepaliDateStr,
        createdBy: staffUser._id,
        notes: 'विद्युत महसुल भुक्तानी'
      },
      {
        serviceType: 'moneyTransfer',
        customerName: 'अशोक कुमार साह',
        customerPhone: '9811223344',
        accountOrConsumerNo: 'MTCN-98234-871 (IME Pay/Prabhu)',
        pagesOrQuantity: 1,
        amount: 15000,
        serviceCharge: 150,
        totalCollected: 15150,
        nepaliDate: nepaliDateStr,
        createdBy: staffUser._id,
        notes: 'रेमिट्यान्स भुक्तानी'
      },
      {
        serviceType: 'photocopy',
        customerName: 'राजेन्द्र यादव',
        customerPhone: '9800000000',
        accountOrConsumerNo: 'नागरिकता + जग्गाधनी प्रमाण पुर्जा (लालपुर्जा)',
        pagesOrQuantity: 10,
        amount: 50,
        serviceCharge: 50,
        totalCollected: 50,
        nepaliDate: nepaliDateStr,
        createdBy: staffUser._id,
        notes: '१० प्रति फोटोकपी'
      },
      {
        serviceType: 'printout',
        customerName: 'किरण देवी',
        customerPhone: '9812998877',
        accountOrConsumerNo: 'कृषि अनुदान आवेदन फारम',
        pagesOrQuantity: 4,
        amount: 40,
        serviceCharge: 40,
        totalCollected: 40,
        nepaliDate: nepaliDateStr,
        createdBy: staffUser._id,
        notes: '४ प्रति रङ्गीन/सादा प्रिन्ट'
      }
    ];

    await ServiceTransaction.insertMany(servicesData);
    console.log('✅ 5 Utility & Financial Service transactions seeded.');

    console.log('✨ All seed data created successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
};

// If run directly via `npm run seed`
if (process.argv[1].endsWith('seed.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}
