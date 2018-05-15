# use node as base image
FROM cerner/terra-node:$TERRA_NODE_TAG

# run the server
CMD ["npm", "run", "start"]
