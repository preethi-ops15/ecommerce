const User                   = require("../models/User");
const bcrypt                 = require("bcryptjs");
const { sendMail }           = require("../utils/Emails");
const { generateOTP }        = require("../utils/GenerateOtp");
const Otp                    = require("../models/OTP");
const { sanitizeUser }       = require("../utils/SanitizeUser");
const { generateToken }      = require("../utils/GenerateToken");
const PasswordResetToken     = require("../models/PasswordResetToken");

// Build cookie options once
const cookieOptions = {
  sameSite: process.env.PRODUCTION === 'true' ? "None" : 'Lax',
  maxAge: parseInt(process.env.COOKIE_EXPIRATION_DAYS, 10) * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.PRODUCTION === 'true'
};

exports.signup = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password & create
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const createdUser = new User(req.body);
    await createdUser.save();

    // Generate token & set cookie
    const secureInfo = sanitizeUser(createdUser);
    const token = generateToken(secureInfo);
    res.cookie("token", token, cookieOptions);

    res.status(201).json(sanitizeUser(createdUser));
    } catch (error) {
    console.error("🔥 Signup error detail:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error during signup" });
  }

};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser && await bcrypt.compare(password, existingUser.password)) {
      const secureInfo = sanitizeUser(existingUser);
      const token = generateToken(secureInfo);
      res.cookie("token", token, cookieOptions);
      return res.status(200).json(sanitizeUser(existingUser));
    }

    // Invalid credentials: clear any cookie
    res.clearCookie("token", cookieOptions);
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const isValidUserId = await User.findById(req.body.userId);
    if (!isValidUserId) {
      return res.status(404).json({ message: 'User not found for OTP' });
    }

    const isOtpExisting = await Otp.findOne({ user: isValidUserId._id });
    if (!isOtpExisting) {
      return res.status(404).json({ message: 'OTP not found' });
    }

    if (isOtpExisting.expiresAt < new Date()) {
      await Otp.findByIdAndDelete(isOtpExisting._id);
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (await bcrypt.compare(req.body.otp, isOtpExisting.otp)) {
      await Otp.findByIdAndDelete(isOtpExisting._id);
      const verifiedUser = await User.findByIdAndUpdate(
        isValidUserId._id,
        { isVerified: true },
        { new: true }
      );
      return res.status(200).json(sanitizeUser(verifiedUser));
    }

    return res.status(400).json({ message: 'OTP is invalid or expired' });
  } catch (error) {
    console.error("verifyOtp error:", error);
    res.status(500).json({ message: "Some error occurred during OTP verification" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const existingUser = await User.findById(req.body.user);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await Otp.deleteMany({ user: existingUser._id });
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newOtp = new Otp({
      user: req.body.user,
      otp: hashedOtp,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME, 10)
    });
    await newOtp.save();

    await sendMail(
      existingUser.email,
      "OTP Verification",
      `Your OTP is: <b>${otp}</b>. Do not share it with anyone.`
    );

    res.status(201).json({ message: "OTP sent" });
  } catch (error) {
    console.error("resendOtp error:", error);
    res.status(500).json({ message: "Error occurred while resending OTP" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const isExistingUser = await User.findOne({ email: req.body.email });
    if (!isExistingUser) {
      return res.status(404).json({ message: "Email does not exist" });
    }

    await PasswordResetToken.deleteMany({ user: isExistingUser._id });

    const resetToken = generateToken(sanitizeUser(isExistingUser), true);
    const hashedToken = await bcrypt.hash(resetToken, 10);

    const newToken = new PasswordResetToken({
      user: isExistingUser._id,
      token: hashedToken,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME, 10)
    });
    await newToken.save();

    await sendMail(
      isExistingUser.email,
      "Password Reset Link",
      `<p>Click <a href="${process.env.ORIGIN}/reset-password/${isExistingUser._id}/${resetToken}">here</a> to reset.</p>`
    );

    res.status(200).json({ message: `Reset link sent to ${isExistingUser.email}` });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ message: "Error occurred sending reset link" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const isExistingUser = await User.findById(req.body.userId);
    if (!isExistingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isResetTokenExisting = await PasswordResetToken.findOne({ user: isExistingUser._id });
    if (!isResetTokenExisting || isResetTokenExisting.expiresAt < new Date()) {
      await PasswordResetToken.deleteMany({ user: isExistingUser._id });
      return res.status(404).json({ message: "Reset link invalid or expired" });
    }

    if (await bcrypt.compare(req.body.token, isResetTokenExisting.token)) {
      await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);
      await User.findByIdAndUpdate(
        isExistingUser._id,
        { password: await bcrypt.hash(req.body.password, 10) }
      );
      return res.status(200).json({ message: "Password updated successfully" });
    }

    return res.status(400).json({ message: "Invalid reset token" });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ message: "Error occurred resetting password" });
  }
};

exports.logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", cookieOptions);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error during logout" });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      return res.status(200).json(sanitizeUser(user));
    }
    return res.sendStatus(401);
  } catch (error) {
    console.error("checkAuth error:", error);
    res.sendStatus(500);
  }
};
