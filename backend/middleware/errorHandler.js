

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

//---------------------duplicate user
  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: 'Email already exists.' });
  }

  //--------------------ValidationError

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }


//-------------------------------------JsonWebTokenError

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }

  //------------------------------------TokenExpiredError

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired.' });
  }

  
//-------------------------SERVER ERROR 

  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Server error' });
};
module.exports = errorHandler;