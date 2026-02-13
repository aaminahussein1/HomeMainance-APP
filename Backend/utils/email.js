const sendEmail = async (options) => {
  console.log("Email sent to:", options.email);
  console.log("Subject:", options.subject);
  console.log("Message:", options.message);
};

module.exports = sendEmail;
