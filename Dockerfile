# Use the official Ubuntu image as the base
FROM ubuntu:latest

# Install curl, Node.js, Python, and pip
RUN apt-get update && \
    echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections && \
    apt-get install -y curl gnupg software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && apt install -y python3.10 python3.10-venv python3-pip python3.10-dev build-essential g++ cmake libomp-dev && \
    # Install Node.js
    curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh && \
    apt-get install -y nodejs && \
    # Install Python 3.10
    # apt-get install -y python3.10 python3-pip && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


# Check the installed versions
# RUN node -v && npm -v && python3 -V && pip3 -V
# Set the working directory for Node.js application
WORKDIR /app/javascript

# Copy the Node.js package files and install dependencies
COPY javascript/package*.json ./
#RUN npm cache clean --force
RUN npm install --verbose

# Copy the rest of the Node.js application files
COPY javascript/ .

# Set the working directory for Python application
WORKDIR /app/python

# Copy the Python requirements file and install dependencies
COPY backend_requirements.txt ./

# test stuff
RUN node -v && npm -v && python3.10 -V && pip3 -V

# Install Python packages in a virtual environment
RUN python3.10 -m venv /app/python/venv && \
    /app/python/venv/bin/pip install --upgrade pip && \
    # /app/python/venv/bin/pip install Cython==3.0.10 && \
    /app/python/venv/bin/pip install -r backend_requirements.txt


# Copy the rest of the Python application files
COPY python/ .

WORKDIR /app/javascript

# Expose the port the app runs on (adjust if necessary)
#EXPOSE 3500

# Start the combined server process
CMD ["/bin/bash", "-c", "source /app/python/venv/bin/activate && npm run serve"]
