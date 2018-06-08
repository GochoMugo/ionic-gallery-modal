#!/usr/bin/env bash

peer_deps=$(node - <<EOF
const pkg = require('./package.json');
const peerDeps = Object.keys(pkg.peerDependencies).map(function(peerDepName) {
  let peerDepVersion = pkg.peerDependencies[peerDepName];
  const lastVersionIndex = peerDepVersion.indexOf('||');
  if (lastVersionIndex !== -1) {
    peerDepVersion = peerDepVersion.slice(lastVersionIndex + 2).trim();
  }
  return peerDepName + '@' + peerDepVersion;
});
console.log(peerDeps.join(" "));
EOF
)
npm install --no-save ${peer_deps}
