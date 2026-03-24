const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// ── Models ────────────────────────────────────────────────────
const Admin = require('./models/Admin');
const Student = require('./models/Student');
const KnowledgeBase = require('./models/KnowledgeBase');

// ── Config ────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gecw_admission';
const CLEAR_DB = true; // Set to false to keep existing data and only add missing entries

// ── Seed Data ─────────────────────────────────────────────────

const adminSeedData = [
  {
    username: 'admin_gecw',
    plainPassword: 'admin123',
    role: 'Admission Clerk',
    branch: 'All',
  },
  {
    username: 'hod_cse',
    plainPassword: 'hodcse123',
    role: 'HOD',
    branch: 'CSE',
  },
  {
    username: 'hod_ece',
    plainPassword: 'hodece123',
    role: 'HOD',
    branch: 'ECE',
  },
  {
    username: 'hod_eee',
    plainPassword: 'hodeee123',
    role: 'HOD',
    branch: 'EEE',
  },
  {
    username: 'hod_me',
    plainPassword: 'hodme123',
    role: 'HOD',
    branch: 'ME',
  },
  {
    username: 'hod_ce',
    plainPassword: 'hodce123',
    role: 'HOD',
    branch: 'CE',
  },
  {
    username: 'principal_gecw',
    plainPassword: 'principal123',
    role: 'Principal',
    branch: 'All',
  },
];

const studentSeedData = [
  {
    keamAppNumber: 'KEAM2024001',
    plainPassword: 'student123',
    personalDetails: {
      name: 'Arjun Nair',
      email: 'arjun.nair@example.com',
      phone: '9876543210',
      dob: new Date('2005-03-15'),
      address: 'Flat 4B, Green Residency, Ernakulam, Kerala - 682001',
    },
    guardianDetails: {
      name: 'Suresh Nair',
      relation: 'Father',
      phone: '9876543200',
    },
    academicDetails: {
      keamRank: 1245,
      keamRollNo: 'KR24001245',
      plusTwoMarks: 95,
      schoolName: 'Govt. Higher Secondary School, Ernakulam',
    },
    category: 'General',
    branch: 'CSE',
    status: 'Submitted',
    documents: [
      { name: 'KEAM Rank Card', url: '/uploads/sample_doc.pdf', status: 'Pending' },
      { name: '+2 Mark Sheet', url: '/uploads/sample_doc.pdf', status: 'Pending' },
      { name: 'TC Certificate', url: '/uploads/sample_doc.pdf', status: 'Pending' },
    ],
  },
  {
    keamAppNumber: 'KEAM2024002',
    plainPassword: 'student123',
    personalDetails: {
      name: 'Priya Menon',
      email: 'priya.menon@example.com',
      phone: '9876501234',
      dob: new Date('2005-07-22'),
      address: '12, MG Road, Thrissur, Kerala - 680001',
    },
    guardianDetails: {
      name: 'Latha Menon',
      relation: 'Mother',
      phone: '9876501200',
    },
    academicDetails: {
      keamRank: 3102,
      keamRollNo: 'KR24003102',
      plusTwoMarks: 88,
      schoolName: 'St. Thomas HSS, Thrissur',
    },
    category: 'SEBC',
    branch: 'ECE',
    status: 'Verified',
    adminRemarks: 'All documents verified. Awaiting fee payment confirmation.',
    documents: [
      { name: 'KEAM Rank Card', url: '/uploads/sample_doc.pdf', status: 'Verified' },
      { name: '+2 Mark Sheet', url: '/uploads/sample_doc.pdf', status: 'Verified' },
      { name: 'Community Certificate', url: '/uploads/sample_doc.pdf', status: 'Verified' },
      { name: 'TC Certificate', url: '/uploads/sample_doc.pdf', status: 'Pending' },
    ],
  },
  {
    keamAppNumber: 'KEAM2024003',
    plainPassword: 'student123',
    personalDetails: {
      name: 'Mohammed Riyas',
      email: 'riyas.m@example.com',
      phone: '9988776655',
      dob: new Date('2005-01-10'),
      address: 'Near Juma Masjid, Malappuram, Kerala - 676501',
    },
    guardianDetails: {
      name: 'Abdul Razak',
      relation: 'Father',
      phone: '9988776600',
    },
    academicDetails: {
      keamRank: 5780,
      keamRollNo: 'KR24005780',
      plusTwoMarks: 82,
      schoolName: 'MES HSS, Malappuram',
    },
    category: 'General',
    branch: 'ME',
    status: 'Action Required',
    adminRemarks: 'Income certificate missing. Please upload the correct document.',
    documents: [
      { name: 'KEAM Rank Card', url: '/uploads/sample_doc.pdf', status: 'Verified' },
      { name: '+2 Mark Sheet', url: '/uploads/sample_doc.pdf', status: 'Verified' },
      { name: 'Income Certificate', url: '/uploads/sample_doc.pdf', status: 'Rejected', adminFeedback: 'Document is unclear. Please re-upload a legible copy.' },
    ],
  },
  {
    keamAppNumber: 'KEAM2024004',
    plainPassword: 'student123',
    personalDetails: {
      name: 'Divya S Kumar',
      email: 'divya.kumar@example.com',
      phone: '9123456789',
      dob: new Date('2005-11-03'),
      address: 'TC 5/102, Pattom, Thiruvananthapuram, Kerala - 695004',
    },
    guardianDetails: {
      name: 'S Kumar',
      relation: 'Father',
      phone: '9123456700',
    },
    academicDetails: {
      keamRank: 890,
      keamRollNo: 'KR24000890',
      plusTwoMarks: 98,
      schoolName: 'Kendriya Vidyalaya, Pattom, TVM',
    },
    category: 'SC',
    branch: 'CSE',
    status: 'Admitted',
    adminRemarks: 'Welcome to GECW! Orientation on 01-Aug-2024.',
    documents: [
      { name: 'KEAM Rank Card', url: '/uploads/sample_doc.pdf', status: 'Verified' },
      { name: '+2 Mark Sheet', url: '/uploads/sample_doc.pdf', status: 'Verified' },
      { name: 'Caste Certificate', url: '/uploads/sample_doc.pdf', status: 'Verified' },
      { name: 'TC Certificate', url: '/uploads/sample_doc.pdf', status: 'Verified' },
      { name: 'Aadhar Card', url: '/uploads/sample_doc.pdf', status: 'Verified' },
    ],
  },
  {
    keamAppNumber: 'KEAM2024005',
    plainPassword: 'student123',
    personalDetails: {
      name: 'Athira Krishnan',
      email: 'athira.k@example.com',
      phone: '9654321087',
      dob: new Date('2005-05-19'),
      address: 'Plot 7, KSRTC Colony, Kozhikode, Kerala - 673001',
    },
    guardianDetails: {
      name: 'Krishnan Pillai',
      relation: 'Father',
      phone: '9654321000',
    },
    academicDetails: {
      keamRank: 4415,
      keamRollNo: 'KR24004415',
      plusTwoMarks: 85,
      schoolName: 'Govt. Boys HSS, Kozhikode',
    },
    category: 'OEC',
    branch: 'EEE',
    status: 'Submitted',
    documents: [
      { name: 'KEAM Rank Card', url: '/uploads/sample_doc.pdf', status: 'Pending' },
      { name: '+2 Mark Sheet', url: '/uploads/sample_doc.pdf', status: 'Pending' },
    ],
  },
];

const knowledgeBaseSeedData = [
  // Fees
  {
    keywords: ['fees', 'tuition', 'fee structure', 'how much', 'cost', 'charges'],
    answer: 'The tuition fee for B.Tech programmes at GECW is ₹28,700 per year for Kerala Govt. quota seats. Special fee category (NRI, Management) may vary. Please contact the admissions office for the exact fee structure for your category.',
    category: 'Fees',
  },
  {
    keywords: ['fee payment', 'pay fees', 'payment deadline', 'pay online', 'challan'],
    answer: 'Fees can be paid online via the college portal or through State Bank of India (SBI) collect. The fee payment deadline is usually within 7 days of allotment confirmation. Contact the office for the exact challan details.',
    category: 'Fees',
  },
  {
    keywords: ['scholarship', 'financial aid', 'merit scholarship', 'stipend'],
    answer: 'SC/ST students may avail full fee waiver under the state government scholarship scheme. OEC and SEBC students are eligible for fee concessions. Merit scholarships are also available for top-ranking students. Apply through the DCE portal.',
    category: 'Fees',
  },
  // Hostel
  {
    keywords: ['hostel', 'accommodation', 'stay', 'room', 'dormitory'],
    answer: 'GECW has separate hostel facilities for male and female students. The hostel fee is approximately ₹15,000 per semester including mess charges. Seats are limited and allotted on a first-come-first-served basis. Contact the warden\'s office at hostel@gecw.ac.in.',
    category: 'Hostel',
  },
  {
    keywords: ['hostel food', 'mess', 'canteen', 'meals', 'dining'],
    answer: 'The hostel mess provides breakfast, lunch, and dinner. A monthly mess bill of approximately ₹2,500 is charged. Vegetarian and non-vegetarian options are available. The college also has a separate canteen open from 8 AM to 8 PM.',
    category: 'Hostel',
  },
  // Transport
  {
    keywords: ['bus', 'transport', 'college bus', 'shuttle', 'vehicle', 'route'],
    answer: 'GECW operates college buses covering major routes including Ernakulam, Thrissur, Kothamangalam, and Muvattupuzha. Bus pass fee is approximately ₹4,000 per semester. Routes and timings are published on the college website at the start of each semester.',
    category: 'Transport',
  },
  // General
  {
    keywords: ['admission', 'apply', 'how to apply', 'application', 'register', 'application process'],
    answer: 'Admissions at GECW are through the KEAM (Kerala Engineering Architecture Medical) entrance exam conducted by the Commissioner for Entrance Examinations (CEE), Kerala. After rank allotment, visit this portal to submit your admission form, upload required documents, and track your status.',
    category: 'General',
  },
  {
    keywords: ['documents', 'required documents', 'certificates', 'what to bring', 'upload'],
    answer: 'Required documents for admission: (1) KEAM Rank Card, (2) +2 / Class 12 Mark Sheet, (3) Transfer Certificate (TC), (4) Conduct Certificate, (5) Aadhar Card, (6) Community Certificate (if applicable), (7) Income Certificate (for fee concession), (8) Recent Passport-sized Photographs.',
    category: 'General',
  },
  {
    keywords: ['branches', 'departments', 'courses', 'programs', 'btech', 'engineering'],
    answer: 'GECW offers B.Tech programmes in: (1) Computer Science & Engineering (CSE), (2) Electronics & Communication Engineering (ECE), (3) Electrical & Electronics Engineering (EEE), (4) Mechanical Engineering (ME), (5) Civil Engineering (CE). All programmes are 4 years (8 semesters) affiliated to APJ Abdul Kalam Technological University (KTU).',
    category: 'General',
  },
  {
    keywords: ['contact', 'phone number', 'address', 'email', 'office', 'reach'],
    answer: 'GECW Admissions Office: Phone: 0484-2345678 | Email: admissions@gecw.ac.in | Address: Govt. Engineering College Wayanad, Near Town Hall, Mananthavady, Wayanad, Kerala - 670645. Office hours: Mon–Fri, 9 AM – 5 PM.',
    category: 'General',
  },
  {
    keywords: ['status', 'application status', 'check status', 'admission status', 'my application'],
    answer: 'You can check your application status by logging into this portal with your KEAM Application Number and password. The status will show one of: Submitted, Verified, Action Required, or Admitted. If Action Required, please check admin remarks and upload the requested documents.',
    category: 'General',
  },
  {
    keywords: ['deadline', 'last date', 'date', 'schedule', 'when'],
    answer: 'Key admission dates: Document submission deadline is within 3 days of online allotment. Original certificate verification at college is scheduled after online submission. Fee payment must be completed within 7 days of allotment. Check the official CEE Kerala website for the exact academic calendar.',
    category: 'General',
  },
];

// ── Seeding Logic ─────────────────────────────────────────────

async function seedDatabase() {
  try {
    console.log('\n🔌 Connecting to MongoDB...');
    console.log(`   URI: ${MONGODB_URI}\n`);

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!\n');

    if (CLEAR_DB) {
      console.log('🗑️  Clearing existing data...');
      await Admin.deleteMany({});
      await Student.deleteMany({});
      await KnowledgeBase.deleteMany({});
      console.log('   ✓ Admins cleared');
      console.log('   ✓ Students cleared');
      console.log('   ✓ KnowledgeBase cleared\n');
    }

    // ── Seed Admins ──────────────────────────────────────────
    console.log('👤 Seeding Admin accounts...');
    const adminsToInsert = [];
    for (const admin of adminSeedData) {
      const hashedPassword = await bcrypt.hash(admin.plainPassword, 10);
      adminsToInsert.push({
        username: admin.username,
        password: hashedPassword,
        role: admin.role,
        branch: admin.branch,
      });
    }
    await Admin.insertMany(adminsToInsert);
    console.log(`   ✅ ${adminsToInsert.length} admin accounts seeded\n`);

    // ── Seed Students ────────────────────────────────────────
    console.log('🎓 Seeding Student records...');
    const studentsToInsert = [];
    for (const student of studentSeedData) {
      const hashedPassword = await bcrypt.hash(student.plainPassword, 10);
      const { plainPassword, ...rest } = student;
      studentsToInsert.push({ ...rest, password: hashedPassword });
    }
    await Student.insertMany(studentsToInsert);
    console.log(`   ✅ ${studentsToInsert.length} student records seeded\n`);

    // ── Seed KnowledgeBase ───────────────────────────────────
    console.log('💬 Seeding Chatbot KnowledgeBase...');
    await KnowledgeBase.insertMany(knowledgeBaseSeedData);
    console.log(`   ✅ ${knowledgeBaseSeedData.length} knowledge base entries seeded\n`);

    // ── Summary ──────────────────────────────────────────────
    console.log('═══════════════════════════════════════════════════');
    console.log('  🎉  DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('  📋  LOGIN CREDENTIALS\n');
    console.log('  ADMIN ACCOUNTS:');
    adminSeedData.forEach(a => {
      console.log(`    • [${a.role.padEnd(16)}] ${a.username.padEnd(18)} / ${a.plainPassword}  (Branch: ${a.branch})`);
    });
    console.log('\n  STUDENT ACCOUNTS (all use password: student123):');
    studentSeedData.forEach(s => {
      console.log(`    • ${s.keamAppNumber.padEnd(14)} → ${s.personalDetails.name.padEnd(20)} (${s.branch} | ${s.status})`);
    });
    console.log('\n  MongoDB Database : gecw_admission');
    console.log('  Collections      : admins, students, knowledgebases');
    console.log('═══════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 MongoDB is not running. Start it with:');
      console.error('   sudo systemctl start mongod      (Linux)');
      console.error('   brew services start mongodb-community  (macOS)');
      console.error('   Or use MongoDB Atlas cloud — update MONGODB_URI in .env\n');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.\n');
    process.exit(0);
  }
}

seedDatabase();