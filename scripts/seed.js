const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Book = require('../models/Book');

// Sample users data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@library.com',
    password: 'admin123',
    role: 'admin',
    isActive: true
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    isActive: true
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    isActive: true
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123',
    role: 'user',
    isActive: true
  }
];

// Sample books data
const sampleBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    category: 'Fiction',
    publicationYear: 1925,
    publisher: 'Scribner',
    pages: 180,
    language: 'English',
    tags: ['classic', 'romance', 'american-literature'],
    location: {
      shelf: 'A1',
      section: 'Classics'
    }
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780446310789',
    description: 'The story of young Scout Finch and her father Atticus in a racially divided Alabama town.',
    category: 'Fiction',
    publicationYear: 1960,
    publisher: 'Grand Central Publishing',
    pages: 281,
    language: 'English',
    tags: ['classic', 'social-justice', 'coming-of-age'],
    location: {
      shelf: 'A2',
      section: 'Classics'
    }
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    description: 'A dystopian novel about totalitarianism and surveillance society.',
    category: 'Science Fiction',
    publicationYear: 1949,
    publisher: 'Signet Classic',
    pages: 328,
    language: 'English',
    tags: ['dystopian', 'political', 'surveillance'],
    location: {
      shelf: 'B1',
      section: 'Science Fiction'
    }
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '9780547928241',
    description: 'The adventure of Bilbo Baggins, a hobbit who embarks on a quest with thirteen dwarves.',
    category: 'Fiction',
    publicationYear: 1937,
    publisher: 'Houghton Mifflin Harcourt',
    pages: 366,
    language: 'English',
    tags: ['fantasy', 'adventure', 'middle-earth'],
    location: {
      shelf: 'C1',
      section: 'Fantasy'
    }
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    description: 'The story of Elizabeth Bennet and Mr. Darcy in early 19th century England.',
    category: 'Romance',
    publicationYear: 1813,
    publisher: 'Penguin Classics',
    pages: 432,
    language: 'English',
    tags: ['romance', 'classic', 'british-literature'],
    location: {
      shelf: 'D1',
      section: 'Romance'
    }
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '9780316769488',
    description: 'The story of Holden Caulfield, a teenager navigating the complexities of growing up.',
    category: 'Fiction',
    publicationYear: 1951,
    publisher: 'Little, Brown and Company',
    pages: 277,
    language: 'English',
    tags: ['coming-of-age', 'teenage-angst', 'american-literature'],
    location: {
      shelf: 'A3',
      section: 'Modern Fiction'
    }
  },
  {
    title: 'Lord of the Flies',
    author: 'William Golding',
    isbn: '9780399501487',
    description: 'A group of British boys stranded on an uninhabited island and their attempt to govern themselves.',
    category: 'Fiction',
    publicationYear: 1954,
    publisher: 'Penguin Books',
    pages: 224,
    language: 'English',
    tags: ['allegory', 'survival', 'human-nature'],
    location: {
      shelf: 'A4',
      section: 'Modern Fiction'
    }
  },
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    isbn: '9780451526342',
    description: 'An allegorical novella about a group of farm animals who rebel against their human farmer.',
    category: 'Fiction',
    publicationYear: 1945,
    publisher: 'Signet',
    pages: 140,
    language: 'English',
    tags: ['allegory', 'political', 'satire'],
    location: {
      shelf: 'A5',
      section: 'Modern Fiction'
    }
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    isbn: '9780062315007',
    description: 'A novel about a young Andalusian shepherd who dreams of finding a worldly treasure.',
    category: 'Fiction',
    publicationYear: 1988,
    publisher: 'HarperOne',
    pages: 208,
    language: 'English',
    tags: ['philosophy', 'adventure', 'self-discovery'],
    location: {
      shelf: 'E1',
      section: 'Philosophy'
    }
  },
  {
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    isbn: '9780156013987',
    description: 'A poetic tale about a young prince who visits various planets in space.',
    category: 'Fiction',
    publicationYear: 1943,
    publisher: 'Harcourt',
    pages: 96,
    language: 'English',
    tags: ['philosophy', 'children', 'poetry'],
    location: {
      shelf: 'F1',
      section: 'Children'
    }
  }
];

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/library_system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Seed users
async function seedUsers() {
  try {
    console.log('🌱 Seeding users...');
    
    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');
    
    // Create users with hashed passwords
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }
    
    console.log(`🎉 Successfully seeded ${createdUsers.length} users`);
    return createdUsers;
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

// Seed books
async function seedBooks() {
  try {
    console.log('🌱 Seeding books...');
    
    // Clear existing books
    await Book.deleteMany({});
    console.log('🗑️  Cleared existing books');
    
    // Create books
    const createdBooks = [];
    for (const bookData of sampleBooks) {
      const book = new Book(bookData);
      await book.save();
      createdBooks.push(book);
      console.log(`✅ Created book: ${book.title} by ${book.author}`);
    }
    
    console.log(`🎉 Successfully seeded ${createdBooks.length} books`);
    return createdBooks;
    
  } catch (error) {
    console.error('❌ Error seeding books:', error);
    throw error;
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🚀 Starting database seeding...');
    
    await connectDB();
    
    // Seed users first
    const users = await seedUsers();
    
    // Seed books
    const books = await seedBooks();
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users created: ${users.length}`);
    console.log(`   - Books created: ${books.length}`);
    console.log('\n🔑 Default admin credentials:');
    console.log(`   Email: admin@library.com`);
    console.log(`   Password: admin123`);
    console.log('\n👥 Default user credentials:');
    console.log(`   Email: john@example.com`);
    console.log(`   Password: password123`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedUsers, seedBooks }; 