const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    match: [/^(?:\d{10}|\d{13})$/, 'ISBN must be 10 or 13 digits']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Fiction',
      'Non-Fiction',
      'Science Fiction',
      'Mystery',
      'Romance',
      'Biography',
      'History',
      'Science',
      'Technology',
      'Philosophy',
      'Religion',
      'Self-Help',
      'Business',
      'Education',
      'Children',
      'Poetry',
      'Drama',
      'Other'
    ]
  },
  publicationYear: {
    type: Number,
    min: [1000, 'Publication year must be after 1000'],
    max: [new Date().getFullYear(), 'Publication year cannot be in the future']
  },
  publisher: {
    type: String,
    trim: true,
    maxlength: [100, 'Publisher name cannot be more than 100 characters']
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1'],
    max: [10000, 'Pages cannot exceed 10000']
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  },
  coverImage: {
    type: String,
    trim: true
  },
  availability: {
    type: String,
    enum: ['available', 'borrowed', 'reserved', 'maintenance'],
    default: 'available'
  },
  location: {
    shelf: {
      type: String,
      trim: true
    },
    section: {
      type: String,
      trim: true
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot be more than 50 characters']
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  borrowedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  borrowedAt: {
    type: Date,
    default: null
  },
  dueDate: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ availability: 1 });
bookSchema.index({ isbn: 1 });
bookSchema.index({ borrowedBy: 1 });

// Virtual for checking if book is overdue
bookSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || !this.borrowedBy) return false;
  return new Date() > this.dueDate;
});

// Method to borrow book
bookSchema.methods.borrow = function(userId, days = 14) {
  if (this.availability !== 'available') {
    throw new Error('Book is not available for borrowing');
  }
  
  this.availability = 'borrowed';
  this.borrowedBy = userId;
  this.borrowedAt = new Date();
  this.dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  
  return this.save();
};

// Method to return book
bookSchema.methods.return = function() {
  this.availability = 'available';
  this.borrowedBy = null;
  this.borrowedAt = null;
  this.dueDate = null;
  
  return this.save();
};

// Static method to find available books
bookSchema.statics.findAvailable = function() {
  return this.find({ availability: 'available', isActive: true });
};

// Static method to find books by category
bookSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true });
};

// Static method to search books
bookSchema.statics.search = function(query) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      }
    ]
  });
};

module.exports = mongoose.model('Book', bookSchema); 