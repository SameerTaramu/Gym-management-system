export const validateTrainer = ({ name, email, password }) => {
  if (!name.trim()) return "Name is required";
  if (!email.trim()) return "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return "Please enter a valid email address";

  if (!password || password.length < 6)
    return "Password must be at least 6 characters";

  return null;
};
