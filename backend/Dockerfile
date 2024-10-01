# Use an official Python runtime as a parent image
FROM python:3.11-slim


RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    pkg-config \
    libx11-dev \
    libatlas-base-dev \
    libgtk-3-dev \
    libboost-python-dev \
    gcc \
    gfortran \
    libopenblas-dev \
    liblapack-dev \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the rest of the app's code into the container
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt


# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV PYTHONUNBUFFERED=1

# Run the FastAPI app (using uvicorn) when the container launches
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
