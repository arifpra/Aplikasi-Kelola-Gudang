const iamRepo = require('./iam.repo');

async function getRoles() {
  return iamRepo.listRoles();
}

async function getPermissions() {
  return iamRepo.listPermissions();
}

module.exports = {
  getRoles,
  getPermissions,
};
