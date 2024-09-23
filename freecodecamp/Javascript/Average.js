function getAverage(scores) {
  let sum = 0;

  for (const score of scores) {
    sum += score;
  }

  return sum / scores.length;
}

function getGrade(score) {
  if (score === 100) {
    return "A++";
  } else if (score >= 90) {
    return "A";
  } else if (score >= 80) {
    return "B";
  } else if (score >= 70) {
    return "C";
  } else if (score >= 60) {
    return "D";
  } else {
    return "F";
  }
}

function hasPassingGrade(score) {
  return getGrade(score) !== "F";
}

// Main function to generate the student message
function studentMsg(scores, studentScore) {
  // Calculate class average
  const average = getAverage(scores);

  // Determine student's grade
  const grade = getGrade(studentScore);

  // Determine pass/fail status
  const passStatus = hasPassingGrade(studentScore) ? "passed" : "failed";

  // Construct and return the message
  return `Class average: ${average}. Your grade: ${grade}. You ${passStatus} the course.`;
}
console.log(studentMsg([92, 88, 12, 77, 57, 100, 67, 38, 97, 89], 37));
