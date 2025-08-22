const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema with upload reference
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  uploadId: { 
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'Upload',
    required: true 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  }
});
const User = mongoose.model('User', userSchema);

// Job Schema
const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
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

// Register endpoint - Step 2
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, uploadId } = req.body;

    // Create user
    const user = new User({
      name,
      email,
      password,
      uploadId
    });
    await user.save();

    // Update upload with user reference
    await Upload.findByIdAndUpdate(uploadId, {
      userId: user._id
    });

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

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check only in approved users (User collection)
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Return user data for frontend
    res.json({ success: true, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
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

app.listen(5000, () => console.log('Server running on port 5000'));