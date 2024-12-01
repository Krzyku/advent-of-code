const year = parseInt(process.argv[2]);
const day = parseInt(process.argv[3]);

const DELAY_SECONDS = 10;

const start = new Date(year, 11, day, 6, 0, DELAY_SECONDS);
const now = new Date();
const diff = start.getTime() - now.getTime();

if (diff < 0) {
  process.exit(0);
}

const [hours, minutes, seconds] = [
  diff / 1000 / 60 / 60,
  (diff / 1000 / 60) % 60,
  (diff / 1000) % 60,
].map((t) => Math.floor(t).toString().padStart(2, "0"));

console.log();
console.log(`Time to puzzle: ${hours}:${minutes}:${seconds}`);
process.exit(1);
