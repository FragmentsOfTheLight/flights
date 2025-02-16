import { task, watch, series, dest, src } from 'gulp';
import { createProject } from 'gulp-typescript';

const umdProject = createProject(`tsconfig-umd.json`)

const file = process.argv[4]
const distId = process.argv.indexOf('--dist');
const dist = distId < 0 ? 'dist/examples' : process.argv[distId + 1];
// console.log(file)

function devTask() 
{
    console.log(`Running dev example "${file}"...`);
    const result = 
        // umdProject.src()
        src(`examples/${file}.ts`)
        .pipe(umdProject())
        .pipe(dest(dist));
        
    return result;
}

function devWatchTask() 
{
    console.log('Watching dev files...');
    return watch([`examples/${file}.ts`], function() {
        series('dev');
    });
}

// task(file, () => devTask());
// task(`${file}:watch`, () => devWatchTask());

task('example', devTask);
task('example:watch', devWatchTask);