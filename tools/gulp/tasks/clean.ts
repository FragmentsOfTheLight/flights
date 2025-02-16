import { task, src, series } from 'gulp';
// @ts-ignore
import * as clean from 'gulp-clean';
// @ts-ignore
import * as deleteEmpty from 'delete-empty';

/**
 * Cleans the build output assets from the packages folders
 */
function cleanOutput() {
  console.log('Cleaning built files..');
  return src(
    [
      `dist/**/*.js`,
      `dist/**/*.d.ts`,
      `dist/**/*.js.map`,
      `dist/**/*.d.ts.map`,
    ],
    {
      read: false,
    },
  ).pipe(clean());
}

/**
 * Cleans empty dirs
 */
function cleanDirs(done: () => void) {
  console.log('Cleaning empty directories..');
  deleteEmpty.sync(`dist/`);
  done();
}

task('clean:output', cleanOutput);
task('clean:dirs', cleanDirs);
task('clean', series('clean:output', 'clean:dirs'));
