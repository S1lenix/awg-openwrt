const axios = require('axios');
const cheerio = require('cheerio');
const core = require('@actions/core');

const version = process.argv[2];
const filterTargetsStr = process.argv[3] || '';
const filterSubtargetsStr = process.argv[4] || '';

const filterTargets = filterTargetsStr ? filterTargetsStr.split(',').map(t => t.trim()).filter(t => t) : [];
const filterSubtargets = filterSubtargetsStr ? filterSubtargetsStr.split(',').map(s => s.trim()).filter(s => s) : [];

if (!version) {
  core.setFailed('Version argument is required');
  process.exit(1);
}

// Поддержка 25.x (rc тоже)
if (!/^25\.\d+\.\d+(-rc\d+)?$/.test(version)) {
  core.setFailed(`Unsupported version: ${version}`);
  process.exit(1);
}

const url = `https://downloads.openwrt.org/releases/${version}/targets/`;

async function fetchHTML(u) {
  const { data } = await axios.get(u);
  return cheerio.load(data);
}

async function getTargets() {
  const $ = await fetchHTML(url);
  const targets = [];
  $('table tr td.n a').each((_, el) => {
    const name = $(el).attr('href');
    if (name && name.endsWith('/')) targets.push(name.slice(0, -1));
  });
  return targets;
}

async function getSubtargets(target) {
  const $ = await fetchHTML(`${url}${target}/`);
  const subs = [];
  $('table tr td.n a').each((_, el) => {
    const name = $(el).attr('href');
    if (name && name.endsWith('/')) subs.push(name.slice(0, -1));
  });
  return subs;
}

async function getDetails(target, subtarget) {
  const packagesUrl = `${url}${target}/${subtarget}/packages/`;
  const $ = await fetchHTML(packagesUrl);
  let vermagic = '', pkgarch = '';

  $('a').each((_, el) => {
    const name = $(el).attr('href');
    if (name && name.startsWith('kernel_')) {
      // Для 25.x — .apk, для старых — .ipk
      const match = name.match(/kernel_\d+\.\d+\.\d+(?:-\d+)?[-~]([a-f0-9]+)(?:-r\d+)?_([a-zA-Z0-9_-]+)\.(apk|ipk)$/);
      if (match) {
        vermagic = match[1];
        pkgarch = match[2];
      }
    }
  });
  return { vermagic, pkgarch };
}

async function main() {
  try {
    const targets = await getTargets();
    const jobConfig = [];

    for (const target of targets) {
      if (filterTargets.length && !filterTargets.includes(target)) continue;

      const subtargets = await getSubtargets(target);
      for (const subtarget of subtargets) {
        if (filterSubtargets.length && !filterSubtargets.includes(subtarget)) continue;

        const isAuto = filterTargets.length === 0 && filterSubtargets.length === 0;
        const isManual = filterTargets.length && filterSubtargets.length &&
                         filterTargets.includes(target) && filterSubtargets.includes(subtarget);

        if (!isAuto && !isManual) continue;

        const { vermagic, pkgarch } = await getDetails(target, subtarget);
        jobConfig.push({ tag: version, target, subtarget, vermagic, pkgarch });
      }
    }

    core.setOutput('job-config', JSON.stringify(jobConfig));
  } catch (err) {
    core.setFailed(err.message);
  }
}

main();
