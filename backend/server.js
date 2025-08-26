const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcryptjs'); // Import bcrypt

const app = express();
app.use(cors());
app.use(express.json());

// User Schema with upload reference
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

// POST /api/admin/registrations
app.post('/api/admin/register', upload.single('file'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const newRequest = new AdminRegister({
      name,
      email,
      password,
      file: {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer
      },
      status: 'pending'
    });
    await newRequest.save();
    res.json({ success: true, message: 'Submitted for admin review' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Submission failed' });
  }
});

app.get('/api/admin/registrations', async (req, res) => {
  try {
    const requests = await AdminRegister.find();
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching requests' });
  }
});

// Get pending user registrations
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' }).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// Update user status (approve/reject)
app.patch('/api/admin/user/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId, 
      { 
        status,
        isVerified: status === 'approved'
      }, 
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ 
      success: true, 
      message: `User ${status} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ success: false, message: 'Error updating user status' });
  }
});

// Get job categories with counts
app.get('/api/jobs/categories', async (req, res) => {
  try {
    const categories = await Job.aggregate([
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
    
    // Define all available categories with their display info
    const allCategories = [
      { name: 'Healthcare', description: 'Medical and health services' },
      { name: 'Education', description: 'Teaching and educational roles' },
      { name: 'Administration', description: 'Office and administrative work' },
      { name: 'Social Services', description: 'Community and social programs' },
      { name: 'Security', description: 'Safety and security positions' },
      { name: 'Maintenance', description: 'Repair and maintenance work' },
      { name: 'Technology', description: 'IT and technology roles' },
      { name: 'Agriculture', description: 'Farming and agricultural work' },
      { name: 'Business', description: 'Business and entrepreneurship' },
      { name: 'Other', description: 'Other job opportunities' }
    ];
    
    // Merge category info with counts
    const categoryStats = allCategories.map(category => {
      const stat = categories.find(c => c._id === category.name);
      return {
        ...category,
        count: stat ? stat.count : 0
      };
    });
    
    res.json({
      success: true,
      categories: categoryStats,
      totalJobs: categories.reduce((sum, cat) => sum + cat.count, 0)
    });
  } catch (error) {
    console.error('Error fetching job categories:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching job categories' 
    });
  }
});

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

// Admin: Approve or reject a registration
app.patch('/api/admin/registration/:id', async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const request = await AdminRegister.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    // Update status
    request.status = status;
    await request.save();

    // If approved, move to User collection
    if (status === 'approved') {
      // Check if user already exists
      const existingUser = await User.findOne({ email: request.email });
      if (!existingUser) {
        const newUser = new User({
          name: request.name,
          email: request.email,
          password: request.password,
          uploadId: null, // Or set if you want to link an upload
          isVerified: true
        });
        await newUser.save();
      }
      // Remove from AdminRegister
      await AdminRegister.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'User approved and moved to users collection' });
    }

    res.json({ success: true, message: `Registration ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
});

app.get('/api/admin/registration/file/:id', async (req, res) => {
  try {
    const request = await AdminRegister.findById(req.params.id);
    if (!request || !request.file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    res.set('Content-Type', request.file.contentType);
    res.set('Content-Disposition', `attachment; filename="${request.file.filename}"`);
    res.send(request.file.data);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error downloading file' });
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

// Update the register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, uploadId } = req.body;

    // Store password directly (no hashing)
    console.log('Creating user with password:', password);

    // Create user with plain password
    const user = new User({
      name,
      email,
      password,
      uploadId
    });
    
    await user.save();

    // Update upload with user reference if uploadId exists
    if (uploadId) {
      await Upload.findByIdAndUpdate(uploadId, {
        userId: user._id
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
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
        isVerified: user.isVerified
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