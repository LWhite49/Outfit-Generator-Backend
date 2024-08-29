# Use the official Ubuntu image as the base
FROM ubuntu:latest

# Install Node.js and Python
RUN apt-get update && \
    apt-get install -y nodejs npm python3.10 python3.10-pip && \
    apt-get clean

# Set the working directory in the container
WORKDIR /app

# Copy the package files to the container app directory
COPY javascript/package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Install any required Python libraries
# Replace <your-python-libraries> with actual libraries if needed
RUN pip3 install <your-python-libraries>

# Expose the port the app runs on
EXPOSE 3000

# Start the React server
CMD ["npm", "start"]
