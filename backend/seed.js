import { db, initDB } from './config/db.js';
import bcrypt from 'bcryptjs';

// Initialize database first
initDB();

console.log('🌱 Starting database seeding...\n');

// Clear existing data (optional - comment out if you want to keep existing data)
const clearData = () => {
  console.log('🗑️  Clearing existing data...');
  db.exec(`DELETE FROM part_replacements`);
  db.exec(`DELETE FROM predictions`);
  db.exec(`DELETE FROM readings`);
  db.exec(`DELETE FROM maintenance`);
  db.exec(`DELETE FROM spare_parts`);
  db.exec(`DELETE FROM machines`);
  db.exec(`DELETE FROM users`);
  console.log('✅ Data cleared\n');
};

// Seed Users
const seedUsers = async () => {
  console.log('👥 Seeding users...');
  
  const users = [
    { username: 'admin', email: 'admin@factory.com', password: 'password123', role: 'Admin' },
    { username: 'john_manager', email: 'john@factory.com', password: 'password123', role: 'Manager' },
    { username: 'mike_tech', email: 'mike@factory.com', password: 'password123', role: 'Technician' },
    { username: 'sarah_op', email: 'sarah@factory.com', password: 'password123', role: 'Operator' },
    { username: 'lisa_tech', email: 'lisa@factory.com', password: 'password123', role: 'Technician' },
  ];

  const stmt = db.prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)');

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    stmt.run(user.username, user.email, hashedPassword, user.role);
  }

  console.log(`✅ Created ${users.length} users\n`);
};

// Seed Machines
const seedMachines = () => {
  console.log('🏭 Seeding machines...');

  const machines = [
    {
      name: 'CNC Machine 01',
      model: 'XYZ-2000',
      department: 'Production',
      last_maintenance_date: '2025-01-01',
      frequency_days: 30,
      frequency_hours: 500,
      total_hours_run: 450,
      status: 'OK'
    },
    {
      name: 'CNC Machine 02',
      model: 'XYZ-2000',
      department: 'Production',
      last_maintenance_date: '2024-12-05',
      frequency_days: 30,
      frequency_hours: 500,
      total_hours_run: 520,
      status: 'Due Soon'
    },
    {
      name: 'Lathe Machine',
      model: 'LT-500',
      department: 'Assembly',
      last_maintenance_date: '2024-11-15',
      frequency_days: 30,
      frequency_hours: 400,
      total_hours_run: 850,
      status: 'Overdue'
    },
    {
      name: 'Milling Machine',
      model: 'ML-3000',
      department: 'Production',
      last_maintenance_date: '2024-12-20',
      frequency_days: 45,
      frequency_hours: 600,
      total_hours_run: 1200,
      status: 'At Risk'
    },
    {
      name: 'Drilling Machine',
      model: 'DR-100',
      department: 'Assembly',
      last_maintenance_date: '2025-01-10',
      frequency_days: 20,
      frequency_hours: 300,
      total_hours_run: 280,
      status: 'OK'
    },
    {
      name: 'Press Machine',
      model: 'PR-5000',
      department: 'Fabrication',
      last_maintenance_date: '2024-12-25',
      frequency_days: 30,
      frequency_hours: 450,
      total_hours_run: 680,
      status: 'Due Soon'
    },
    {
      name: 'Grinding Machine',
      model: 'GR-200',
      department: 'Finishing',
      last_maintenance_date: '2024-11-20',
      frequency_days: 25,
      frequency_hours: 350,
      total_hours_run: 920,
      status: 'Overdue'
    },
    {
      name: 'Welding Robot',
      model: 'WR-4000',
      department: 'Fabrication',
      last_maintenance_date: '2025-01-05',
      frequency_days: 40,
      frequency_hours: 550,
      total_hours_run: 340,
      status: 'OK'
    }
  ];

  const stmt = db.prepare(
    `INSERT INTO machines (name, model, department, last_maintenance_date, frequency_days, frequency_hours, total_hours_run, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  machines.forEach(m => {
    stmt.run(m.name, m.model, m.department, m.last_maintenance_date, m.frequency_days, m.frequency_hours, m.total_hours_run, m.status);
  });

  console.log(`✅ Created ${machines.length} machines\n`);
};

// Seed Readings
const seedReadings = () => {
  console.log('📊 Seeding readings...');

  const operators = ['sarah_op', 'mike_tech', 'lisa_tech'];
  let totalReadings = 0;

  // Get all machine IDs
  const machines = db.prepare('SELECT id FROM machines').all();

  const stmt = db.prepare(
    `INSERT INTO readings (machine_id, temperature, pressure, vibration, runtime_hours, operator_name, is_abnormal, notes, reading_date) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  machines.forEach(machine => {
    // Generate 10-15 readings per machine over the last 30 days
    const numReadings = 10 + Math.floor(Math.random() * 6);

    for (let i = 0; i < numReadings; i++) {
      const daysAgo = 30 - (i * 2);
      const readingDate = new Date();
      readingDate.setDate(readingDate.getDate() - daysAgo);

      // Gradually increasing temperature and vibration (simulating wear)
      const baseTemp = 55 + (i * 2);
      const baseVibration = 1.5 + (i * 0.3);

      const temperature = baseTemp + (Math.random() * 5 - 2.5); // ±2.5 variation
      const pressure = 2.0 + (Math.random() * 1.0); // 2.0-3.0
      const vibration = baseVibration + (Math.random() * 0.5 - 0.25); // ±0.25 variation
      const runtime_hours = 6 + (Math.random() * 4); // 6-10 hours
      const operator = operators[Math.floor(Math.random() * operators.length)];
      
      // Mark as abnormal if temp > 80 or vibration > 5
      const is_abnormal = (temperature > 80 || vibration > 5) ? 1 : 0;
      const notes = is_abnormal ? 'High readings detected' : 'Normal operation';

      stmt.run(
        machine.id,
        parseFloat(temperature.toFixed(1)),
        parseFloat(pressure.toFixed(2)),
        parseFloat(vibration.toFixed(2)),
        parseFloat(runtime_hours.toFixed(1)),
        operator,
        is_abnormal,
        notes,
        readingDate.toISOString()
      );

      totalReadings++;
    }
  });

  console.log(`✅ Created ${totalReadings} readings\n`);
};

// Seed Maintenance Records
const seedMaintenance = () => {
  console.log('🔧 Seeding maintenance records...');

  const technicians = ['mike_tech', 'lisa_tech', 'john_manager'];
  const maintenanceTypes = [
    'Routine Inspection',
    'Oil Change',
    'Belt Replacement',
    'Calibration',
    'Deep Cleaning',
    'Filter Replacement',
    'Bearing Replacement',
    'Software Update'
  ];

  const machines = db.prepare('SELECT id FROM machines').all();

  const stmt = db.prepare(
    `INSERT INTO maintenance (machine_id, maintenance_type, performed_by, maintenance_date, next_maintenance_date, notes, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  let totalMaintenance = 0;

  machines.forEach(machine => {
    // 3-5 maintenance records per machine
    const numRecords = 3 + Math.floor(Math.random() * 3);

    for (let i = 0; i < numRecords; i++) {
      const daysAgo = 90 - (i * 25);
      const maintenanceDate = new Date();
      maintenanceDate.setDate(maintenanceDate.getDate() - daysAgo);

      const nextMaintenanceDate = new Date(maintenanceDate);
      nextMaintenanceDate.setDate(nextMaintenanceDate.getDate() + 30);

      const maintenanceType = maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)];
      const performedBy = technicians[Math.floor(Math.random() * technicians.length)];
      
      // Most recent should be completed, older ones are completed, future ones scheduled
      let status = 'Completed';
      if (nextMaintenanceDate < new Date()) {
        status = Math.random() > 0.7 ? 'Overdue' : 'Completed';
      } else if (i === 0) {
        status = Math.random() > 0.5 ? 'Scheduled' : 'Completed';
      }

      const notes = `${maintenanceType} performed successfully. All components checked and replaced as needed.`;

      stmt.run(
        machine.id,
        maintenanceType,
        performedBy,
        maintenanceDate.toISOString().split('T')[0],
        nextMaintenanceDate.toISOString().split('T')[0],
        notes,
        status
      );

      totalMaintenance++;
    }
  });

  console.log(`✅ Created ${totalMaintenance} maintenance records\n`);
};

// Seed Spare Parts
const seedSpareParts = () => {
  console.log('📦 Seeding spare parts...');

  const parts = [
    { part_name: 'Bearing SKF 6205', part_number: 'BRG-001', quantity: 25, min_quantity: 10, location: 'Warehouse A - Shelf 1' },
    { part_name: 'V-Belt Type A', part_number: 'BLT-001', quantity: 15, min_quantity: 8, location: 'Warehouse A - Shelf 2' },
    { part_name: 'Oil Filter OF-500', part_number: 'FLT-001', quantity: 8, min_quantity: 5, location: 'Warehouse B - Shelf 1' },
    { part_name: 'Hydraulic Oil 10W', part_number: 'OIL-001', quantity: 45, min_quantity: 20, location: 'Storage Tank 1' },
    { part_name: 'Motor Capacitor 50uF', part_number: 'CAP-001', quantity: 12, min_quantity: 6, location: 'Warehouse A - Shelf 3' },
    { part_name: 'Cutting Tool Insert', part_number: 'TLS-001', quantity: 150, min_quantity: 50, location: 'Tool Room - Drawer 5' },
    { part_name: 'Coolant Pump', part_number: 'PMP-001', quantity: 4, min_quantity: 3, location: 'Warehouse B - Shelf 3' },
    { part_name: 'Limit Switch', part_number: 'SWT-001', quantity: 18, min_quantity: 10, location: 'Electronics Room' },
    { part_name: 'Proximity Sensor', part_number: 'SNR-001', quantity: 3, min_quantity: 5, location: 'Electronics Room' }, // Low stock
    { part_name: 'Timing Belt', part_number: 'BLT-002', quantity: 6, min_quantity: 8, location: 'Warehouse A - Shelf 2' }, // Low stock
    { part_name: 'Grease Gun Cartridge', part_number: 'GRS-001', quantity: 30, min_quantity: 15, location: 'Maintenance Shop' },
    { part_name: 'Safety Valve', part_number: 'VLV-001', quantity: 7, min_quantity: 4, location: 'Warehouse B - Shelf 2' },
  ];

  const stmt = db.prepare(
    `INSERT INTO spare_parts (part_name, part_number, quantity, min_quantity, location) 
     VALUES (?, ?, ?, ?, ?)`
  );

  parts.forEach(p => {
    stmt.run(p.part_name, p.part_number, p.quantity, p.min_quantity, p.location);
  });

  console.log(`✅ Created ${parts.length} spare parts (${parts.filter(p => p.quantity <= p.min_quantity).length} low stock)\n`);
};

// Seed Part Replacements
const seedPartReplacements = () => {
  console.log('🔄 Seeding part replacements...');

  const technicians = ['mike_tech', 'lisa_tech'];
  const machines = db.prepare('SELECT id FROM machines').all();
  const parts = db.prepare('SELECT id FROM spare_parts').all();

  const stmt = db.prepare(
    `INSERT INTO part_replacements (machine_id, part_id, quantity_used, replaced_by, replacement_date, notes) 
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  let totalReplacements = 0;

  machines.forEach(machine => {
    // 2-4 part replacements per machine
    const numReplacements = 2 + Math.floor(Math.random() * 3);

    for (let i = 0; i < numReplacements; i++) {
      const daysAgo = 60 - (i * 15);
      const replacementDate = new Date();
      replacementDate.setDate(replacementDate.getDate() - daysAgo);

      const part = parts[Math.floor(Math.random() * parts.length)];
      const quantityUsed = 1 + Math.floor(Math.random() * 2); // 1-2 units
      const replacedBy = technicians[Math.floor(Math.random() * technicians.length)];
      const notes = `Replaced during routine maintenance. Old part showed signs of wear.`;

      stmt.run(
        machine.id,
        part.id,
        quantityUsed,
        replacedBy,
        replacementDate.toISOString(),
        notes
      );

      totalReplacements++;
    }
  });

  console.log(`✅ Created ${totalReplacements} part replacements\n`);
};

// Seed ML Predictions
const seedPredictions = () => {
  console.log('🤖 Seeding ML predictions...');

  const machines = db.prepare('SELECT id, status FROM machines').all();

  const stmt = db.prepare(
    `INSERT INTO predictions (machine_id, failure_probability, risk_level, predicted_at) 
     VALUES (?, ?, ?, ?)`
  );

  machines.forEach(machine => {
    let probability = 0;
    let riskLevel = 'Low';

    // Assign probability based on machine status
    switch (machine.status) {
      case 'OK':
        probability = 0.1 + (Math.random() * 0.2); // 10-30%
        riskLevel = 'Low';
        break;
      case 'Due Soon':
        probability = 0.3 + (Math.random() * 0.2); // 30-50%
        riskLevel = 'Medium';
        break;
      case 'At Risk':
        probability = 0.6 + (Math.random() * 0.2); // 60-80%
        riskLevel = 'High';
        break;
      case 'Overdue':
        probability = 0.7 + (Math.random() * 0.25); // 70-95%
        riskLevel = 'High';
        break;
    }

    stmt.run(
      machine.id,
      parseFloat(probability.toFixed(3)),
      riskLevel,
      new Date().toISOString()
    );
  });

  console.log(`✅ Created ${machines.length} ML predictions\n`);
};

// Run all seed functions
const runSeed = async () => {
  try {
    clearData();
    await seedUsers();
    seedMachines();
    seedReadings();
    seedMaintenance();
    seedSpareParts();
    seedPartReplacements();
    seedPredictions();

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📝 Summary:');
    console.log('   - 5 Users (1 Admin, 1 Manager, 2 Technicians, 1 Operator)');
    console.log('   - 8 Machines (various statuses)');
    console.log('   - ~100 Sensor Readings');
    console.log('   - ~30 Maintenance Records');
    console.log('   - 12 Spare Parts (with 2 low stock items)');
    console.log('   - ~25 Part Replacements');
    console.log('   - 8 ML Predictions\n');
    console.log('✅ You can now login with:');
    console.log('   Email: admin@factory.com');
    console.log('   Password: password123\n');
    console.log('   Or any of these users:');
    console.log('   - john@factory.com (Manager)');
    console.log('   - mike@factory.com (Technician)');
    console.log('   - sarah@factory.com (Operator)');
    console.log('   - lisa@factory.com (Technician)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed
runSeed();