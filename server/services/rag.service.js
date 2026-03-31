import fs from "fs";

// đọc file JSON đúng cách trong Node.js
const rawData = fs.readFileSync(
  new URL("../data/exercises.json", import.meta.url)
);

const exercises = JSON.parse(rawData);

export const getExercises = (profile) => {
  return exercises.filter(ex => {
    if (ex.difficulty !== profile.level) return false;

    if (profile.injury && !ex.injury_safe.includes(profile.injury)) {
      return false;
    }

    return true;
  });
};