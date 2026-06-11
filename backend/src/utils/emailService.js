export async function sendVerificationEmail(email, token) {
  const verificationLink = `http://localhost:4000/api/auth/verify?token=${token}`;

  setTimeout(() => {
    console.log("-----------------------------------------");
    console.log(`Sending verification email to: ${email}`);
    console.log(`Verification URL: ${verificationLink}`);
    console.log("-----------------------------------------");
  }, 100);
}
