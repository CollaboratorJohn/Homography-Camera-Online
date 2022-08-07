# Homography-Camera-Online
A web camara application can do homography transform, Functions are provided in this project:
1. Browse real-time video from HikVision cameras and adjust cameras
2. Do homography rectification base on video frames
3. Do image sectional slicing

## Preparation
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

## Development
Execute order in project root folder:
```bash
npm run start
```