import * as fs from "fs";
import * as fsExtra from "fs-extra";
import * as cp from "child_process";
import { wasm2lua } from ".";

fsExtra.ensureDirSync(__dirname + "/../test/");

let totalTests = 0;
let passedTests = 0;

let files = fs.readdirSync(__dirname + "/../resources/tests/c-testsuite/");
for(let fileName of files) {
    if(fileName.match(/\.c$/)) {
        console.log(`Running test ${fileName}...`);

        let fullPath = `${__dirname}/../resources/tests/c-testsuite/${fileName}`;
        let wasmPath = `${fullPath}.wasm`;
        let expectedOutPath = `${fullPath}.expected`;

        let wasm = fs.readFileSync(wasmPath);
        let inst = new wasm2lua(wasm, {});
        fs.writeFileSync(`${__dirname}/../test/test.lua`,inst.outBuf.join(""));

        console.log(`compile finished.`)
        let expectedOut = fs.readFileSync(expectedOutPath);
        let prog = cp.spawnSync(`luajit`,["resources/testsuite-host.lua"],{
            
        });
        
        totalTests++;
        if(prog.status != 0) {
            console.error(`test (${fileName}) failed with code ${prog.status}...`)
        }
        else if(prog.stderr.toString().length != 0) {
            console.error(`test (${fileName}) failed due to stderr...`)
            console.error(prog.stderr.toString())
        }
        else if(prog.stdout.toString().replace(/\r\n?/g,"\n") !== expectedOut.toString().replace(/\r\n?/g,"\n")) {
            console.error(`test failed... (${fileName})`)
            console.error(`expected: ${expectedOut.toString()}`)
            console.error(`actual: ${prog.stdout.toString()}`)
        }
        else {
            console.log(`test passed!`)
            passedTests++;
        }
    }
}

let files2 = fs.readdirSync(__dirname + "/../resources/tests/assemblyscript/");
for(let fileName of files2) {
    if(fileName.match(/\.wasm$/)) {
        console.log(`Running test ${fileName}...`);

        let wasmPath = `${__dirname}/../resources/tests/assemblyscript/${fileName}`;

        let wasm = fs.readFileSync(wasmPath);
        let inst = new wasm2lua(wasm, {});
        fs.writeFileSync(`${__dirname}/../test/test.lua`,inst.outBuf.join(""));

        console.log(`compile finished.`)
        let prog = cp.spawnSync(`nilajit`,["resources/testsuite-host.lua"],{
            
        });
        
        totalTests++;
        if(prog.status != 0) {
            console.error(`test (${fileName}) failed with code ${prog.status}...`)
        }
        else if(prog.stderr.toString().length != 0) {
            console.error(`test (${fileName}) failed due to stderr...`)
            console.error(prog.stderr.toString())
        }
        else {
            console.log(`test passed!`)
            passedTests++;
        }
    }
}

console.log(`All done! ${passedTests}/${totalTests} tests passed :)`);
