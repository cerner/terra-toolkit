module.exports = () => {
  const args = process.argv.slice(2);
  const maxInstancesIndex = args.indexOf('--maxInstances');
  const maxInstances = maxInstancesIndex !== -1 ? parseInt(args[maxInstancesIndex + 1], 10) : 1;

  return maxInstances;
};
