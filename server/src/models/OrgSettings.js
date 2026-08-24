import mongoose from 'mongoose';

const orgSettingsSchema = new mongoose.Schema({
  nameNepali: {
    type: String,
    default: 'जनता सहयोगी कृषि सहकारी संस्था लिमिटेड'
  },
  nameEnglish: {
    type: String,
    default: 'Janata Sahayogi Krishi Sahakari Sanstha Limited'
  },
  addressNepali: {
    type: String,
    default: 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)'
  },
  addressEnglish: {
    type: String,
    default: 'Lohaspatti-2, Madhepura, Mahottari'
  },
  phones: {
    type: [String],
    default: ['9844111621', '9814850746']
  },
  registrationNo: {
    type: String,
    default: '६८८/०६७/०६८' // 688/067/068
  },
  panNo: {
    type: String,
    default: '६१४२५५४०१' // 614255401
  },
  panNoEnglish: {
    type: String,
    default: '614255401'
  },
  establishedYearBS: {
    type: String,
    default: '२०६७' // 2067 BS
  },
  establishedUnder: {
    type: String,
    default: 'सहकारी ऐन २०४८ नियम २०४९ अन्तर्गत स्थापित'
  },
  billNumberPrefix: {
    type: String,
    default: ''
  },
  nextBillNumber: {
    type: Number,
    default: 251 // Physical bill sequence starting point from user photo
  },
  dispatchPrefix: {
    type: String,
    default: 'चलानी-'
  },
  letterheadConfig: {
    patraSankhya: {
      type: String,
      default: '२०८०/०८१'
    },
    defaultSubject: {
      type: String,
      default: 'सिफारिस सम्बन्धमा ।'
    }
  }
}, {
  timestamps: true
});

export const OrgSettings = mongoose.model('OrgSettings', orgSettingsSchema);
