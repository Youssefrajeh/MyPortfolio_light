const express = require('express');
const Book = require('../models/Book');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all books (with optional authentication)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search, 
      category, 
      availability,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = { isActive: true };
    
    // Search filter
    if (search) {
      query.$text = { $search: search };
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Availability filter
    if (availability) {
      query.availability = availability;
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOptions,
      populate: {
        path: 'borrowedBy',
        select: 'name email'
      }
    };
    
    const books = await Book.paginate(query, options);
    
    res.json({
      success: true,
      books: books.docs,
      pagination: {
        page: books.page,
        limit: books.limit,
        totalDocs: books.totalDocs,
        totalPages: books.totalPages,
        hasNextPage: books.hasNextPage,
        hasPrevPage: books.hasPrevPage
      }
    });
    
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching books'
    });
  }
});

// Get book by ID
router.get('/:bookId', optionalAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId)
      .populate('borrowedBy', 'name email');
    
    if (!book || !book.isActive) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }
    
    res.json({
      success: true,
      book
    });
    
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching book'
    });
  }
});

// Add new book (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      description,
      category,
      publicationYear,
      publisher,
      pages,
      language,
      coverImage,
      location,
      tags
    } = req.body;
    
    const book = new Book({
      title,
      author,
      isbn,
      description,
      category,
      publicationYear,
      publisher,
      pages,
      language,
      coverImage,
      location,
      tags
    });
    
    await book.save();
    
    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      book
    });
    
  } catch (error) {
    console.error('Add book error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Book with this ISBN already exists'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: errors.join(', ')
      });
    }
    
    res.status(500).json({
      error: 'Internal server error while adding book'
    });
  }
});

// Update book (admin only)
router.put('/:bookId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.bookId,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!book) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Book updated successfully',
      book
    });
    
  } catch (error) {
    console.error('Update book error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Book with this ISBN already exists'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: errors.join(', ')
      });
    }
    
    res.status(500).json({
      error: 'Internal server error while updating book'
    });
  }
});

// Delete book (admin only)
router.delete('/:bookId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    
    if (!book) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }
    
    // Soft delete - mark as inactive
    book.isActive = false;
    await book.save();
    
    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      error: 'Internal server error while deleting book'
    });
  }
});

// Borrow book
router.post('/:bookId/borrow', authenticateToken, async (req, res) => {
  try {
    const { days = 14 } = req.body;
    const book = await Book.findById(req.params.bookId);
    
    if (!book || !book.isActive) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }
    
    if (book.availability !== 'available') {
      return res.status(400).json({
        error: 'Book is not available for borrowing'
      });
    }
    
    await book.borrow(req.user._id, days);
    
    res.json({
      success: true,
      message: 'Book borrowed successfully',
      book
    });
    
  } catch (error) {
    console.error('Borrow book error:', error);
    res.status(500).json({
      error: 'Internal server error while borrowing book'
    });
  }
});

// Return book
router.post('/:bookId/return', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    
    if (!book || !book.isActive) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }
    
    if (book.borrowedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'You can only return books that you borrowed'
      });
    }
    
    await book.return();
    
    res.json({
      success: true,
      message: 'Book returned successfully',
      book
    });
    
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({
      error: 'Internal server error while returning book'
    });
  }
});

// Get user's borrowed books
router.get('/user/borrowed', authenticateToken, async (req, res) => {
  try {
    const books = await Book.find({
      borrowedBy: req.user._id,
      isActive: true
    }).sort({ borrowedAt: -1 });
    
    res.json({
      success: true,
      books
    });
    
  } catch (error) {
    console.error('Get borrowed books error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching borrowed books'
    });
  }
});

// Get book categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Book.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      categories: categories.sort()
    });
    
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching categories'
    });
  }
});

// Get library statistics (admin only)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments({ isActive: true });
    const availableBooks = await Book.countDocuments({ 
      isActive: true, 
      availability: 'available' 
    });
    const borrowedBooks = await Book.countDocuments({ 
      isActive: true, 
      availability: 'borrowed' 
    });
    const overdueBooks = await Book.countDocuments({
      isActive: true,
      availability: 'borrowed',
      dueDate: { $lt: new Date() }
    });
    
    res.json({
      success: true,
      stats: {
        totalBooks,
        availableBooks,
        borrowedBooks,
        overdueBooks,
        reservedBooks: totalBooks - availableBooks - borrowedBooks
      }
    });
    
  } catch (error) {
    console.error('Get library stats error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching library statistics'
    });
  }
});

module.exports = router; 