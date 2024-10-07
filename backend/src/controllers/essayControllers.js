const fetchQuestion = async (req, res) => {
  try {
    // Array of predefined IELTS essay questions
    const questions = [
      "Some people think that technology has made life easier while others believe it has made life more difficult. Discuss both views and give your opinion.",
      "Many people think that the use of mobile phones should be banned in public places like libraries, shops, and public transport. Do you agree or disagree?",
      "Some believe that children should be taught to be competitive in school. Others, however, say that cooperation and team working skills are more important. Discuss both views and give your opinion.",
      "Nowadays, many people choose to be self-employed rather than working for a company or organization. Why might this be the case? What are the disadvantages of being self-employed?",
      "Some people think that economic progress is the most important goal for a country, while others think that other types of progress, such as improving health, education, and the environment, are equally important. Discuss both views and give your opinion.",
    ];

    // Select a random question
    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Error fetching question" });
  }
};

module.exports = {
  fetchQuestion,
};
