// Function to update the moving average
const updateAverage = (oldAvg, newValue, weight = 0.1) => {
  return oldAvg * (1 - weight) + newValue * weight;
};
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export {
  updateAverage,
  delay,
};