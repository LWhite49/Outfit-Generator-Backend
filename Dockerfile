# Use the official Ubuntu image as the base
FROM ubuntu:latest

# Install Node.js, Python, and PM2
RUN apt-get update && \
    apt-get install -y curl nodejs npm python3.10 python3.10-pip && \
    npm install -g pm2 && \
    apt-get clean

# Set the working directory in the container
WORKDIR /app/javascript

# Copy the package files to the container app directory
COPY javascript/ .

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files
WORKDIR /app/python

COPY python/ .

# Install any required Python libraries
RUN pip3 install -r requirements.txt

# Expose the port the app runs on
EXPOSE 3500

# Use PM2 to start both the Node.js and Python processes
CMD ["pm2-runtime", "start", "pm2.config.js"]
