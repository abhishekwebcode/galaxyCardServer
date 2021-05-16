sudo apt-get install cmake -y
sudo apt-get install libopenblas-dev -y
sudo apt-get install libx11-dev libpng-dev -y
sudo apt install python3-opencv -y
cd dlib-19.6/
mkdir build
cd build
cmake ..
cmake --build . --config Release
sudo make install
sudo ldconfig
cd ..
pkg-config --libs --cflags dlib-1
cd ..
mkdir images
npm i
nodemon app.js