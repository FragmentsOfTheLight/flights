import { task, watch, series, dest } from 'gulp';
import { createProject } from 'gulp-typescript';

const distId = process.argv.indexOf('--dist');
const dist = distId < 0 ? 'dist' : process.argv[distId + 1];

function buildTask() {
  console.log('Building project...');
  const project = createProject(`tsconfig-build.json`);
  return project.src().pipe(project()).pipe(dest(dist));
}

function productionTask() {
  console.log('Building project for production...');
  const project = createProject(`tsconfig-production.json`);
  return project.src().pipe(project()).pipe(dest(dist));
}

function defaultTask() {
  console.log('Watching files...');
  return watch(
    [
      `lib/**/*.ts`,
      `lib/*.ts`,
      `examples/**/*.ts`,
      `examples/*.ts`,
      `src/**/*.ts`,
      `src/*.ts`,
    ],
    series('build'),
  );
}

task('default', defaultTask);
task('build', buildTask);
task('watch', series('build', 'default'));
task('build:production', productionTask);
task('release', series('clean', 'build:production'));
