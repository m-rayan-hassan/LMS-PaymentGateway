import { ApiError, catchAsync } from "../middleware/error.middleware.js";
import { User } from "../models/user.model.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";
import { generateToken } from "../utils/generateToken.js";

export const createUserAccount = catchAsync(async (req, res) => {
  const { name, email, password, role = "student" } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new ApiError("User already exists", 400);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
  });
  await user.updateLastActive();
  generateToken(res, user, "Account Created Successfully");
});

export const authenticateUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne(
    { email: email.toLowerCase() }.select("+password"),
  );

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError("Invalid email or password", 401);
  }

  await user.updateLastActive();
  generateToken(res, user, `Welcome back ${user.name}`);
});

export const signoutUser = catchAsync(async (_, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({
    success: true,
    message: "Signed out successfully",
  });
});

export const getCurrentUserProfile = catchAsync(async (req, res) => {
  const user = User.findById(req.id).populate({
    path: "enrolledCourses.course",
    select: "title thumbnail description",
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      ...user.toJSON(),
      totalEnrolledCourses: user.totalEnrolledCourses,
    },
  });
});

export const updateUserProfile = catchAsync(async (req, res) => {
  const { name, email, bio } = req.id;

  const updatedData = {
    name,
    email: email?.toLowerCase(),
    bio: bio,
  };

  if (req.file) {
    const avatarResult = await uploadMedia(req.file.path);
    updatedData.avatar = avatarResult.secure_url;

    // delete old avatar
    const user = await User.findById(req.id);
    if (user.avatar && user.avatar !== "default-avatar.png") {
      await deleteMedia(user.avatar);
    }
  }

  // update user and get updated document

  const updatedUser = await User.findByIdAndUpdate(req.id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new ApiError("User not found!", 404);
  }

  res.status(200).json({
    success: true,
    message: "User profile successfully",
    data: updatedData,
  });
});

export const changeUserPassword = catchAsync(async (req, res) => {
  // TODO: Implement change user password functionality
  const { password, newPassword } = req.id;
  const user = await User.findByIdAndUpdate(req.id).select("+password");

  if (!(await user.comparePassword(password))) {
    throw new ApiError("Current password is incorrect", 401)
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  })
});


export const forgotPassword = catchAsync(async (req, res) => {
  // TODO: Implement forgot password functionality
  const { email } = req.body;

  const user = await User.findOne({email: email.toLowerCase()});
  
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({validateBeforeSave: false});
  
  // send token to email

  res.status(200).json({
    success: true,
    message: "Reset Password instructions sent to user's email successfully"
  });
  
});


export const resetPassword = catchAsync(async (req, res) => {
  // TODO: Implement reset password functionality
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: crypto.createHash("sha256").update(token).digest("hex"),
    resetPasswordExpiry: { gt: Date.now()}
  });

  if (!user) {
    throw new ApiError("Invalid or expired reset token");
  }

  user.password = password;
  user.resetPasswordToken = undefined,
  user.resetPasswordExpiry = undefined,
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful"
  })

});


export const deleteUserAccount = catchAsync(async (req, res) => {
  // TODO: Implement delete user account functionality
  const user = await User.findById(req.id);

  if (user.avatar && user.avatar != "default-avatar.png") {
    deleteMedia(user.avatar);
  }

  await User.findByIdAndDelete(req.id);

  res.status(200).json({
    success: true,
    message: "User account deleted successfully",
  })
});
