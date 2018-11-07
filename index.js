const ini = require('ini');
const fs = require('fs');

const AWS_CONFIG_PATH = process.env.AWS_CONFIG_FILE || `${process.env.HOME}/.aws/config`;

const config = ini.parse(fs.readFileSync(AWS_CONFIG_PATH, 'utf-8'));

exports.getProfile = function getProfile(profileName) {
  let profile;
  if (profileName === 'default') profile = config.default;
  else profile = config[`profile ${profileName}`];

  if (!profile) throw new Error(`Profile not found: ${profileName}`);
  if (profile.source_profile) {
    const parent = getProfile(profile.source_profile);
    profile = {
      ...parent,
      ...profile,
    };
  }
  return profile;
};

exports.getRegionEnvVars = function getRegionEnvVars(profileName) {
  const region = exports.getProfile(profileName).region;
  if (!region) return [];
  return {
    AWS_DEFAULT_REGION: region,
    AWS_REGION: region,
  };
};
