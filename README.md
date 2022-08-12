# Homography-Camera-Online
A web camara application can do homography transform, Functions are provided in this project:
1. Real-time video from HikVision cameras browsing
2. Homography rectification for video frames 
3. Sectional image slicing

## Preparation
Node version: 16.14.2
Please make sure your computer can connect to a HikVision webcam.
1. Download ffmpeg and compile. For windows users, download and unzip package.
2. Create and set server .env file in ./server folder:
```bash
PORT=8000
FFMPEG_PATH=${absolute path for ffmpeg.exe}
```
3. Install dependencies
```bash
cd server && npm i
cd clinet && npm i
```

## Run in Development Mode
Execute order in project root folder:
```bash
npm run start
```

## Run in Production Mode
Execute order in project root folder.
You should change .env file in ./server folder. Make sure ENV=PROD is declareed in this file
sample .env file(PORT and VIDEO_PORT are fixed):
```bash
PORT=8000
VIDEO_PORT=8001
ENV=DEV
FFMPEG_PATH=D:\ffmpeg-4.3.1-win64-static\bin\ffmpeg.exe
```
orders:
```bash
cd clinet && npm run build
cp build ../server && cp public ../server
cd ../server && npm run start
```