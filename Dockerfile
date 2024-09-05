# Use the official Ubuntu image as the base
FROM ubuntu:latest

# Install curl, Node.js, Python, and pip
RUN apt-get update && \
    apt-get install -y curl gnupg software-properties-common && \
    # Install Node.js
    curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh && \
    apt-get install -y nodejs && \
    # Install Python 3.10
    apt-get install -y python3.10 python3-pip && \
    apt-get clean

# Check the installed versions
RUN node -v && npm -v && python3 -V && pip3 -V
# Set the working directory for Node.js application
WORKDIR /app/javascript

# Copy the Node.js package files and install dependencies
COPY javascript/package*.json ./
RUN npm install --verbose

# Copy the rest of the Node.js application files
COPY javascript/ .

# Set the working directory for Python application
WORKDIR /app/python

# Copy the Python requirements file and install dependencies
COPY python/requirements.txt ./
RUN pip3 install -r requirements.txt

# Copy the rest of the Python application files
COPY python/ .

# Expose the port the app runs on (adjust if necessary)
EXPOSE 3500

# Start the combined server process
CMD ["npm", "run", "serve"]
