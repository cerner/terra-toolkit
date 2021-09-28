FROM docker.cernerrepos.net/selenium/node-firefox:3.141.59-titanium
MAINTAINER Cloud Application Development Platform "DL_ProjectGo_platform_engineers@cerner.com"

# Switch back to root, to copy files
USER root

# Add a new entry point
COPY start.sh /opt/bin
RUN chmod 755 /opt/bin/start.sh

# Switch back to seluser
USER seluser

# Run our new entrypoint
CMD ["/opt/bin/start.sh"]
