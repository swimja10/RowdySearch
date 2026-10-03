import { readFileSync } from "node:fs";
import Fuse from "fuse.js";

const data = JSON.parse(
  readFileSync("./data/cleaned_grade_data.json", "utf8")
);

const list = Object.entries<any>(data).map(([name, info]) => ({
  name,
  department: info.Department,
  courses: Object.keys(info).filter((k) => k !== "Department" && k !== "RMP"),
}));

const fuse = new Fuse(list, {
  useTokenSearch: true,
  threshold: 0.3,
  keys: ["name", "department", "courses"],
});

let input = "Henry Apsaza";

const hit = fuse.search(input)[0].item;
const course = hit.courses[1];
const grades = data[hit.name][course];

console.log(course, grades, grades["A"]);

