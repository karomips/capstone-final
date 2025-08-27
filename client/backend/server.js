const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcryptjs'); // Import bcrypt

const app = express();
app.use(cors());
app.use(express.json());

// User Schema with upload reference and profile picture
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  uploadId: { 
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'Upload',
    required: false 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  file: {
    filename: String,
    contentType: String,
    data: Buffer,
    uploadDate: { type: Date, default: Date.now }
  },
  profilePicture: {
    filename: String,
    contentType: String,
    data: Buffer,
    uploadDate: { type: Date, default: Date.now }
  },
  status: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'approved', 'rejected'] 
  }
});
const User = mongoose.model('User', userSchema);

// Job Schema with required category
const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  category: {
    type: String,
    required: true,
    enum: [
      'Healthcare',
      'Education',
      'Administration',
      'Social Services',
      'Security',
      'Maintenance',
      'Technology',
      'Agriculture',
      'Business',
      'Other'
    ]
  },
  postedDate: {
    type: Date,
    default: Date.now
  }
});
const Job = mongoose.model('Job', jobSchema);

// Job Application Schema
const jobApplicationSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job',
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  experience: { type: String, required: true },
  education: { type: String, required: true },
  coverLetter: { type: String, required: true },
  resume: {
    filename: String,
    contentType: String,
    data: Buffer,
    uploadDate: { type: Date, default: Date.now }
  },
  status: { 
    type: String, 
    default: 'submitted',
    enum: ['submitted', 'reviewing', 'interview', 'accepted', 'rejected'] 
  },
  appliedDate: { type: Date, default: Date.now },
  notes: { type: String, default: '' }
});
const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

// Enhanced Upload Schema
const uploadSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
  uploadDate: { 
    type: Date, 
    default: Date.now 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'approved', 'rejected'] 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  }
});
const Upload = mongoose.model('Upload', uploadSchema);

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  members: [{ type: String, required: true }], // Array of email addresses
  lastMessage: { type: String, default: '' },
  lastMessageTime: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});
const Conversation = mongoose.model('Conversation', conversationSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
  conversationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conversation',
    required: true 
  },
  sender: { type: String, required: true }, // Email of sender
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG and PDF files are allowed.'));
    }
  }
});

const adminRegisterSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  file: {
    filename: String,
    contentType: String,
    data: Buffer,
    uploadDate: { type: Date, default: Date.now }
  },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] }
});
const AdminRegister = mongoose.model('AdminRegister', adminRegisterSchema);

// POST /api/admin/registrations - Direct to User collection
app.post('/api/admin/register', upload.single('file'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Create user directly in User collection with admin privileges and pending status
    const newUser = new User({
      name,
      email,
      password,
      isAdmin: true,
      status: 'pending', // Will need approval from existing admin
      isVerified: false,
      file: {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
        uploadDate: new Date()
      }
    });

    await newUser.save();
    res.json({ success: true, message: 'Admin registration submitted for review' });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Get pending admin registrations from User collection
app.get('/api/admin/registrations', async (req, res) => {
  try {
    // Get pending admin users from User collection
    const requests = await User.find({ 
      isAdmin: true, 
      status: 'pending' 
    }).select('-password');
    
    res.json({ 
      success: true, 
      requests: requests.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        file: user.file ? {
          filename: user.file.filename,
          contentType: user.file.contentType,
          uploadDate: user.file.uploadDate
        } : null
      }))
    });
  } catch (error) {
    console.error('Error fetching admin registrations:', error);
    res.status(500).json({ success: false, message: 'Error fetching requests' });
  }
});

// Get pending user registrations (exclude admin users) with file info
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({ 
      status: 'pending',
      isAdmin: { $ne: true } // Exclude admin users
    }).select('-password');
    
    res.json({ 
      success: true, 
      users: users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        isVerified: user.isVerified,
        file: user.file ? {
          filename: user.file.filename,
          contentType: user.file.contentType,
          uploadDate: user.file.uploadDate
        } : null
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// Update user status (approve/reject) with file verification
app.patch('/api/admin/user/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    // Find the user and ensure it's not an admin
    const user = await User.findOne({ 
      _id: userId, 
      isAdmin: { $ne: true } 
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update user status
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { 
        status,
        isVerified: status === 'approved'
      }, 
      { new: true }
    );

    res.json({ 
      success: true, 
      message: `User ${status} successfully`,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.status,
        isVerified: updatedUser.isVerified
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ success: false, message: 'Error updating user status' });
  }
});

// Get single user by ID for admin
app.get('/api/admin/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        file: user.file ? {
          filename: user.file.filename,
          contentType: user.file.contentType,
          uploadDate: user.file.uploadDate
        } : null,
        profilePicture: user.profilePicture ? {
          filename: user.profilePicture.filename,
          contentType: user.profilePicture.contentType,
          uploadDate: user.profilePicture.uploadDate
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Error fetching user' });
  }
});

// Update user status (PATCH for partial updates like status changes)
app.patch('/api/admin/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find and update the user
    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
});

// Update user information for admin
app.put('/api/admin/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, status, isVerified, isAdmin } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already exists' 
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { 
        name,
        email,
        status,
        isVerified,
        isAdmin
      }, 
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ 
      success: true, 
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Error updating user' });
  }
});

// Get all users for admin (not just pending)
app.get('/api/admin/users/all', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    res.json({ 
      success: true, 
      users: users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        file: user.file ? {
          filename: user.file.filename,
          contentType: user.file.contentType,
          uploadDate: user.file.uploadDate
        } : null
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// Get job categories with counts
app.get('/api/jobs/categories', async (req, res) => {
  try {
    const categoryCounts = await Job.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    // Define all available categories with descriptions
    const categoryDefinitions = {
      'Healthcare': 'Medical and health-related positions including nurses, caregivers, and medical assistants',
      'Education': 'Teaching, tutoring, and educational support roles in schools and community programs',
      'Administration': 'Office work, data entry, clerical, and administrative support positions',
      'Social Services': 'Community outreach, social work, and public service positions',
      'Security': 'Safety, security guard, and protection services within the barangay',
      'Maintenance': 'Facility maintenance, cleaning, repairs, and general upkeep jobs',
      'Technology': 'IT support, computer services, and technology-related positions',
      'Agriculture': 'Farming, gardening, livestock care, and agricultural support jobs',
      'Business': 'Sales, marketing, customer service, and small business opportunities',
      'Other': 'Miscellaneous job opportunities not covered in other categories'
    };
    
    // Create a map of category counts
    const countMap = {};
    categoryCounts.forEach(cat => {
      if (cat._id) {
        countMap[cat._id] = cat.count;
      }
    });
    
    // Build the categories array with descriptions and counts
    const categories = Object.keys(categoryDefinitions).map(categoryName => ({
      name: categoryName,
      description: categoryDefinitions[categoryName],
      count: countMap[categoryName] || 0
    }));
    
    res.json({
      success: true,
      categories: categories
    });
  } catch (error) {
    console.error('Error fetching job categories:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching job categories',
      categories: Object.keys({
        'Healthcare': 'Medical and health-related positions',
        'Education': 'Teaching and educational support roles',
        'Administration': 'Office work and administrative support',
        'Social Services': 'Community outreach and public service',
        'Security': 'Safety and security services',
        'Maintenance': 'Facility maintenance and upkeep',
        'Technology': 'IT support and technology services',
        'Agriculture': 'Farming and agricultural support',
        'Business': 'Sales, marketing, and business opportunities',
        'Other': 'Miscellaneous job opportunities'
      }).map(name => ({ name, description: '', count: 0 }))
    });
  }
});

// Get just category names for dropdowns
app.get('/api/jobs/category-names', async (req, res) => {
  try {
    const allCategories = [
      'Healthcare',
      'Education', 
      'Administration',
      'Social Services',
      'Security',
      'Maintenance',
      'Technology',
      'Agriculture',
      'Business',
      'Other'
    ];
    
    res.json({
      success: true,
      categories: allCategories
    });
  } catch (error) {
    console.error('Error fetching category names:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching category names',
      categories: [
        'Healthcare',
        'Education', 
        'Administration',
        'Social Services',
        'Security',
        'Maintenance',
        'Technology',
        'Agriculture',
        'Business',
        'Other'
      ]
    });
  }
});

// Create a new job posting
app.get('/api/jobs/stats/categories', async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching job stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single job by ID (moved after specific routes to avoid conflicts)
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }
    res.json({ 
      success: true, 
      job: {
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        category: job.category,
        __v: job.__v,
        _id: job._id
      }
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching job details' 
    });
  }
});

// Admin: Approve or reject an admin registration (now in User collection)
app.patch('/api/admin/registration/:id', async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const userId = req.params.id;

    // Find the pending admin user
    const user = await User.findOne({ 
      _id: userId, 
      isAdmin: true, 
      status: 'pending' 
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin registration not found' 
      });
    }

    // Update status directly in User collection
    await User.findByIdAndUpdate(userId, {
      status: status,
      isVerified: status === 'approved'
    });

    const message = status === 'approved' 
      ? 'Admin registration approved successfully' 
      : 'Admin registration rejected';

    res.json({ 
      success: true, 
      message: message 
    });
  } catch (error) {
    console.error('Error updating admin registration status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating status' 
    });
  }
});

// Download user credential file
app.get('/api/admin/user/file/:id', async (req, res) => {
  try {
    const user = await User.findOne({ 
      _id: req.params.id, 
      isAdmin: { $ne: true } // Ensure it's not an admin user
    });
    
    if (!user || !user.file) {
      return res.status(404).json({ 
        success: false, 
        message: 'User credential file not found' 
      });
    }
    
    res.set('Content-Type', user.file.contentType);
    res.set('Content-Disposition', `attachment; filename="${user.file.filename}"`);
    res.send(user.file.data);
  } catch (error) {
    console.error('Error downloading user file:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error downloading file' 
    });
  }
});

// Download admin registration file from User collection
app.get('/api/admin/registration/file/:id', async (req, res) => {
  try {
    const user = await User.findOne({ 
      _id: req.params.id, 
      isAdmin: true 
    });
    
    if (!user || !user.file) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found' 
      });
    }
    
    res.set('Content-Type', user.file.contentType);
    res.set('Content-Disposition', `attachment; filename="${user.file.filename}"`);
    res.send(user.file.data);
  } catch (error) {
    console.error('Error downloading admin file:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error downloading file' 
    });
  }
});

// Upload endpoint - Step 1
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const newUpload = new Upload({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer
    });

    await newUpload.save();
    res.json({ 
      success: true, 
      message: 'File uploaded successfully',
      file: {
        id: newUpload._id,
        filename: newUpload.filename,
        status: newUpload.status,
        uploadDate: newUpload.uploadDate
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading file' 
    });
  }
});

// Update the register endpoint to require file upload
app.post('/api/register', upload.single('file'), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credential file is required for registration' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Store password directly (no hashing)
    console.log('Creating user with password:', password);

    // Create user with plain password and file
    const user = new User({
      name,
      email,
      password,
      isAdmin: false,
      status: 'pending', // Always pending until admin approves
      isVerified: false,
      file: {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
        uploadDate: new Date()
      }
    });
    
    await user.save();

    res.json({
      success: true,
      message: 'Registration submitted for admin approval',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Update the login endpoint - for regular users only
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('User login attempt for email:', email); // Debug log
    
    // Find user in User collection - exclude admin users for this endpoint
    const user = await User.findOne({ email, isAdmin: { $ne: true } });
    
    if (!user) {
      console.log('User not found in database:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    console.log('User found:', { 
      email: user.email, 
      status: user.status, 
      isAdmin: user.isAdmin 
    }); // Debug log

    // Check if user is approved
    if (user.status === 'rejected') {
      console.log('User account rejected:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Your account has been rejected. Please contact administrator.' 
      });
    }

    if (user.status === 'pending') {
      console.log('User account pending approval:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Your account is pending approval. Please wait for administrator approval.' 
      });
    }

    // Compare passwords directly (no hashing)
    console.log('Comparing passwords - Input:', password, 'Stored:', user.password);
    
    if (password !== user.password) {
      console.log('Password incorrect for:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Login successful
    console.log('User login successful for:', email);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        status: user.status,
        isAdmin: false,
        role: 'user'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get uploads for verification
app.get('/api/uploads/pending', async (req, res) => {
  try {
    const uploads = await Upload.find({ 
      status: 'pending' 
    }).populate({
      path: 'userId',
      select: 'name email'
    });

    res.json({ 
      success: true, 
      uploads: uploads.map(upload => ({
        id: upload._id,
        filename: upload.filename,
        uploadDate: upload.uploadDate,
        status: upload.status,
        user: {
          id: upload.userId?._id,
          name: upload.userId?.name,
          email: upload.userId?.email
        }
      }))
    });
  } catch (error) {
    console.error('Error fetching uploads:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching pending uploads' 
    });
  }
});

// Verify upload status
app.get('/api/upload/verify/:id', async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found'
      });
    }

    res.json({
      success: true,
      status: upload.status,
      isVerified: upload.isVerified
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking upload status'
    });
  }
});

// Profile route should be first
app.get('/api/users/profile', async (req, res) => {
  try {
    const { email } = req.query;
    
    // Find user in jobportal.users collection
    const user = await User.findOne({ email })
      .select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's uploads
    const uploads = await Upload.find({ userId: user._id })
      .select('contentType filename uploadDate');

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        uploads
      }
    });
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile data'
    });
  }
});

// Then the :email parameter route
app.get('/api/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
      .select('-password'); // Exclude password from response
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture ? true : false
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
});

app.put('/api/users/:email', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { name, email },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user data'
    });
  }
});

// Download file endpoint
app.get('/api/upload/download/:id', async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    res.set('Content-Type', upload.contentType);
    res.set('Content-Disposition', `attachment; filename="${upload.filename}"`);
    res.send(upload.data);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error downloading file' });
  }
});

// Update upload status endpoint
app.patch('/api/upload/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, userId } = req.body;

    // Update upload status
    const upload = await Upload.findByIdAndUpdate(id, { 
      status,
      isVerified: true
    }, { new: true });

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found'
      });
    }

    // Update user verification status if userId exists
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        isVerified: status === 'approved'
      });
    }

    res.json({
      success: true,
      message: `Upload ${status} successfully`
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status'
    });
  }
});

// Jobs endpoints
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching jobs' 
    });
  }
});

// Add this endpoint to test API connectivity
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working' 
  });
});

// Update the pending uploads endpoint with better error handling
app.get('/api/uploads/pending', async (req, res) => {
  try {
    console.log('Fetching pending uploads...'); // Debug log

    const uploads = await Upload.find({ status: 'pending' })
      .populate('userId', 'name email');
    
    console.log('Found uploads:', uploads); // Debug log

    res.json({ 
      success: true, 
      uploads: uploads.map(upload => ({
        id: upload._id,
        filename: upload.filename,
        uploadDate: upload.uploadDate,
        status: upload.status,
        user: upload.userId ? {
          id: upload.userId._id,
          name: upload.userId.name,
          email: upload.userId.email
        } : null
      }))
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching pending uploads',
      error: error.message 
    });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.json({ 
      success: true, 
      job 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating job' 
    });
  }
});

// Update job
app.put('/api/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const updatedJob = await Job.findByIdAndUpdate(
      jobId, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updatedJob) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }
    
    res.json({ 
      success: true, 
      job: updatedJob 
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating job' 
    });
  }
});

// Delete job
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    
    // First, delete all applications for this job
    await JobApplication.deleteMany({ jobId: jobId });
    
    // Then delete the job
    const deletedJob = await Job.findByIdAndDelete(jobId);
    
    if (!deletedJob) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Job and all related applications deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting job' 
    });
  }
});

app.patch('/admin/registration/:userId', async (req, res) => {
  const { status } = req.body;
  const userId = req.params.userId;

  // Find and update registration
  const registration = await Registration.findByIdAndUpdate(userId, { status }, { new: true });

  if (status === 'approved' && registration) {
    // Move to users collection
    const user = new User({
      name: registration.name,
      email: registration.email,
      // ...other fields
    });
    await user.save();

    // Optionally, remove from registrations
    await Registration.findByIdAndDelete(userId);
  }

  res.json({ success: true });
});

// Admin login endpoint - specifically for admin users
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Admin login attempt for email:', email);
    
    // Find admin user in User collection with isAdmin: true
    const user = await User.findOne({ email, isAdmin: true });
    
    if (!user) {
      console.log('Admin user not found:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid admin credentials' 
      });
    }

    console.log('Admin user found:', { 
      email: user.email, 
      status: user.status, 
      isAdmin: user.isAdmin 
    });

    // Check if admin is approved
    if (user.status !== 'approved') {
      console.log('Admin account not approved:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Admin account not approved yet' 
      });
    }

    // Verify password directly (no hashing)
    console.log('Admin password check - Input:', password, 'Stored:', user.password);
    
    if (password !== user.password) {
      console.log('Admin password incorrect for:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid admin credentials' 
      });
    }

    // Admin login successful
    console.log('Admin login successful for:', email);
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Debug endpoint to list all users - REMOVE IN PRODUCTION
app.get('/api/debug/users', async (req, res) => {
  try {
    const users = await User.find({}).select('name email isAdmin status isVerified');
    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching users' 
    });
  }
});

// Temporary endpoint to create a regular user - REMOVE IN PRODUCTION
app.post('/api/create-user', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Store password directly (no hashing)
    console.log('Creating user with password:', password);

    // Create regular user
    const user = new User({
      name,
      email,
      password,
      isAdmin: false,
      status: 'approved',
      isVerified: true
    });

    await user.save();

    res.json({
      success: true,
      message: 'Regular user created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating user' 
    });
  }
});

// Temporary endpoint to create an admin user - REMOVE IN PRODUCTION
app.post('/api/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Store password directly (no hashing)
    console.log('Creating admin with password:', password);

    // Create admin user
    const admin = new User({
      name,
      email,
      password,
      isAdmin: true,
      status: 'approved',
      isVerified: true
    });

    await admin.save();

    res.json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating admin user' 
    });
  }
});

// Temporary endpoint to update admin password - REMOVE IN PRODUCTION  
app.post('/api/update-admin-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Store new password directly (no hashing)
    console.log('Updating admin password to:', newPassword);

    // Update user with new password and admin status
    await User.findByIdAndUpdate(user._id, {
      password: newPassword,
      isAdmin: true,
      status: 'approved',
      isVerified: true
    });

    res.json({
      success: true,
      message: 'Admin password updated successfully'
    });
  } catch (error) {
    console.error('Error updating admin password:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating password' 
    });
  }
});

// Upload profile picture endpoint
app.post('/api/users/profile-picture', upload.single('profilePicture'), async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No profile picture uploaded' 
      });
    }

    // Validate file type (only images)
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Only image files are allowed' 
      });
    }

    // Find and update user with profile picture
    const user = await User.findOneAndUpdate(
      { email, isAdmin: { $ne: true } },
      {
        profilePicture: {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
          data: req.file.buffer,
          uploadDate: new Date()
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile picture updated successfully'
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading profile picture' 
    });
  }
});

// Get profile picture endpoint
app.get('/api/users/profile-picture/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findOne({ 
      email, 
      isAdmin: { $ne: true } 
    }).select('profilePicture');
    
    if (!user || !user.profilePicture || !user.profilePicture.data) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile picture not found' 
      });
    }
    
    res.set('Content-Type', user.profilePicture.contentType);
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    res.send(user.profilePicture.data);
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile picture' 
    });
  }
});

// Profile API endpoints
// Get admin profile
app.get('/api/admin/profile', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const user = await User.findOne({ email, isAdmin: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin user not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'Administrator',
        isAdmin: user.isAdmin,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile' 
    });
  }
});

// Update admin profile
app.put('/api/admin/profile', async (req, res) => {
  try {
    const { currentEmail, name, email } = req.body;
    
    if (!currentEmail || !name || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Find the admin user
    const user = await User.findOne({ email: currentEmail, isAdmin: true });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin user not found' 
      });
    }

    // Check if new email already exists (if email is being changed)
    if (email !== currentEmail) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already exists' 
        });
      }
    }

    // Update the user
    await User.findByIdAndUpdate(user._id, {
      name,
      email
    });

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating profile' 
    });
  }
});

// Get user profile
app.get('/api/user/profile', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const user = await User.findOne({ email, isAdmin: { $ne: true } }).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        isVerified: user.isVerified,
        hasProfilePicture: !!(user.profilePicture && user.profilePicture.data)
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile' 
    });
  }
});

// Update user profile
app.put('/api/user/profile', async (req, res) => {
  try {
    const { currentEmail, name, email } = req.body;
    
    if (!currentEmail || !name || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Find the user (not admin)
    const user = await User.findOne({ email: currentEmail, isAdmin: { $ne: true } });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if new email already exists (if email is being changed)
    if (email !== currentEmail) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already exists' 
        });
      }
    }

    // Update the user
    await User.findByIdAndUpdate(user._id, {
      name,
      email
    });

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating profile' 
    });
  }
});

// Job Application API endpoints
app.post('/api/jobs/:id/apply', upload.single('resume'), async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { fullName, email, phone, experience, education, coverLetter } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !experience || !education || !coverLetter) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Find or create user based on email
    let user = await User.findOne({ email, isAdmin: { $ne: true } });
    if (!user) {
      // Create a basic user entry for application tracking
      user = new User({
        name: fullName,
        email,
        status: 'approved', // Auto-approve for job applications
        isVerified: true,
        password: 'temp' // They can register properly later
      });
      await user.save();
    }

    // Check if user already applied for this job
    const existingApplication = await JobApplication.findOne({
      jobId,
      userId: user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create job application
    const application = new JobApplication({
      jobId,
      userId: user._id,
      fullName,
      email,
      phone,
      experience,
      education,
      coverLetter,
      status: 'submitted'
    });

    // Add resume if uploaded
    if (req.file) {
      application.resume = {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
        uploadDate: new Date()
      };
    }

    await application.save();

    res.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Error submitting job application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application'
    });
  }
});

// Get job applications for a specific job (admin)
app.get('/api/jobs/:id/applications', async (req, res) => {
  try {
    const { id: jobId } = req.params;

    const applications = await JobApplication.find({ jobId })
      .populate('jobId', 'title company')
      .populate('userId', 'name email')
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      applications: applications.map(app => ({
        _id: app._id,
        fullName: app.fullName,
        email: app.email,
        phone: app.phone,
        status: app.status,
        appliedDate: app.appliedDate,
        hasResume: !!(app.resume && app.resume.data),
        job: app.jobId,
        user: app.userId
      }))
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
});

// Get user's job applications
app.get('/api/user/applications', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email, isAdmin: { $ne: true } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const applications = await JobApplication.find({ userId: user._id })
      .populate('jobId', 'title company location')
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      applications: applications.map(app => ({
        _id: app._id,
        status: app.status,
        appliedDate: app.appliedDate,
        job: app.jobId
      }))
    });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
});

// Update application status (admin)
app.put('/api/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['submitted', 'reviewing', 'interview', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const application = await JobApplication.findByIdAndUpdate(
      id,
      { status, notes: notes || '' },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status'
    });
  }
});

// Download application resume
app.get('/api/applications/:id/resume', async (req, res) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findById(id);
    if (!application || !application.resume || !application.resume.data) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.set({
      'Content-Type': application.resume.contentType,
      'Content-Disposition': `attachment; filename="${application.resume.filename}"`
    });

    res.send(application.resume.data);
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download resume'
    });
  }
});

// =================
// MESSAGING ROUTES
// =================

// Get all conversations for a user
app.get('/api/conversations/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const conversations = await Conversation.find({
      members: { $in: [email] }
    }).sort({ lastMessageTime: -1 });

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch conversations' 
    });
  }
});

// Create a new conversation or get existing one
app.post('/api/conversations', async (req, res) => {
  try {
    const { members } = req.body; // Array of email addresses
    
    // Sort members to ensure consistent ordering
    const sortedMembers = members.sort();
    
    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      members: { $all: sortedMembers, $size: sortedMembers.length }
    });

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        members: sortedMembers
      });
      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create conversation' 
    });
  }
});

// Get all messages for a conversation
app.get('/api/messages/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch messages' 
    });
  }
});

// Send a new message
app.post('/api/messages', async (req, res) => {
  try {
    const { conversationId, sender, text } = req.body;
    
    // Create new message
    const message = new Message({
      conversationId,
      sender,
      text
    });
    
    await message.save();

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text.length > 50 ? text.substring(0, 50) + '...' : text,
      lastMessageTime: new Date()
    });

    res.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message' 
    });
  }
});

// Get all registered users (for finding people to message)
app.get('/api/users/list', async (req, res) => {
  try {
    const users = await User.find(
      { status: 'approved', isVerified: true },
      { name: 1, email: 1, _id: 0 } // Only return name and email
    ).sort({ name: 1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users' 
    });
  }
});

const PORT = process.env.PORT || 5000; // Use port 5000

const startServer = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/jobportal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();