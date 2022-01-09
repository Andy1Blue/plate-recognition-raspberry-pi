sudo apt-get install libopencv-dev libtesseract-dev git cmake build-essential libleptonica-dev && sudo apt-get install liblog4cplus-dev libcurl3-dev && sudo apt-get install beanstalkd && git clone https://github.com/openalpr/openalpr.git && cd openalpr/src
&& mkdir build && cd build && cmake -DCMAKE_INSTALL_PREFIX:PATH=/usr -DCMAKE_INSTALL_SYSCONFDIR:PATH=/etc .. && make && sudo make install

# Test the library
# wget http://plates.openalpr.com/h786poj.jpg -O lp.jpg
# alpr lp.jpg