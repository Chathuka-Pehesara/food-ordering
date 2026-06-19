require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Import models inline
  const User = require('./models/User').User || require('./models/User');
  const FoodItem = require('./models/FoodItem').FoodItem || require('./models/FoodItem');

  //  Seed admin 
  const existing = await User.findOne({ email: 'admin@food.com' });
  if (!existing) {
    await User.create({
      name: 'Admin User',
      email: 'admin@food.com',
      password: 'admin123',   // pre-save hook will hash this
      role: 'admin',
    });
    console.log('✅ Admin created  →  admin@food.com / admin123');
  } else {
    console.log('ℹ️  Admin already exists');
  }

  //  Seed food items 
  const count = await FoodItem.countDocuments();
  if (count === 0) {
    await FoodItem.insertMany([
      { name: 'Margherita Pizza', category: 'Pizza', price: 1200, description: 'Classic tomato and mozzarella', available: true },
      { name: 'Pepperoni Pizza', category: 'Pizza', price: 1500, description: 'Loaded with pepperoni slices', available: true },
      { name: 'Classic Burger', category: 'Burger', price: 750, description: 'Juicy beef patty with veggies', available: true },
      { name: 'Cheese Burger', category: 'Burger', price: 900, description: 'Double cheese, double happiness', available: true },
      { name: 'Chocolate Cake', category: 'Cake', price: 1800, description: 'Rich moist chocolate layered cake', available: true },
      { name: 'Vanilla Sponge Cake', category: 'Cake', price: 1600, description: 'Light vanilla cream sponge', available: true },
      { name: 'Egg Fried Rice', category: 'Fried Rice', price: 650, description: 'Wok-tossed with fresh vegetables', available: true },
      { name: 'Chicken Kottu', category: 'Kottu', price: 800, description: 'Sri Lankan street food favourite', available: true },
      { name: 'Coke 330ml', category: 'Drinks', price: 200, description: 'Chilled Coca-Cola', available: true },
      { name: 'Mango Juice', category: 'Drinks', price: 350, description: 'Fresh squeezed mango', available: true },
    ]);
    console.log('✅ 10 food items seeded');
  } else {
    console.log(`ℹ️  Foods already seeded (${count} items)`);
  }

  await mongoose.disconnect();
  console.log('Done ✓');
}

seed().catch(err => { console.error(err); process.exit(1); });