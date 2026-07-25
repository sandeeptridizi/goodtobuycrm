import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { getAll, getWhere, createDoc } from './db/index.js';

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contact@goodtobuy.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'goodtobuy@123';

async function ensureAdminUser(): Promise<string> {
  const existing = await getWhere('users', 'email', '==', ADMIN_EMAIL);
  if (existing.length > 0) {
    console.log(`Admin user ${ADMIN_EMAIL} already exists`);
    return existing[0].id;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const user = await createDoc('users', {
    email: ADMIN_EMAIL,
    password_hash: passwordHash,
    name: 'GoodToBuy Admin',
  });
  console.log(`Created admin user ${ADMIN_EMAIL} (password from ADMIN_PASSWORD in .env)`);
  return user.id;
}

async function seed() {
  try {
    console.log('Connecting to Firestore...');

    // Always make sure the login user exists
    const userId = await ensureAdminUser();

    // Check if data already exists
    const existingProperties = await getAll('properties');
    if (existingProperties.length > 0) {
      console.log('Firestore already has data, skipping seed...');
      process.exit(0);
    }

    console.log('Seeding data...');

    // Seed Properties
    const properties = [
      {
        title: 'Luxury Villa in Bandra West',
        description: 'Stunning 4BHK villa with modern amenities, private garden, and panoramic city views.',
        address: '15th Road, Bandra West',
        city: 'Mumbai',
        price: 65000000,
        type: 'Villa',
        status: 'Available',
        bedrooms: 4,
        bathrooms: 3,
        area: 3200,
        floors: 3,
        car_parking: 2,
        facing: 'North',
        amenities: ['Swimming Pool', 'Garden', 'Gym', 'Security', 'Power Backup']
      },
      {
        title: 'Modern Apartment in Koramangala',
        description: 'Spacious 3BHK apartment in the heart of Bangalore tech hub.',
        address: '5th Block, Koramangala',
        city: 'Bangalore',
        price: 45000000,
        type: 'Apartment',
        status: 'Available',
        bedrooms: 3,
        bathrooms: 2,
        area: 2100,
        floors: 1,
        car_parking: 1,
        facing: 'East',
        amenities: ['Club House', 'Swimming Pool', 'Gym', '24/7 Security']
      },
      {
        title: 'Beach House in North Goa',
        description: 'Beautiful 5 bedroom beachfront property with direct beach access.',
        address: 'Anjuna Beach Road',
        city: 'Goa',
        price: 120000000,
        type: 'House',
        status: 'Sold',
        bedrooms: 5,
        bathrooms: 4,
        area: 4500,
        floors: 2,
        car_parking: 3,
        facing: 'West',
        amenities: ['Beach Access', 'Private Pool', 'Bar', 'Garden']
      },
      {
        title: 'Penthouse in Marine Drive',
        description: 'Exclusive penthouse with breathtaking sea views and premium finishes.',
        address: 'Marine Drive',
        city: 'Mumbai',
        price: 95000000,
        type: 'Penthouse',
        status: 'Available',
        bedrooms: 4,
        bathrooms: 4,
        area: 4000,
        floors: 1,
        car_parking: 3,
        facing: 'South',
        amenities: ['Sea View', 'Private Terrace', 'Home Automation', 'Concierge']
      },
      {
        title: 'Commercial Space in Connaught Place',
        description: 'Prime retail space in the heart of Delhi commercial district.',
        address: 'Block A, Connaught Place',
        city: 'Delhi',
        price: 80000000,
        type: 'Commercial',
        status: 'Available',
        bedrooms: 0,
        bathrooms: 2,
        area: 2500,
        floors: 1,
        car_parking: 0,
        facing: 'North',
        amenities: ['Central AC', 'Power Backup', 'Security']
      },
      {
        title: 'Farm House in Gurgaon',
        description: 'Luxurious farm house on 1 acre plot with organic farm.',
        address: 'Farm Houses Road',
        city: 'Gurgaon',
        price: 55000000,
        type: 'Villa',
        status: 'Available',
        bedrooms: 5,
        bathrooms: 5,
        area: 6000,
        land_area: 43560,
        floors: 2,
        car_parking: 4,
        facing: 'East',
        amenities: ['Organic Farm', 'Pool', 'Tennis Court', 'Staff Quarters']
      },
      {
        title: 'Studio Apartment in HSR Layout',
        description: 'Compact and modern studio perfect for young professionals.',
        address: 'HSR Layout Sector 2',
        city: 'Bangalore',
        price: 25000000,
        type: 'Apartment',
        status: 'Available',
        bedrooms: 1,
        bathrooms: 1,
        area: 650,
        floors: 1,
        car_parking: 1,
        facing: 'North',
        amenities: ['Gym', 'Co-working Space', 'Cafe']
      },
      {
        title: 'Row House in Powai',
        description: 'Elegant 3BHK row house in serene Powai neighborhood.',
        address: 'Powai Gardens',
        city: 'Mumbai',
        price: 35000000,
        type: 'House',
        status: 'Pending',
        bedrooms: 3,
        bathrooms: 3,
        area: 1800,
        floors: 2,
        car_parking: 1,
        facing: 'South',
        amenities: ['Garden', 'Club House', 'Security']
      },
      {
        title: 'Luxury Plot in Whitefield',
        description: 'Premium residential plot in Whitefield IT hub.',
        address: 'ITPL Main Road',
        city: 'Bangalore',
        price: 18000000,
        type: 'Land',
        status: 'Available',
        bedrooms: 0,
        bathrooms: 0,
        area: 4000,
        land_area: 4000,
        floors: 0,
        car_parking: 0,
        facing: 'East',
        amenities: ['Gated Community', '24/7 Security']
      },
      {
        title: 'Heritage Bungalow in Juhu',
        description: 'Classic bungalow with modern renovations in prestigious Juhu.',
        address: 'Juhu Tara Road',
        city: 'Mumbai',
        price: 120000000,
        type: 'Villa',
        status: 'Available',
        bedrooms: 6,
        bathrooms: 5,
        area: 5500,
        floors: 2,
        car_parking: 4,
        facing: 'West',
        amenities: ['Private Beach Access', 'Pool', 'Home Theater', 'Staff Quarters']
      }
    ];

    const propertyIds: string[] = [];
    for (const prop of properties) {
      const created = await createDoc('properties', { ...prop, added_by: userId });
      propertyIds.push(created.id);
    }
    console.log(`Seeded ${properties.length} properties`);

    // Seed Buyers
    const buyers = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        phone: '+91 98765 43210',
        budget_min: 60000000,
        budget_max: 80000000,
        property_types: ['Villa', 'Penthouse'],
        min_bedrooms: 3,
        max_bedrooms: 5,
        min_bathrooms: 2,
        min_area: 2500,
        preferred_locations: ['Mumbai', 'Bandra', 'Juhu'],
        status: 'Active',
        lead_source: 'Website',
        timeline: '3-6 months',
        financing: 'Self Financed'
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@email.com',
        phone: '+91 98234 56789',
        budget_min: 40000000,
        budget_max: 55000000,
        property_types: ['Apartment'],
        min_bedrooms: 2,
        max_bedrooms: 3,
        min_bathrooms: 2,
        min_area: 1500,
        preferred_locations: ['Mumbai'],
        status: 'Active',
        lead_source: 'Referral',
        timeline: '1-3 months',
        financing: 'Home Loan'
      },
      {
        name: 'Arjun Reddy',
        email: 'arjun.reddy@email.com',
        phone: '+91 97654 32109',
        budget_min: 120000000,
        budget_max: 150000000,
        property_types: ['Penthouse', 'Villa'],
        min_bedrooms: 4,
        max_bedrooms: 6,
        min_bathrooms: 3,
        min_area: 4000,
        preferred_locations: ['Mumbai', 'Bangalore'],
        status: 'Qualified',
        lead_source: 'Walk-in',
        timeline: '6-12 months',
        financing: 'Self Financed'
      },
      {
        name: 'Ananya Iyer',
        email: 'ananya.iyer@email.com',
        phone: '+91 96543 21098',
        budget_min: 35000000,
        budget_max: 50000000,
        property_types: ['Apartment', 'House'],
        min_bedrooms: 2,
        max_bedrooms: 3,
        min_bathrooms: 2,
        min_area: 1200,
        preferred_locations: ['Bangalore'],
        status: 'Closed',
        lead_source: 'Social Media',
        timeline: 'Completed',
        financing: 'Home Loan'
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@email.com',
        phone: '+91 95432 10987',
        budget_min: 25000000,
        budget_max: 35000000,
        property_types: ['Apartment', 'House'],
        min_bedrooms: 2,
        max_bedrooms: 3,
        min_bathrooms: 2,
        min_area: 1000,
        preferred_locations: ['Gurgaon', 'Delhi'],
        status: 'Active',
        lead_source: 'Website',
        timeline: '2-4 months',
        financing: 'Home Loan'
      },
      {
        name: 'Sneha Gupta',
        email: 'sneha.gupta@email.com',
        phone: '+91 94321 09876',
        budget_min: 80000000,
        budget_max: 100000000,
        property_types: ['Villa', 'Penthouse'],
        min_bedrooms: 4,
        max_bedrooms: 5,
        min_bathrooms: 4,
        min_area: 3500,
        preferred_locations: ['Mumbai', 'Goa'],
        status: 'Active',
        lead_source: 'Referral',
        timeline: '3-6 months',
        financing: 'Self Financed'
      },
      {
        name: 'Rahul Mehta',
        email: 'rahul.mehta@email.com',
        phone: '+91 93210 98765',
        budget_min: 15000000,
        budget_max: 25000000,
        property_types: ['Apartment', 'Studio'],
        min_bedrooms: 1,
        max_bedrooms: 2,
        min_bathrooms: 1,
        min_area: 500,
        preferred_locations: ['Bangalore'],
        status: 'Active',
        lead_source: 'Website',
        timeline: '1-2 months',
        financing: 'Home Loan'
      },
      {
        name: 'Kavita Nair',
        email: 'kavita.nair@email.com',
        phone: '+91 92109 87654',
        budget_min: 45000000,
        budget_max: 60000000,
        property_types: ['Apartment', 'Penthouse'],
        min_bedrooms: 3,
        max_bedrooms: 4,
        min_bathrooms: 2,
        min_area: 2000,
        preferred_locations: ['Mumbai', 'Pune'],
        status: 'Qualified',
        lead_source: 'Phone',
        timeline: '4-6 months',
        financing: 'Self Financed'
      }
    ];

    for (const buyer of buyers) {
      await createDoc('buyers', buyer);
    }
    console.log(`Seeded ${buyers.length} buyers`);

    // Seed Sellers (property_ids links sellers to the properties they are selling)
    const sellers = [
      {
        name: 'Mohan Enterprises Pvt Ltd',
        email: 'contact@mohanenterprises.com',
        phone: '+91 98765 11111',
        address: 'Nariman Point, Mumbai',
        status: 'Active',
        selling_reason: 'Relocating overseas',
        timeline: '3 months',
        property_ids: [propertyIds[0]]
      },
      {
        name: 'Sharma Family Trust',
        email: 'sharma.trust@email.com',
        phone: '+91 98765 22222',
        address: 'Andheri West, Mumbai',
        status: 'Active',
        selling_reason: 'Property consolidation',
        timeline: '6 months',
        property_ids: [propertyIds[2]]
      },
      {
        name: 'Global Realty Corp',
        email: 'sales@globalrealty.in',
        phone: '+91 98765 33333',
        address: 'MG Road, Bangalore',
        status: 'Active',
        selling_reason: 'Portfolio restructuring',
        timeline: 'Immediate',
        property_ids: [propertyIds[1]]
      },
      {
        name: 'Ahuja Properties',
        email: 'info@ahuja.co.in',
        phone: '+91 98765 44444',
        address: 'Koregaon Park, Pune',
        status: 'Active',
        selling_reason: 'Downsizing',
        timeline: '4 months',
        property_ids: [propertyIds[5]]
      },
      {
        name: 'Kapoor Estate',
        email: 'kapoor.estate@email.com',
        phone: '+91 98765 55555',
        address: 'Vasant Kunj, Delhi',
        status: 'Inactive',
        selling_reason: 'NRI settlement',
        timeline: '12 months',
        property_ids: []
      }
    ];

    for (const seller of sellers) {
      await createDoc('sellers', { ...seller, preferred_agent: userId });
    }
    console.log(`Seeded ${sellers.length} sellers`);

    // Seed Enquiries
    const enquiries = [
      { name: 'West', email: 'west@email.com', phone: '+91 99999 11111', property: 'Luxury Villa in Bandra West', message: 'Interested in viewing this weekend', status: 'New', source: 'Website' },
      { name: 'Sneha Gupta', email: 'sneha.g@email.com', phone: '+91 99999 22222', property: 'Modern Apartment in Koramangala', message: 'Looking for 3BHK under 50L', status: 'Contacted', source: 'Website' },
      { name: 'Rohan Das', email: 'rohan.das@email.com', phone: '+91 99999 33333', property: 'Penthouse in Marine Drive', message: 'Budget is 1Cr+, please share details', status: 'Qualified', source: 'Referral' },
      { name: 'Neha Kapoor', email: 'neha.k@email.com', phone: '+91 99999 44444', property: 'Farm House in Gurgaon', message: 'Family looking for weekend home', status: 'Scheduled', source: 'Phone' },
      { name: 'Amit Verma', email: 'amit.v@email.com', phone: '+91 99999 55555', property: 'Studio Apartment in HSR Layout', message: 'First home buyer, need loan info', status: 'New', source: 'Social Media' },
      { name: 'Pooja Shah', email: 'pooja.shah@email.com', phone: '+91 99999 66666', property: 'Beach House in North Goa', message: 'Investment purpose, please share ROI', status: 'Contacted', source: 'Email' },
      { name: 'Suresh Rao', email: 'suresh.rao@email.com', phone: '+91 99999 77777', property: 'Commercial Space in Connaught Place', message: 'Starting retail business, need 2000sqft', status: 'Qualified', source: 'Walk-in' },
      { name: 'Lisa Fernandez', email: 'lisa.f@email.com', phone: '+91 99999 88888', property: 'Heritage Bungalow in Juhu', message: 'Luxury buyer, prefer sea facing', status: 'New', source: 'Referral' }
    ];

    for (const enquiry of enquiries) {
      await createDoc('enquiries', enquiry);
    }
    console.log(`Seeded ${enquiries.length} enquiries`);

    // Seed Employees
    const employees = [
      { name: 'Priya Sharma', email: 'priya.sharma@goodtobuy.in', phone: '+91 98765 90001', role: 'Senior Sales Manager', department: 'Sales', skills: ['Negotiation', 'Client Relations', 'Market Analysis'], languages: ['English', 'Hindi', 'Marathi'] },
      { name: 'Amit Joshi', email: 'amit.joshi@goodtobuy.in', phone: '+91 98765 90002', role: 'Property Consultant', department: 'Sales', skills: ['Property Valuation', 'Site Visits', 'Documentation'], languages: ['English', 'Hindi', 'Gujarati'] },
      { name: 'Sneha Desai', email: 'sneha.desai@goodtobuy.in', phone: '+91 98765 90003', role: 'Marketing Lead', department: 'Marketing', skills: ['Digital Marketing', 'Lead Generation', 'Analytics'], languages: ['English', 'Hindi'] },
      { name: 'Raj Malhotra', email: 'raj.malhotra@goodtobuy.in', phone: '+91 98765 90004', role: 'Operations Head', department: 'Operations', skills: ['Process Optimization', 'Team Management', 'Compliance'], languages: ['English', 'Hindi', 'Punjabi'] },
      { name: 'Kavita Reddy', email: 'kavita.reddy@goodtobuy.in', phone: '+91 98765 90005', role: 'Admin Manager', department: 'Administration', skills: ['Documentation', 'Coordination', 'HR'], languages: ['English', 'Hindi', 'Telugu'] }
    ];

    for (const emp of employees) {
      await createDoc('employees', { ...emp, status: 'Active' });
    }
    console.log(`Seeded ${employees.length} employees`);

    console.log('\n✅ Firestore seeded successfully!');
    console.log('Summary:');
    console.log(`  - Properties: ${properties.length}`);
    console.log(`  - Buyers: ${buyers.length}`);
    console.log(`  - Sellers: ${sellers.length}`);
    console.log(`  - Enquiries: ${enquiries.length}`);
    console.log(`  - Employees: ${employees.length}`);
    console.log(`\nLogin with: ${ADMIN_EMAIL} / <ADMIN_PASSWORD from .env>`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
