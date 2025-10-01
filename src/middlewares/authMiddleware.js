const jwt = require('jsonwebtoken');
const AdminUser = require('../models/admin/AdminUser');
const Staff = require('../models/admin/Staff');
const FemaleUser = require('../models/femaleUser/FemaleUser'); // Import FemaleUser model
const MaleUser = require('../models/maleUser/MaleUser');
const AgencyUser = require('../models/agency/AgencyUser');
const auth = async (req, res, next) => {
  let token;
  
  // Check if the Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token is found, respond with a 401 status
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  try {
    // Decode the token to get user information (either admin or female user)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check the route and decide whether to authenticate an admin, staff, or other users
    if (req.originalUrl.startsWith('/admin')) {
      // Try admin first, then staff
      req.admin = await AdminUser.findById(decoded.id).select('-passwordHash');
      if (req.admin) {
        req.userType = 'admin';
      } else {
        req.staff = await Staff.findById(decoded.id).select('-passwordHash');
        if (req.staff) {
          req.userType = 'staff';
        } else {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
      }
    } else if (req.originalUrl.startsWith('/female-user')) {
      // Female user authentication
      req.user = await FemaleUser.findById(decoded.id); // Store user data in req.user
      if (!req.user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
    }
    else if (req.originalUrl.startsWith('/male-user')) {
        // Male user authentication
        req.user = await MaleUser.findById(decoded.id); // Store user data in req.user
        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    }
    else if (req.originalUrl.startsWith('/agency')) {
        // Agency user authentication
        req.user = await AgencyUser.findById(decoded.id);
        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = auth;


// const jwt = require('jsonwebtoken');
// const AdminUser = require('../models/admin/AdminUser');

// const auth = async (req, res, next) => {
//   let token;
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   }
//   if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.admin = await AdminUser.findById(decoded.id).select('-passwordHash');
//     next();
//   } catch (error) {
//     res.status(401).json({ success: false, message: 'Invalid token' });
//   }
// };

// module.exports = auth;
