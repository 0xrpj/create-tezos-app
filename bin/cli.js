#!/usr/bin/env node

const { execSync } = require('child_process');

const runCommand = command => {
    try {
        execSync(`${command}`, { stdio: 'inherit' })
    } catch (e) {
        console.error(`Failed to execute ${command}`, e);
        return false;
    }
    return true;
}

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/0xrpj/create-tezos-dapp ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log("Sit tight...");

console.log("Cloning the repository...");
const checkOut = runCommand(gitCheckoutCommand);
if (!checkOut) process.exit(-1);

console.log("Installing dependencies...");
const installDeps = runCommand(installDepsCommand);
if (!installDeps) process.exit(-1);

console.log("Congratulations! You are ready to rock!!")
